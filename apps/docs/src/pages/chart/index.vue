<script setup lang="ts">
import { computed } from 'vue';
import { pascalCase } from '@vean/aria/shared';
import { chartMenuData } from '~/constants/menus';

definePage({ layout: 'default' });

const { t } = useI18n();

interface ChartKind {
  name: string;
  label: string;
  icon: string;
  desc: string;
}

const iconMap: Record<string, string> = {
  area: 'lucide:area-chart',
  bar: 'lucide:chart-column',
  line: 'lucide:chart-line',
  pie: 'lucide:chart-pie',
  scatter: 'lucide:chart-scatter'
};

const chartKinds = computed<ChartKind[]>(() =>
  chartMenuData.flatMap(group =>
    group.items.map(item => ({
      name: item,
      label: pascalCase(item),
      icon: iconMap[item] ?? 'lucide:bar-chart-3',
      desc: t(`chart.kinds.${item}`, '')
    }))
  )
);
</script>

<template>
  <div class="mx-auto max-w-screen-2xl space-y-8 px-4 py-8 md:px-8 md:pt-12">
    <div class="space-y-4">
      <div
        class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        <SIcon icon="lucide:bar-chart-3" class="text-sm text-primary" />
        <span>{{ t('layout.header.chart') }}</span>
      </div>
      <!-- Hero title stays a paragraph: the markdown below owns the page's only h1. -->
      <p class="text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.96] tracking-[-0.05em] text-foreground">
        {{ t('chart.catalog.title') }}
      </p>
    </div>

    <DocMd path="chart/index" />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SButtonLink v-for="kind in chartKinds" :key="kind.name" :to="`/chart/${kind.name}`" class="h-auto">
        <SCard class="h-full transition-colors hover:border-primary/50">
          <template #title>
            <span class="flex items-center gap-2">
              <SIcon :icon="kind.icon" class="text-lg text-primary" />
              {{ kind.label }}
            </span>
          </template>
          <template #default>
            <p class="text-sm text-muted-foreground">
              {{ kind.desc }}
            </p>
          </template>
        </SCard>
      </SButtonLink>
    </div>
  </div>
</template>
