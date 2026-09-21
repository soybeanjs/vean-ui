<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { kebabCase, pascalCase } from '@vean/aria/shared';
import { useDocOutline } from '~/composables/use-doc-outline';
import { menuData, newlyComponentKeys } from '~/constants/menus';

// NOTE: ubean ignores `pages/**/components/**` (colocation convention), so this
// lives in `catalog/` and overrides the route path back to `/components`.
definePage({ name: 'ComponentsIndex', path: '/components', layout: 'default' });

const { t } = useI18n();

const docOutline = useDocOutline();

const featuredComponentKeys = ['button', 'input', 'select', 'dialog', 'table', 'form'];

const featuredComponentMeta = {
  button: {
    icon: 'lucide:mouse-pointer-click',
    iconClass: 'text-primary bg-primary/10'
  },
  input: {
    icon: 'lucide:text-cursor-input',
    iconClass: 'text-info bg-info/10'
  },
  select: {
    icon: 'lucide:list-filter',
    iconClass: 'text-success bg-success/10'
  },
  dialog: {
    icon: 'lucide:app-window',
    iconClass: 'text-warning bg-warning/10'
  },
  table: {
    icon: 'lucide:table-properties',
    iconClass: 'text-primary bg-primary/10'
  },
  form: {
    icon: 'lucide:clipboard-list',
    iconClass: 'text-info bg-info/10'
  }
} as const;

const componentGroupMeta = {
  general: {
    icon: 'lucide:layout-grid',
    iconClass: 'text-primary bg-primary/10'
  },
  groupLayout: {
    icon: 'lucide:panels-top-left',
    iconClass: 'text-info bg-info/10'
  },
  navigation: {
    icon: 'lucide:compass',
    iconClass: 'text-success bg-success/10'
  },
  forms: {
    icon: 'lucide:square-pen',
    iconClass: 'text-warning bg-warning/10'
  },
  dataDisplay: {
    icon: 'lucide:gallery-vertical-end',
    iconClass: 'text-primary bg-primary/10'
  },
  feedback: {
    icon: 'lucide:message-square-warning',
    iconClass: 'text-warning bg-warning/10'
  },
  overlay: {
    icon: 'lucide:layers-3',
    iconClass: 'text-info bg-info/10'
  },
  utilities: {
    icon: 'lucide:wrench',
    iconClass: 'text-success bg-success/10'
  }
} as const;

const componentGroups = computed(() =>
  menuData
    .filter(group => group.items.length > 0)
    .map(group => ({
      ...group,
      label: t(group.i18n),
      icon: componentGroupMeta[group.value as keyof typeof componentGroupMeta]?.icon ?? 'lucide:shapes',
      iconClass:
        componentGroupMeta[group.value as keyof typeof componentGroupMeta]?.iconClass ?? 'text-primary bg-primary/10',
      items: group.items.map(item => ({
        key: item,
        label: pascalCase(item),
        path: `/components/${kebabCase(item)}`,
        isNew: newlyComponentKeys.includes(item)
      }))
    }))
);

const totalComponents = computed(() => componentGroups.value.reduce((total, group) => total + group.items.length, 0));
const newComponentsCount = computed(() => newlyComponentKeys.length);

const featuredComponents = computed(() => {
  return featuredComponentKeys.map(item => {
    const group = componentGroups.value.find(entry => entry.items.some(component => component.key === item));
    const component = group?.items.find(entry => entry.key === item);
    const meta = featuredComponentMeta[item as keyof typeof featuredComponentMeta];

    return {
      key: item,
      label: component?.label ?? pascalCase(item),
      path: component?.path ?? `/components/${kebabCase(item)}`,
      groupLabel: group?.label ?? '',
      description: t(`components.catalog.featured.${item}`),
      icon: meta.icon,
      iconClass: meta.iconClass
    };
  });
});

const quickActions = computed(() => [
  {
    title: t('components.catalog.quick_actions.quick_start.title'),
    description: t('components.catalog.quick_actions.quick_start.desc'),
    to: '/overview/quick-start',
    icon: 'lucide:rocket'
  },
  {
    title: t('components.catalog.quick_actions.introduction.title'),
    description: t('components.catalog.quick_actions.introduction.desc'),
    to: '/overview/introduction',
    icon: 'lucide:book-open-text'
  },
  {
    title: t('components.catalog.quick_actions.theming.title'),
    description: t('components.catalog.quick_actions.theming.desc'),
    to: '/overview/theming',
    icon: 'lucide:swatch-book'
  }
]);

const summaryStats = computed(() => [
  {
    label: t('components.catalog.stats.total'),
    value: totalComponents.value
  },
  {
    label: t('components.catalog.stats.categories'),
    value: componentGroups.value.length
  },
  {
    label: t('components.catalog.stats.featured'),
    value: featuredComponents.value.length
  },
  {
    label: t('components.catalog.stats.new'),
    value: newComponentsCount.value
  }
]);

watch(
  componentGroups,
  groups => {
    docOutline.value = groups.map(group => ({
      href: `#${group.value}-heading`,
      title: group.label
    }));
  },
  {
    immediate: true
  }
);

onBeforeUnmount(() => {
  docOutline.value = [];
});
</script>

<template>
  <div class="mx-auto max-w-screen-2xl space-y-8 pb-10">
    <section
      class="relative overflow-hidden px-6 py-7 sm:px-8 sm:py-9 xl:px-10 border border-border/50 dark:border-border rounded-xl"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary-400)/0.12),transparent_30%),radial-gradient(circle_at_bottom_left,hsl(var(--primary-700)/0.07),transparent_28%)]"
      />
      <div class="relative grid gap-8 xl:grid-cols-[minmax(0,1.12fr)_22rem] xl:items-start">
        <div class="space-y-5">
          <div
            class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            <SIcon icon="lucide:layout-grid" class="text-sm text-primary" />
            <span>{{ t('components.catalog.kicker') }}</span>
          </div>

          <div class="max-w-3xl space-y-3">
            <h1 class="text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.96] tracking-[-0.05em] text-foreground">
              {{ t('components.catalog.title') }}
            </h1>
            <p class="text-sm leading-7 text-muted-foreground sm:text-base">
              {{ t('components.catalog.description') }}
            </p>
          </div>

          <p class="max-w-3xl text-sm leading-7 text-muted-foreground">
            {{ t('components.catalog.helper') }}
          </p>

          <div class="flex flex-wrap gap-3">
            <SButtonLink to="/overview/quick-start" size="lg" variant="solid" shape="rounded">
              {{ t('components.catalog.actions.start') }}
            </SButtonLink>
            <SButtonLink to="/overview/introduction" size="lg" variant="pure" shape="rounded">
              {{ t('components.catalog.actions.learn') }}
            </SButtonLink>
          </div>
        </div>

        <SCard :title="t('components.catalog.stats_title')" split class="docs-card overflow-hidden">
          <template #default>
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div v-for="stat in summaryStats" :key="stat.label" class="docs-subtle-card px-4 py-3">
                <div class="text-2xl font-bold tracking-[-0.04em] text-foreground">
                  {{ stat.value }}
                </div>
                <div class="mt-1 text-sm text-muted-foreground">{{ stat.label }}</div>
              </div>
            </div>
          </template>
        </SCard>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-3">
      <SLink
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="group docs-subtle-card p-5 hover:border-primary/35"
      >
        <div class="flex items-start gap-4">
          <div class="rounded-2xl bg-primary/10 p-3 text-xl text-primary">
            <SIcon :icon="action.icon" />
          </div>
          <div class="space-y-2">
            <h2 class="text-lg font-semibold tracking-[-0.02em] text-foreground group-hover:text-primary">
              {{ action.title }}
            </h2>
            <p class="text-sm leading-6 text-muted-foreground">{{ action.description }}</p>
          </div>
        </div>
      </SLink>
    </section>

    <SCard :title="t('components.catalog.sections.featured.title')" split class="docs-card overflow-hidden">
      <template #default>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SLink
            v-for="component in featuredComponents"
            :key="component.key"
            :to="component.path"
            class="docs-subtle-card group p-5 hover:border-primary/35"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="rounded-2xl p-3 text-xl" :class="component.iconClass">
                <SIcon :icon="component.icon" />
              </div>
              <span
                v-if="component.groupLabel"
                class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {{ component.groupLabel }}
              </span>
            </div>

            <div class="mt-4 space-y-2">
              <h3 class="text-lg leading-7 font-semibold tracking-[-0.02em] text-foreground group-hover:text-primary">
                {{ component.label }}
              </h3>
              <p class="text-sm leading-6 text-muted-foreground">{{ component.description }}</p>
            </div>
          </SLink>
        </div>
      </template>
    </SCard>

    <section class="space-y-4">
      <div class="grid gap-5">
        <SCard
          v-for="group in componentGroups"
          :key="group.value"
          :aria-labelledby="`${group.value}-heading`"
          split
          class="docs-card overflow-hidden"
        >
          <template #title>
            <div class="flex min-w-0 items-center gap-3">
              <div class="rounded-2xl p-3 text-xl" :class="group.iconClass">
                <SIcon :icon="group.icon" />
              </div>
              <h3 :id="`${group.value}-heading`" class="text-xl font-semibold tracking-[-0.02em] text-foreground">
                {{ group.label }}
              </h3>
            </div>
          </template>
          <template #extra>
            <span>
              {{ t('components.catalog.group_count', { count: group.items.length }) }}
            </span>
          </template>
          <template #default>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SButtonLink
                v-for="component in group.items"
                :key="component.key"
                :to="component.path"
                variant="ghost"
                shape="rounded"
                class="group docs-subtle-card justify-between"
              >
                <div class="min-w-0 flex items-center gap-2.5">
                  <h4 class="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {{ component.label }}
                  </h4>
                  <STag v-if="component.isNew" size="sm" variant="soft" color="success" shape="rounded">
                    {{ t('components.catalog.badges.new') }}
                  </STag>
                </div>

                <SIcon
                  icon="lucide:arrow-up-right"
                  class="shrink-0 text-sm text-muted-foreground transition-colors group-hover:text-primary"
                />
              </SButtonLink>
            </div>
          </template>
        </SCard>
      </div>
    </section>
  </div>
</template>
