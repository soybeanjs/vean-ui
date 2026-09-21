/**
 * Template generation and scaffolding system.
 *
 * Generates project files from templates and customizes them based on config.
 * All project file-creation logic lives here so that commands/init.ts stays
 * focused on user interaction (prompts, CLI flags, config).
 */

import { existsSync } from 'fs';
import fs from 'fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { UI_SOURCE_PATH } from '../registry/constants';
import { getTemplate, listTemplates } from './templates';
import type { FrameworkType, TemplateVariables } from './templates';

// ---------------------------------------------------------------------------
// Variable interpolation
// ---------------------------------------------------------------------------

/**
 * Replace `{{variable}}` placeholders in file content with actual values.
 */
function interpolateVariables(content: string, vars: TemplateVariables): string {
  return content
    .replaceAll('{{projectName}}', vars.projectName)
    .replaceAll('{{uiDir}}', vars.uiDir)
    .replaceAll('{{resolverPath}}', vars.resolverPath);
}

// ---------------------------------------------------------------------------
// Main scaffold entry-point
// ---------------------------------------------------------------------------

export interface ScaffoldOptions {
  /** Project name (fallback: directory basename). */
  projectName?: string;
  /** Component output directory (e.g. "src/ui"). @default "src/ui" */
  uiDir?: string;
  /** Whether to also scaffold Nuxt module files. @default false */
  nuxt?: boolean;
}

/**
 * Scaffold a new project from a built-in template.
 *
 * Writes all template files, `package.json`, `pnpm-workspace.yaml`,
 * `uno.config.ts`, `tsconfig.json`, and copies the Vean resolver/Nuxt
 * module from the source package.
 */
export async function scaffoldFromTemplate(
  projectDir: string,
  templateName: string,
  options: ScaffoldOptions = {}
): Promise<void> {
  const template = getTemplate(templateName as FrameworkType);

  if (!template) {
    throw new Error(`Unknown template: ${templateName}`);
  }

  const projectName = options.projectName || path.basename(projectDir);
  const uiDir = options.uiDir || 'src/ui';
  const resolverPath = `./${uiDir}/resolver`;

  const vars: TemplateVariables = { projectName, uiDir, resolverPath };

  // Create project directory
  await fs.mkdir(projectDir, { recursive: true });

  // Write template files (with variable interpolation)
  for (const [filePath, content] of Object.entries(template.files)) {
    const fullPath = path.join(projectDir, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, interpolateVariables(content, vars), 'utf-8');
  }

  // Write package.json
  const packageJson = {
    name: projectName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: template.scripts,
    dependencies: template.dependencies,
    devDependencies: template.devDependencies
  };

  await fs.writeFile(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf-8');

  // Infrastructure files (shared across all projects)
  await ensurePnpmWorkspace(projectDir);
  await ensureTypeScriptConfig(projectDir, uiDir);
  await generatePackModules(projectDir, uiDir, options.nuxt || templateName === 'nuxt');

  console.log(`✔ Scaffolded ${template.name} project: ${projectName}`);
}

// ---------------------------------------------------------------------------
// Update existing project with template files (merge mode)
// ---------------------------------------------------------------------------

/**
 * Add template files to an existing project without overwriting by default.
 */
export async function mergeTemplateFiles(
  projectDir: string,
  templateName: string,
  options: ScaffoldOptions & { overwrite?: boolean } = {}
): Promise<void> {
  const template = getTemplate(templateName as FrameworkType);

  if (!template) {
    throw new Error(`Unknown template: ${templateName}`);
  }

  const projectName = options.projectName || path.basename(projectDir);
  const uiDir = options.uiDir || 'src/ui';
  const resolverPath = `./${uiDir}/resolver`;
  const vars: TemplateVariables = { projectName, uiDir, resolverPath };
  const overwrite = options.overwrite ?? false;

  let addedCount = 0;
  let skippedCount = 0;

  for (const [filePath, content] of Object.entries(template.files)) {
    const fullPath = path.join(projectDir, filePath);
    const exists = await fileExists(fullPath);

    if (exists && !overwrite) {
      skippedCount++;
      continue;
    }

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, interpolateVariables(content, vars), 'utf-8');
    addedCount++;
  }

  console.log(`✔ Merged template files`);
  console.log(`  Added: ${addedCount}`);
  console.log(`  Skipped: ${skippedCount}`);
}

// ---------------------------------------------------------------------------
// pnpm-workspace.yaml
// ---------------------------------------------------------------------------

/**
 * Create a `pnpm-workspace.yaml` if one doesn't already exist.
 *
 * For monorepo projects the template references `packages/**`, otherwise
 * it references the current directory (`.`).
 */
export async function ensurePnpmWorkspace(cwd: string, isMonorepo = false): Promise<void> {
  const workspacePath = path.join(cwd, 'pnpm-workspace.yaml');

  if (await fileExists(workspacePath)) {
    return;
  }

  const content = isMonorepo
    ? `packages:
  - 'packages/**'
shamefullyHoist: true
strictDepBuilds: false
`
    : `packages:
  - '.'
`;

  await fs.writeFile(workspacePath, content, 'utf-8');
  console.log('✔ Created pnpm-workspace.yaml');
}

// ---------------------------------------------------------------------------
// tsconfig.json
// ---------------------------------------------------------------------------

/**
 * Write a `tsconfig.json` if one doesn't already exist.
 */
export async function ensureTypeScriptConfig(cwd: string, uiDir: string): Promise<void> {
  const tsconfigPath = path.join(cwd, 'tsconfig.json');

  if (await fileExists(tsconfigPath)) return;

  const content = `${[
    '{',
    '  "compilerOptions": {',
    '    "target": "ESNext",',
    '    "jsx": "preserve",',
    '    "jsxImportSource": "vue",',
    '    "lib": ["DOM", "ESNext"],',
    '    "module": "ESNext",',
    '    "moduleResolution": "bundler",',
    '    "paths": {',
    `      "#ui/*": ["./${uiDir}/*"]`,
    '    },',
    '    "types": ["node", "vite/client"],',
    '    "resolveJsonModule": true,',
    '    "strict": true,',
    '    "strictNullChecks": true,',
    '    "noUnusedLocals": true,',
    '    "allowSyntheticDefaultImports": true,',
    '    "esModuleInterop": true,',
    '    "forceConsistentCasingInFileNames": true,',
    '    "isolatedModules": true',
    '   },',
    '  "include": ["./**/*.ts", "./**/*.d.ts", "./**/*.tsx", "./**/*.vue"],',
    '  "exclude": ["node_modules", "dist", "src/typings"]',
    '}'
  ].join('\n')}\n`;

  await fs.writeFile(tsconfigPath, content, 'utf-8');
  console.log('✔ Created tsconfig.json');
}

// ---------------------------------------------------------------------------
// Resolver / Nuxt module / constants
// ---------------------------------------------------------------------------

/**
 * Copy resolver, constants, and (for Nuxt) the Nuxt module from the
 * installed `@vean/ui` package into the project's ui directory.
 */
export async function generatePackModules(cwd: string, uiDir: string, isNuxt = false): Promise<void> {
  const sourceRoot = findSourceRoot();
  if (!sourceRoot) return;

  const files: Record<string, string> = {
    'resolver/index.ts': `${UI_SOURCE_PATH}/resolver/index.ts`,
    'constants/components.ts': `${UI_SOURCE_PATH}/constants/components.ts`
  };

  // Only generate the Nuxt module for Nuxt projects
  if (isNuxt) {
    files['nuxt/index.ts'] = `${UI_SOURCE_PATH}/nuxt/index.ts`;
  }

  for (const [relPath, srcPath] of Object.entries(files)) {
    const src = path.join(sourceRoot, srcPath);
    if (!existsSync(src)) continue;

    const dest = path.join(cwd, uiDir, relPath);
    if (existsSync(dest)) continue;

    // const fullUiDir = path.join(cwd, uiDir);

    let content = await fs.readFile(src, 'utf-8');
    content = content.replaceAll('//---', '');
    content = `import { join } from 'node:path';\nimport { cwd } from 'node:process';\n${content}`;
    content = content.replace("from: '@vean/ui'", `from: join(cwd(), '${uiDir}', 'components', path)`);
    content = content.replace("filePath: '@vean/ui'", `filePath: join(cwd(), '${uiDir}', 'components', path)`);

    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, content, 'utf-8');
    console.log(`✔ Created ${uiDir}/${relPath}`);
  }
}

function findSourceRoot(): string | null {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  while (true) {
    if (existsSync(path.join(dir, UI_SOURCE_PATH))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

// ---------------------------------------------------------------------------
// Listing & helpers
// ---------------------------------------------------------------------------

/** Get recommended config for template. */
export function getTemplateConfig(_templateName: string): Record<string, any> {
  return {};
}

/** List all available templates with descriptions. */
export function listAllTemplates(): Array<{
  name: string;
  description: string;
  framework: string;
}> {
  return listTemplates();
}

export { getTemplate, listTemplates, type FrameworkType, type TemplateVariables };
export { TEMPLATES } from './templates';

/** Helper to check if file exists. */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
