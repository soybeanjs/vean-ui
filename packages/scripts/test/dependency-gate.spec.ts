import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runDependencyGate } from '../src/commands/dependency-gate';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map(root => rm(root, { recursive: true, force: true })));
  vi.restoreAllMocks();
  process.exitCode = 0;
});

interface FixtureOptions {
  readonly name?: string;
  readonly vuePeer?: string;
  readonly source?: string;
}

/**
 * 建一个只含一个包的仓库根，让 `runDependencyGate` 能独立跑。
 *
 * `runDependencyGate` 从 `process.cwd()` 读根并以 `packages/*` 为扫描面，所以夹具必须真的落盘。
 */
async function createFixture(options: FixtureOptions = {}): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), 'vean-dep-gate-'));
  temporaryRoots.push(root);

  const { name = '@vean/ui', vuePeer, source = "import { ref } from 'vue';\nexport const a = ref;\n" } = options;
  const packageDir = path.join(root, 'packages', name.replace('@vean/', ''));
  const srcDir = path.join(packageDir, 'src');
  await mkdir(srcDir, { recursive: true });

  const peerDependencies: Record<string, string> = {};
  if (vuePeer) {
    peerDependencies.vue = vuePeer;
  }

  await writeFile(
    path.join(packageDir, 'package.json'),
    JSON.stringify({ name, version: '0.0.0', peerDependencies }, null, 2),
    'utf8'
  );
  await writeFile(path.join(srcDir, 'index.ts'), source, 'utf8');

  return root;
}

/** 在夹具里跑 gate，返回收集到的 stderr 文本（`runDependencyGate` 用 console.error 逐条打印）。 */
async function runGate(root: string): Promise<string> {
  const cwd = process.cwd();
  const errors: string[] = [];
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(' '));
  });

  process.chdir(root);
  try {
    runDependencyGate();
  } finally {
    process.chdir(cwd);
  }

  return errors.join('\n');
}

const VUE_35_APIS = ['useTemplateRef', 'useId', 'onWatcherCleanup'] as const;
const VUE_33_APIS = ['toValue'] as const;

describe('dependency gate · vue peer floor', () => {
  it('声明 >=3.2.0 却 import 3.5 API → 报出来（就是 ubean 兼容矩阵踩到的那个组合）', async () => {
    const root = await createFixture({
      vuePeer: '>=3.2.0',
      source: "import { useTemplateRef } from 'vue';\nexport const a = useTemplateRef;\n"
    });

    const output = await runGate(root);

    expect(output).toContain('useTemplateRef');
    expect(output).toContain('since 3.5.0');
    expect(output).toContain('">=3.2.0"');
    expect(process.exitCode).toBe(1);
  });

  it('每一级 3.5 API 都单独被卡（不是只认了 useTemplateRef 一个）', async () => {
    for (const api of VUE_35_APIS) {
      const root = await createFixture({
        vuePeer: '>=3.4.0',
        source: `import { ${api} } from 'vue';\nexport const a = ${api};\n`
      });

      const output = await runGate(root);

      expect(output, `${api} 应当被卡住`).toContain(api);
      process.exitCode = 0;
    }
  });

  it('3.3 的 toValue 也被卡：floor 不是只钉 3.5 这一个数字', async () => {
    for (const api of VUE_33_APIS) {
      const root = await createFixture({
        vuePeer: '>=3.2.0',
        source: `import { ${api} } from 'vue';\nexport const a = ${api};\n`
      });

      const output = await runGate(root);

      expect(output).toContain(api);
      expect(output).toContain('since 3.3.0');
      process.exitCode = 0;
    }
  });

  it('floor 已抬到 >=3.5.0 就放行', async () => {
    const root = await createFixture({
      vuePeer: '>=3.5.0',
      source: "import { useTemplateRef, useId } from 'vue';\nexport const a = useTemplateRef;\n"
    });

    const output = await runGate(root);

    expect(output).toBe('');
    expect(process.exitCode).not.toBe(1);
  });

  it('更精确的 floor（^3.5.43）同样放行 —— 下界算得出就够，不要求写成 >=', async () => {
    const root = await createFixture({
      vuePeer: '^3.5.43',
      source: "import { useTemplateRef } from 'vue';\nexport const a = useTemplateRef;\n"
    });

    expect(await runGate(root)).toBe('');
    expect(process.exitCode).not.toBe(1);
  });

  it('import type 不算：类型导入不产生运行时导出要求', async () => {
    const root = await createFixture({
      vuePeer: '>=3.2.0',
      source: "import type { useTemplateRef } from 'vue';\nexport type A = typeof useTemplateRef;\n"
    });

    expect(await runGate(root)).toBe('');
    expect(process.exitCode).not.toBe(1);
  });

  it('没声明 vue peer 的包不看（@vean/theme / @vean/unocss / @vean/cli 就在这一桶）', async () => {
    const root = await createFixture({
      name: '@vean/theme',
      source: "import { useId } from 'vue';\nexport const a = useId;\n"
    });

    expect(await runGate(root)).toBe('');
    expect(process.exitCode).not.toBe(1);
  });

  it('别名导入（as）也能认出 API 名', async () => {
    const root = await createFixture({
      vuePeer: '>=3.2.0',
      source: "import { useId as useVueId } from 'vue';\nexport const a = useVueId;\n"
    });

    expect(await runGate(root)).toContain('useId');
    process.exitCode = 0;
  });

  it('非数字范围（workspace:* / latest）跳过而不瞎猜 —— 错的 floor 比没有 floor 更坏', async () => {
    const root = await createFixture({
      vuePeer: 'workspace:*',
      source: "import { useTemplateRef } from 'vue';\nexport const a = useTemplateRef;\n"
    });

    expect(await runGate(root)).toBe('');
    expect(process.exitCode).not.toBe(1);
  });
});

describe('dependency gate · 原有能力不被新扫描破坏', () => {
  it('被禁的 import 仍然报', async () => {
    const root = await createFixture({ source: "import defu from 'defu';\nexport const a = defu;\n" });

    expect(await runGate(root)).toContain('defu');
    expect(process.exitCode).toBe(1);
  });

  it('干净包 + 合法 vue floor 全绿', async () => {
    const root = await createFixture({ vuePeer: '>=3.5.0' });

    expect(await runGate(root)).toBe('');
    expect(process.exitCode).not.toBe(1);
  });
});
