import { pascalCase, kebabCase } from '@vean/aria/shared';
import { menuData, newlyComponentKeys, chartMenuData, chartNewlyComponentKeys } from './constants/menus';
import { createTranslator, type Locale } from './i18n';

/**
 * Sidebar model, ported from `apps/docs/src/components/sider-menu.vue`.
 *
 * The ubean sidebar is a `STreeMenu` Vue component; this module produces the same
 * link tree as plain data so the layout can render it as static markup (the tree
 * is navigation — a link list needs no client runtime).
 */
export interface MenuNode {
  label: string;
  value: string;
  to?: string;
  icon?: string;
  tag?: string;
  children?: MenuNode[];
}

/** Upgrade guides, flattened from the generated changelog index (`getUpgradeGuides()`). */
const UPGRADE_GUIDES = [
  { label: 'v0.50.0', leaf: 'v0.50.0' },
  { label: 'v0.50.0 · date', leaf: 'v0.50.0-date' },
  { label: 'v0.50.0 · rebrand', leaf: 'rebrand' },
  { label: 'v0.40.0', leaf: 'v0.40.0' }
];

export const COMPONENTS_OVERVIEW_VALUE = 'components-overview';

function componentGroupNodes(t: (key: string) => string): MenuNode[] {
  return menuData
    .filter(group => group.items.length > 0)
    .map(group => ({
      label: t(group.i18n),
      value: group.value,
      children: group.items.map(item => ({
        label: pascalCase(item),
        value: kebabCase(item),
        to: `/components/${kebabCase(item)}`,
        tag: newlyComponentKeys.includes(item) ? '🎉new' : undefined
      }))
    }));
}

function chartGroupNodes(t: (key: string) => string): MenuNode[] {
  return chartMenuData.map(group => ({
    label: t(group.i18n),
    value: group.value,
    children: group.items.map(item => ({
      label: pascalCase(item),
      value: item,
      to: `/chart/${item}`,
      tag: chartNewlyComponentKeys.includes(item) ? '🎉new' : undefined
    }))
  }));
}

export function overviewMenus(t: (key: string) => string): MenuNode[] {
  return [
    {
      label: t('layout.header.getting_started'),
      value: 'overview',
      icon: 'lucide:rocket',
      children: [
        { label: t('sidebar.installation'), value: 'installation', to: '/overview/installation' },
        { label: t('sidebar.introduction'), value: 'introduction', to: '/overview/introduction' },
        { label: t('sidebar.quick_start'), value: 'quick-start', to: '/overview/quick-start' },
        { label: t('sidebar.theming'), value: 'theming', to: '/overview/theming' },
        { label: t('sidebar.llms'), value: 'llms', to: '/overview/llms' },
        { label: t('sidebar.skills'), value: 'skills', to: '/overview/skills' },
        { label: t('sidebar.cli'), value: 'cli', to: '/cli' },
        {
          label: t('sidebar.migration'),
          value: 'migration',
          children: UPGRADE_GUIDES.map(guide => ({
            label: guide.label,
            value: guide.leaf,
            to: `/overview/migration/${guide.leaf}`
          }))
        }
      ]
    }
  ];
}

export function componentsMenus(t: (key: string) => string): MenuNode[] {
  return [
    {
      label: t('layout.header.components'),
      value: 'components',
      icon: 'lucide:layout-grid',
      children: [
        { label: t('components.catalog.title'), value: COMPONENTS_OVERVIEW_VALUE, to: '/components' },
        ...componentGroupNodes(t)
      ]
    }
  ];
}

export function chartMenus(t: (key: string) => string): MenuNode[] {
  return [
    {
      label: t('layout.header.chart'),
      value: 'chart',
      icon: 'lucide:bar-chart-3',
      children: [
        { label: t('chart.catalog.title'), value: 'chart-overview', to: '/chart' },
        ...chartGroupNodes(t)
      ]
    }
  ];
}

/** Aria docs are not written yet — the sidebar shows only the placeholder entry. */
export function ariaMenus(t: (key: string) => string): MenuNode[] {
  return [
    {
      label: t('layout.header.aria'),
      value: 'aria',
      icon: 'lucide:code-xml',
      children: [{ label: t('aria.catalog.title'), value: 'aria-overview', to: '/aria' }]
    }
  ];
}

/** Mirrors the `section` branch in `sider-menu.vue`. */
export function sidebarMenus(barePath: string, t: (key: string) => string): MenuNode[] {
  const section = barePath.split('/').filter(Boolean)[0] ?? '';

  if (section === 'overview') {
    return overviewMenus(t);
  }

  if (section === 'components') {
    return componentsMenus(t);
  }

  if (section === 'chart') {
    return chartMenus(t);
  }

  if (section === 'aria') {
    return ariaMenus(t);
  }

  return [];
}

/** Mirrors the `selected` derivation in `sider-menu.vue`. */
export function selectedMenuValue(barePath: string): string {
  const [dir, value, leaf] = barePath.split('/').filter(Boolean);

  if (dir === 'overview' && value === 'migration' && leaf) {
    return leaf;
  }

  if (dir && !value) {
    const valueMap: Record<string, string> = {
      overview: 'installation',
      components: COMPONENTS_OVERVIEW_VALUE,
      chart: 'chart-overview',
      aria: 'aria-overview'
    };

    return valueMap[dir] ?? '';
  }

  return value ?? '';
}

/** Convenience for callers that only have a locale. */
export function menusFor(locale: Locale, barePath: string): MenuNode[] {
  return sidebarMenus(barePath, createTranslator(locale));
}
