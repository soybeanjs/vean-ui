import type { SearchSection } from '@ubean/content';
import { resolveContentRoutePath } from './content-route';
import { readGeneratedMessagePath } from './generated-messages';
import type { GeneratedMessages } from './generated-messages';
import { buildReleaseSearchSections } from './release-search';

/**
 * 将生成的组件 API 数据（apps/docs/src/generated/api）并入全文搜索的 sections。
 *
 * 组件文档的 `## API` 由 `<ComponentApi>` 运行时渲染，markdown 正文只含组件标签，
 * 因此 prop / emit 名称、类型与描述无法被 `__search.json` 检索到。这里把 API 成员
 * 转成章节级 SearchSection（title = 组件名 + 成员名，content = 类型 + 描述），
 * 与内容 sections 合并，使「搜组件具体 API」成为可能。章节 id 带 `/zh` 前缀规则，
 * 与内容 sections 的 locale 过滤（isCurrentLocaleHit）保持一致。
 *
 * 生成的 API 数据与文档页并非一一对应（如 `listbox` / `theme-customizer` 只有
 * API 数据、没有对应 markdown），因此 API sections 只保留「落在内容 sections
 * 已有路由上」的条目，避免搜索结果指向 404。
 */

const API_KINDS = ['props', 'emits', 'slots'] as const;

type ApiKind = (typeof API_KINDS)[number];

interface ApiMember {
  name: string;
  type: string;
  description?: string;
  descriptionKey?: string;
}

interface ApiKindDef {
  kind?: string;
  members?: ApiMember[];
}

interface ApiFile {
  // 包级汇总索引文件（api 各包的 index.json）的 shape 是 `{ components }`，component/symbols 可能缺失。
  component?: string;
  // symbol 名（如 Button）→ { props, emits, ... }
  symbols?: Record<string, Record<string, ApiKindDef>>;
}

const apiModules = import.meta.glob<{ default: ApiFile }>('../generated/api/*/*.json');
const zhLocaleModules = import.meta.glob<{ default: GeneratedMessages }>('../generated/api-locales/zh-CN.json');

/**
 * `../generated/api/<pkg>/<name>.json` 的 glob key → 组件文档路由前缀。
 * aria 只有 aria-only 组件（如 visually-hidden），它们的文档页仍在
 * `ui` 文档区（`/components/<name>`）下，所以与 ui 共用同一前缀。
 */
function routePrefix(path: string): string {
  const pkg = path.split('/').at(-2);

  return pkg === 'ui' || pkg === 'aria' ? '/components' : `/${pkg}`;
}

/**
 * 某个 locale 的内容 sections 覆盖到的文档路由（无 `/zh` 前缀）。
 * 用 `resolveContentRoutePath` 换算，与命中跳转共用同一套 slug → 路由规则。
 */
function collectDocumentedRoutes(contentSections: SearchSection[]): Set<string> {
  return new Set(
    contentSections.map(section =>
      resolveContentRoutePath(
        section.id
          .split('#')[0]
          .replace(/^\/zh(?=\/)/u, '')
          .replace(/^\/+/u, '')
      )
    )
  );
}

/** 加载懒 glob 的模块值（带容错：单个文件解析失败不阻断整体）。 */
async function loadGlobEntries<T>(
  modules: Record<string, () => Promise<{ default: T }>>
): Promise<Array<{ path: string; data: T }>> {
  const entries = await Promise.all(
    Object.entries(modules).map(async ([path, loader]) => {
      try {
        return { path, data: (await loader()).default };
      } catch {
        return null;
      }
    })
  );

  return entries.filter((entry): entry is { path: string; data: T } => entry !== null);
}

/** 英文 API sections（无 locale 前缀的 id）。 */
function buildApiSectionsForLocale(
  files: Array<{ path: string; data: ApiFile }>,
  localePathPrefix: string,
  resolveDescription: (key: string | undefined, fallback: string | undefined) => string,
  documentedRoutes: Set<string>
): SearchSection[] {
  return files.flatMap(({ path, data }) => {
    const component = data.component ?? '';
    const symbols = data.symbols ?? {};

    // 跳过包级汇总索引文件（api/*/index.json 的 shape 是 `{ components }`）。
    if (!component || Object.keys(symbols).length === 0) {
      return [];
    }

    const localRoute = `${routePrefix(path)}/${component}`;

    // 没有对应文档页的组件（只有 API 数据）不产出 section，否则命中会跳到 404。
    if (!documentedRoutes.has(localRoute)) {
      return [];
    }

    const route = `${localePathPrefix}${localRoute}`;
    const sections: SearchSection[] = [];

    for (const [symbolName, kinds] of Object.entries(symbols)) {
      for (const kind in kinds) {
        const def = kinds[kind];

        if (!API_KINDS.includes(kind as ApiKind) || !def.members) {
          continue;
        }

        for (const member of def.members) {
          if (!member.name || !member.type) {
            continue;
          }

          const description = resolveDescription(member.descriptionKey, member.description);

          sections.push({
            // id 必须带上 symbol 名：同一组件的多个子组件常共享同名成员
            // （如 Accordion / AccordionCompact 都有 props `items`），
            // 只拼 kind + name 会产生重复 id，使 MiniSearch.addAll 抛错。
            id: `${route}#api-${symbolName}-${kind}-${member.name}`,
            title: `${symbolName} ${member.name} (${kind})`,
            titles: [`${data.component} · API`],
            level: 2,
            content: description
              ? `${member.type.replace(/\s+/gu, ' ')} — ${description}`
              : member.type.replace(/\s+/gu, ' ')
          });
        }
      }
    }

    return sections;
  });
}

/**
 * 组装 useContentSearch 的完整 sections：
 * 服务端内容 sections（`__search.json` 全部 collection）+ 生成数据 sections
 * （changelog releases 见 release-search.ts，组件 API 见下方 buildApiSections）。
 * 返回后按 id 前缀（`/zh`）由渲染层过滤当前 locale。
 */
export async function loadContentSearchSections(): Promise<SearchSection[]> {
  const [remotePayload, apiEntries, localeEntries] = await Promise.all([
    fetch('/__search.json')
      .then(res => (res.ok ? res.json() : {}))
      .catch(() => ({})),
    loadGlobEntries(apiModules),
    loadGlobEntries(zhLocaleModules)
  ]);

  const contentSections = Object.values(remotePayload).flat() as SearchSection[];
  const releaseSections = buildReleaseSearchSections();
  const zhLocale = localeEntries[0]?.data ?? null;

  // 按 `/zh` 前缀切分（与渲染层的 isCurrentLocaleHit 同一判据），
  // 使每个 locale 只用自己那套文档路由来校验 API sections。
  const zhContentSections = contentSections.filter(section => section.id.startsWith('/zh/'));
  const enContentSections = contentSections.filter(section => !section.id.startsWith('/zh/'));

  // 译文文件按 `a.b.c` 点号路径嵌套，必须逐段下钻读取（曾是直接 `locale[key]`，
  // 导致中文 API 搜索静默回退到英文描述）。
  const resolve =
    (locale: GeneratedMessages | null) =>
    (key: string | undefined, fallback: string | undefined): string =>
      (key ? readGeneratedMessagePath(locale ?? {}, key)?.trim() : '') || (fallback ?? '');

  const enApiSections = buildApiSectionsForLocale(
    apiEntries,
    '',
    resolve(null),
    collectDocumentedRoutes(enContentSections)
  );
  const zhApiSections = buildApiSectionsForLocale(
    apiEntries,
    '/zh',
    resolve(zhLocale),
    collectDocumentedRoutes(zhContentSections)
  );

  return [...contentSections, ...releaseSections, ...enApiSections, ...zhApiSections];
}
