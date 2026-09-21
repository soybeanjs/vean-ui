<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { extractLocaleFromPath } from 'ubean/client';
import { kebabCase, pascalCase } from '@vean/aria/shared';
import type { TreeMenuOptionData } from '@vean/ui';
import { menuData, newlyComponentKeys, chartMenuData, chartNewlyComponentKeys } from '~/constants/menus';
import { getUpgradeGuides } from '~/shared/generated-changelog';

type Emits = {
  select: [];
};

const emit = defineEmits<Emits>();

const route = useRoute();
const { t } = useI18n();

const selected = ref<string>('');

const componentsOverviewValue = 'components-overview';

const barePath = computed(() => extractLocaleFromPath(route.path).pathWithoutLocale);

const section = computed(() => barePath.value.split('/').filter(Boolean)[0] ?? '');

const componentMenus = computed<TreeMenuOptionData[]>(() =>
  menuData
    .filter(group => group.items.length > 0)
    .map(group => ({
      label: t(`${group.i18n}`),
      value: group.value,
      children: group.items.map(item => ({
        label: pascalCase(item),
        value: kebabCase(item),
        to: `/components/${kebabCase(item)}`,
        tag: newlyComponentKeys.includes(item) ? '🎉new' : undefined
      }))
    }))
);

const chartComponentMenus = computed<TreeMenuOptionData[]>(() =>
  chartMenuData.map(group => ({
    label: t(`${group.i18n}`),
    value: group.value,
    children: group.items.map(item => ({
      label: pascalCase(item),
      value: item,
      to: `/chart/${item}`,
      tag: chartNewlyComponentKeys.includes(item) ? '🎉new' : undefined
    }))
  }))
);

const overviewMenus = computed<TreeMenuOptionData[]>(() => [
  {
    isGroup: true,
    label: t('layout.header.getting_started'),
    value: 'overview',
    icon: 'lucide:rocket',
    children: [
      {
        label: t('sidebar.installation'),
        value: 'installation',
        to: '/overview/installation'
      },
      {
        label: t('sidebar.introduction'),
        value: 'introduction',
        to: '/overview/introduction'
      },
      {
        label: t('sidebar.quick_start'),
        value: 'quick-start',
        to: '/overview/quick-start'
      },
      {
        label: t('sidebar.theming'),
        value: 'theming',
        to: '/overview/theming'
      },
      {
        label: t('sidebar.llms'),
        value: 'llms',
        to: '/overview/llms'
      },
      {
        label: t('sidebar.skills'),
        value: 'skills',
        to: '/overview/skills'
      },
      {
        label: t('sidebar.cli'),
        value: 'cli',
        to: '/cli'
      },
      {
        label: t('sidebar.migration'),
        value: 'migration',
        children: getUpgradeGuides().map(guide => ({
          label: guide.label,
          value: guide.docPath.split('/').pop() ?? guide.version,
          to: guide.path
        }))
      }
    ]
  }
]);

const componentsMenus = computed<TreeMenuOptionData[]>(() => [
  {
    isGroup: true,
    label: t('layout.header.components'),
    value: 'components',
    icon: 'lucide:layout-grid',
    children: [
      {
        label: t('components.catalog.title'),
        value: componentsOverviewValue,
        to: '/components'
      },
      ...componentMenus.value
    ]
  }
]);

const chartMenus = computed<TreeMenuOptionData[]>(() => [
  {
    isGroup: true,
    label: t('layout.header.chart'),
    value: 'chart',
    icon: 'lucide:bar-chart-3',
    children: [
      {
        label: t('chart.catalog.title'),
        value: 'chart-overview',
        to: '/chart'
      },
      ...chartComponentMenus.value
    ]
  }
]);

// aria docs are not written yet (D8) — sidebar shows only the placeholder entry
const ariaMenus = computed<TreeMenuOptionData[]>(() => [
  {
    isGroup: true,
    label: t('layout.header.aria'),
    value: 'aria',
    icon: 'lucide:code-xml',
    children: [
      {
        label: t('aria.catalog.title'),
        value: 'aria-overview',
        to: '/aria'
      }
    ]
  }
]);

const menus = computed<TreeMenuOptionData[]>(() => {
  if (section.value === 'overview') {
    return overviewMenus.value;
  }

  if (section.value === 'components') {
    return componentsMenus.value;
  }

  if (section.value === 'chart') {
    return chartMenus.value;
  }

  if (section.value === 'aria') {
    return ariaMenus.value;
  }

  return [];
});

watchEffect(() => {
  const [dir, value, leaf] = barePath.value.split('/').filter(Boolean);

  if (dir === 'overview' && value === 'migration' && leaf) {
    selected.value = leaf;

    return;
  }

  if (dir && !value) {
    const valueMap: Record<string, string> = {
      overview: 'installation',
      components: componentsOverviewValue,
      chart: 'chart-overview',
      aria: 'aria-overview'
    };

    selected.value = valueMap[dir] || '';

    return;
  }

  selected.value = value || '';
});
</script>

<template>
  <div class="max-h-full overflow-auto md:border md:border-border/50 md:dark:border-border md:rounded-xl">
    <STreeMenu :model-value="selected" :items="menus" :indent="4" @update:model-value="emit('select')" />
  </div>
</template>
