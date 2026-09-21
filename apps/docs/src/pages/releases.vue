<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { pascalCase } from '@vean/aria/shared';
import { useGeneratedI18n } from '~/composables/use-generated-i18n';
import { resolveContentRoutePath } from '~/shared/content-route';
import { getReleaseChangelogDocument } from '~/shared/generated-changelog';
import type {
  GeneratedChangelogEntryType,
  GeneratedReleaseChangelogNote,
  GeneratedReleaseChangelogNoteType,
  GeneratedReleaseChangelogVersion
} from '~/shared/generated-changelog';

definePage({ layout: 'default' });

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { resolveGeneratedText } = useGeneratedI18n();

const releaseDocument = computed(() => getReleaseChangelogDocument());
const releases = computed(() => releaseDocument.value.releases);
const componentQuery = ref('');
const onlyComponentRelated = ref(false);
const isFilterInputFocused = ref(false);
const expandedReleaseVersions = ref<string[]>([]);
const routeComponentQuery = computed(() => resolveRouteComponentQuery(route.query.component));
const routeOnlyComponentRelated = computed(() => resolveRouteOnlyComponentRelated(route.query.related));
const normalizedComponentQuery = computed(() => normalizeSearchValue(componentQuery.value));
const componentOptions = computed(() => {
  return Array.from(new Set(releases.value.flatMap(release => release.components))).sort((left, right) =>
    left.localeCompare(right)
  );
});
const suggestedComponents = computed(() => {
  const query = normalizedComponentQuery.value;
  const baseComponents = query
    ? componentOptions.value.filter(component => component.includes(query))
    : componentOptions.value;

  return baseComponents.slice(0, 8);
});
const showSuggestionPanel = computed(() => isFilterInputFocused.value && suggestedComponents.value.length > 0);
const displayedReleases = computed<GeneratedReleaseChangelogVersion[]>(() => {
  const query = normalizedComponentQuery.value;
  const displayed: GeneratedReleaseChangelogVersion[] = [];

  for (const release of releases.value) {
    let entries = release.entries;

    if (query) {
      entries = entries.filter(entry => entry.components.some(component => component.includes(query)));
    }

    if (onlyComponentRelated.value) {
      entries = entries.filter(entry => entry.components.length > 0);
    }

    if (!entries.length) {
      continue;
    }

    const components = release.components.filter(component =>
      entries.some(entry => entry.components.includes(component))
    );
    const typeCounts = entries.reduce<Record<GeneratedChangelogEntryType, number>>(
      (counts, entry) => {
        counts[entry.type] += 1;

        return counts;
      },
      {
        breaking: 0,
        feature: 0,
        fix: 0,
        optimization: 0,
        refactor: 0,
        docs: 0,
        chore: 0,
        style: 0
      }
    );

    displayed.push({
      ...release,
      entries,
      entryCount: entries.length,
      componentCount: components.length,
      components,
      typeCounts
    });
  }

  return displayed;
});
const latestRelease = computed(() => displayedReleases.value[0] ?? null);
const trackedReleaseCount = computed(() => displayedReleases.value.length);
const hasComponentFilter = computed(() => Boolean(normalizedComponentQuery.value));

const githubChangelogUrl = 'https://github.com/soybeanjs/vean-ui/blob/main/CHANGELOG.md';
const highlightedEntryCount = 4;
const highlightedComponentCount = 8;

const typeOrder: GeneratedChangelogEntryType[] = [
  'breaking',
  'feature',
  'fix',
  'optimization',
  'refactor',
  'docs',
  'chore',
  'style'
];

const typeClassMap: Record<GeneratedChangelogEntryType, string> = {
  breaking: 'border-destructive/60 bg-destructive/15 text-destructive font-bold',
  feature: 'border-primary/25 bg-primary/10 text-primary',
  fix: 'border-destructive/25 bg-destructive/10 text-destructive',
  optimization: 'border-info/25 bg-info/10 text-info',
  refactor: 'border-warning/25 bg-warning/10 text-warning',
  docs: 'border-success/25 bg-success/10 text-success',
  chore: 'border-lime/25 bg-lime/10 text-lime',
  style: 'border-blue/25 bg-blue/10 text-blue'
};

const noteConfigMap: Record<GeneratedReleaseChangelogNoteType, { color: 'warning' | 'info'; icon: string }> = {
  breaking: { color: 'warning', icon: 'lucide:triangle-alert' },
  info: { color: 'info', icon: 'lucide:info' }
};

const actionLinks = computed(() => {
  const links = [];

  if (latestRelease.value) {
    links.push({
      label: t('releases_page.actions.compare_release'),
      href: latestRelease.value.compareUrl,
      target: '_blank' as const
    });
  }

  links.push(
    {
      label: t('releases_page.actions.full_changelog'),
      href: githubChangelogUrl,
      target: '_blank' as const
    },
    {
      label: t('releases_page.actions.browse_components'),
      to: '/components'
    }
  );

  return links;
});

function resolveTypeLabel(type: GeneratedChangelogEntryType) {
  return t(`changelog.types.${type}`);
}

function resolveSummary(summary: string, summaryKey: string | null) {
  return resolveGeneratedText(summary, summaryKey);
}

function resolveNoteConfig(type: GeneratedReleaseChangelogNoteType) {
  return noteConfigMap[type];
}

function resolveNoteLabel(type: GeneratedReleaseChangelogNoteType) {
  return t(`changelog.notes.${type}`);
}

function resolveNoteSummary(summary: string, summaryKey: string) {
  return resolveGeneratedText(summary, summaryKey);
}

function resolveNoteDocLink(note: GeneratedReleaseChangelogNote) {
  return note.docPath ? resolveContentRoutePath(note.docPath) : '';
}

/** The upgrade guide route of a release, when any of its notes links one. */
function resolveReleaseDocLink(release: GeneratedReleaseChangelogVersion) {
  return release.notes.map(resolveNoteDocLink).find(Boolean) ?? '';
}

/**
 * A curated breaking note already states what broke and links the upgrade guide,
 * so the generated count banner would only repeat it. The banner stays for
 * releases whose breaking changes carry no curated note.
 */
function hasCuratedBreakingNote(release: GeneratedReleaseChangelogVersion) {
  return release.notes.some(note => note.type === 'breaking');
}

function isNewComponent(release: GeneratedReleaseChangelogVersion, component: string) {
  return release.newComponents.includes(component);
}

type ReleaseEntry = GeneratedReleaseChangelogVersion['entries'][number];

interface ReleaseEntryScopeGroup {
  key: string;
  scope: string;
  entryCount: number;
  entries: ReleaseEntry[];
  component?: string;
}

interface ReleaseEntryTypeGroup {
  key: GeneratedChangelogEntryType;
  type: GeneratedChangelogEntryType;
  entryCount: number;
  scopes: ReleaseEntryScopeGroup[];
}

function getOrderedTypeCounts(release: GeneratedReleaseChangelogVersion) {
  return typeOrder.map(type => ({ type, count: release.typeCounts[type] ?? 0 })).filter(item => item.count > 0);
}

function getHighlightedEntries(release: GeneratedReleaseChangelogVersion) {
  return release.entries.slice(0, highlightedEntryCount);
}

function getDisplayedEntries(release: GeneratedReleaseChangelogVersion) {
  if (isReleaseExpanded(release.version)) {
    return release.entries;
  }

  return getHighlightedEntries(release);
}

function getDisplayedEntryTypeGroups(release: GeneratedReleaseChangelogVersion): ReleaseEntryTypeGroup[] {
  const typeGroupMap = new Map<
    GeneratedChangelogEntryType,
    {
      entries: ReleaseEntry[];
      scopes: Map<string, { scope: string; entries: ReleaseEntry[] }>;
    }
  >();

  for (const entry of getDisplayedEntries(release)) {
    const type = entry.type;
    const scope = entry.scope.trim();
    const scopeKey = scope || '__misc';

    let typeGroup = typeGroupMap.get(type);

    if (!typeGroup) {
      typeGroup = {
        entries: [],
        scopes: new Map()
      };

      typeGroupMap.set(type, typeGroup);
    }

    typeGroup.entries.push(entry);

    let scopeGroup = typeGroup.scopes.get(scopeKey);

    if (!scopeGroup) {
      scopeGroup = {
        scope: scope || 'misc',
        entries: []
      };

      typeGroup.scopes.set(scopeKey, scopeGroup);
    }

    scopeGroup.entries.push(entry);
  }

  return typeOrder
    .map(type => {
      const typeGroup = typeGroupMap.get(type);

      if (!typeGroup) {
        return null;
      }

      return {
        key: type,
        type,
        entryCount: typeGroup.entries.length,
        scopes: Array.from(typeGroup.scopes.entries()).map(([scopeKey, scopeGroup]) => ({
          key: `${type}-${scopeKey}`,
          scope: scopeGroup.scope,
          entryCount: scopeGroup.entries.length,
          entries: scopeGroup.entries,
          component: scopeGroup.entries?.[0]?.components?.[0]
        }))
      } as ReleaseEntryTypeGroup;
    })
    .filter((group): group is ReleaseEntryTypeGroup => group !== null);
}

function getHighlightedComponents(release: GeneratedReleaseChangelogVersion) {
  return release.components.slice(0, highlightedComponentCount);
}

function getRemainingEntryCount(release: GeneratedReleaseChangelogVersion) {
  return Math.max(release.entries.length - highlightedEntryCount, 0);
}

function hasHiddenEntries(release: GeneratedReleaseChangelogVersion) {
  return getRemainingEntryCount(release) > 0;
}

function getRemainingComponentCount(release: GeneratedReleaseChangelogVersion) {
  return Math.max(release.components.length - highlightedComponentCount, 0);
}

function toComponentLink(component: string) {
  return `/components/${component}`;
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function formatComponentLabel(component: string) {
  return pascalCase(component);
}

function formatScopeLabel(scope: string) {
  return pascalCase(scope);
}

function isReleaseExpanded(version: string) {
  return expandedReleaseVersions.value.includes(version);
}

function toggleReleaseExpanded(version: string) {
  if (isReleaseExpanded(version)) {
    expandedReleaseVersions.value = expandedReleaseVersions.value.filter(item => item !== version);

    return;
  }

  expandedReleaseVersions.value = [...expandedReleaseVersions.value, version];
}

function applyComponentFilter(component: string) {
  componentQuery.value = component;
  isFilterInputFocused.value = false;
}

function clearComponentFilter() {
  componentQuery.value = '';
}

function handleFilterInputFocus() {
  isFilterInputFocused.value = true;
}

function handleFilterInputBlur() {
  isFilterInputFocused.value = false;
}

function handleFilterInputEnter() {
  const firstSuggestedComponent = suggestedComponents.value[0];

  if (!firstSuggestedComponent) {
    return;
  }

  applyComponentFilter(firstSuggestedComponent);
}

function resolveRouteComponentQuery(value: unknown) {
  if (Array.isArray(value)) {
    return normalizeSearchValue(value[0] ?? '');
  }

  if (typeof value === 'string') {
    return normalizeSearchValue(value);
  }

  return '';
}

function resolveRouteOnlyComponentRelated(value: unknown) {
  if (Array.isArray(value)) {
    return resolveRouteOnlyComponentRelated(value[0] ?? '');
  }

  if (typeof value !== 'string') {
    return false;
  }

  return value === '1' || value === 'true' || value === 'components';
}

function syncFilterFromRoute(value: string) {
  if (normalizeSearchValue(componentQuery.value) === value) {
    return;
  }

  componentQuery.value = value;
}

function syncRelatedToggleFromRoute(value: boolean) {
  if (onlyComponentRelated.value === value) {
    return;
  }

  onlyComponentRelated.value = value;
}

function syncRouteState(component: string, related: boolean) {
  if (routeComponentQuery.value === component && routeOnlyComponentRelated.value === related) {
    return;
  }

  const nextQuery = { ...route.query };

  if (component) {
    nextQuery.component = component;
  } else {
    delete nextQuery.component;
  }

  if (related) {
    nextQuery.related = 'components';
  } else {
    delete nextQuery.related;
  }

  router.replace({
    // keep the current (possibly `/zh`-prefixed) path when syncing filters
    path: route.path,
    query: nextQuery
  });
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleFilterInputEnter();
  }
};

watch(
  [routeComponentQuery, routeOnlyComponentRelated],
  ([component, related]) => {
    syncFilterFromRoute(component);
    syncRelatedToggleFromRoute(related);
  },
  { immediate: true }
);

watch([normalizedComponentQuery, onlyComponentRelated], ([component, related]) => {
  syncRouteState(component, related);
});
</script>

<template>
  <div class="mx-auto max-w-screen-2xl space-y-6 pb-8">
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
            <SIcon icon="lucide:history" class="text-sm text-primary" />
            <span>{{ t('releases_page.kicker') }}</span>
          </div>

          <div class="space-y-4">
            <div v-if="latestRelease" class="flex flex-wrap items-center gap-2.5">
              <div class="code-btn-outline">{{ latestRelease.version }}</div>
              <span class="text-sm font-medium text-muted-foreground">{{ latestRelease.date }}</span>
            </div>

            <div class="space-y-3">
              <p class="text-3xl font-black tracking-[-0.05em] text-foreground">
                {{ t('releases_page.title') }}
              </p>
              <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                {{ t('releases_page.summary') }}
              </p>
              <p class="max-w-3xl text-sm leading-7 text-muted-foreground">
                {{ t('releases_page.latest.desc') }}
              </p>
            </div>

            <div class="space-y-3">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {{ t('releases_page.filter.title') }}
              </div>

              <div class="flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3">
                <div class="min-w-0 flex-1">
                  <SInput
                    v-model="componentQuery"
                    type="text"
                    :placeholder="t('releases_page.filter.placeholder')"
                    :control-props="{
                      onBlur: handleFilterInputBlur,
                      onFocus: handleFilterInputFocus,
                      onKeydown: onKeydown
                    }"
                    class="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <SButton
                  v-if="hasComponentFilter"
                  size="sm"
                  variant="ghost"
                  shape="rounded"
                  class="shrink-0"
                  @click="clearComponentFilter"
                >
                  {{ t('releases_page.filter.clear') }}
                </SButton>
              </div>

              <p class="text-sm leading-6 text-muted-foreground">
                {{ t('releases_page.filter.desc') }}
              </p>

              <div class="flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
                <div class="space-y-1">
                  <div class="text-sm font-medium text-foreground">
                    {{ t('releases_page.filter.related_only') }}
                  </div>
                  <p class="text-sm leading-6 text-muted-foreground">
                    {{ t('releases_page.filter.related_only_desc') }}
                  </p>
                </div>

                <SSwitch
                  v-model="onlyComponentRelated"
                  color="primary"
                  size="lg"
                  :ui="{ control: 'shrink-0', thumb: 'shrink-0' }"
                />
              </div>

              <div v-if="showSuggestionPanel" class="space-y-3 rounded-2xl px-4 py-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="text-sm font-medium text-foreground">
                    {{ t('releases_page.filter.suggestions') }}
                  </div>
                  <p class="text-xs text-muted-foreground">
                    {{ t('releases_page.filter.enter_hint') }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <SButton
                    v-for="component in suggestedComponents"
                    :key="component"
                    size="sm"
                    variant="ghost"
                    shape="rounded"
                    class="px-3 py-1.5"
                    @mousedown.prevent
                    @click="applyComponentFilter(component)"
                  >
                    {{ formatComponentLabel(component) }}
                  </SButton>
                </div>
              </div>

              <p v-else-if="hasComponentFilter" class="text-sm text-muted-foreground">
                {{ t('releases_page.filter.no_match') }}
              </p>
            </div>

            <div v-if="latestRelease?.components.length" class="space-y-3">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {{ t('releases_page.sections.impacted.title') }}
              </div>

              <div class="flex flex-wrap gap-2">
                <SButtonLink
                  v-for="component in getHighlightedComponents(latestRelease)"
                  :key="component"
                  :to="toComponentLink(component)"
                  shape="rounded"
                  variant="pure"
                  class="inline-flex items-center gap-2"
                >
                  {{ formatComponentLabel(component) }}
                  <span
                    v-if="isNewComponent(latestRelease, component)"
                    class="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary"
                  >
                    {{ t('releases_page.badges.new') }}
                  </span>
                </SButtonLink>

                <span
                  v-if="getRemainingComponentCount(latestRelease)"
                  class="inline-flex items-center rounded-full border border-border/60 bg-muted/60 px-3 py-1.5 text-sm text-muted-foreground"
                >
                  +{{ getRemainingComponentCount(latestRelease) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <SButtonLink
              v-for="action in actionLinks"
              :key="action.label"
              v-bind="action.to ? { to: action.to } : { href: action.href, target: action.target }"
              size="lg"
              :variant="action.href ? 'ghost' : 'pure'"
              shape="rounded"
              class="group min-w-36"
            >
              {{ action.label }}
              <SIcon
                :icon="action.to ? 'lucide:layout-grid' : 'lucide:arrow-up-right'"
                class="transition-transform duration-200 group-hover:translate-x-1"
              />
            </SButtonLink>
          </div>
        </div>

        <SCard :title="t('releases_page.latest.title')" split class="docs-card overflow-hidden">
          <template #default>
            <div class="space-y-4">
              <div class="docs-subtle-card px-4 py-3">
                <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {{ t('releases_page.stats.versions') }}
                </div>
                <div class="mt-2 text-2xl font-bold tracking-[-0.04em] text-foreground">
                  {{ trackedReleaseCount }}
                </div>
              </div>

              <div v-if="latestRelease" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div class="docs-subtle-card px-4 py-3">
                  <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {{ t('releases_page.stats.entries') }}
                  </div>
                  <div class="mt-2 text-2xl font-bold tracking-[-0.04em] text-foreground">
                    {{ latestRelease.entryCount }}
                  </div>
                </div>

                <div class="docs-subtle-card px-4 py-3">
                  <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {{ t('releases_page.stats.components') }}
                  </div>
                  <div class="mt-2 text-2xl font-bold tracking-[-0.04em] text-foreground">
                    {{ latestRelease.componentCount }}
                  </div>
                </div>
              </div>

              <SAlert
                v-else
                color="info"
                variant="soft"
                icon="lucide:history"
                :title="
                  hasComponentFilter || onlyComponentRelated
                    ? t('releases_page.empty.filtered_title')
                    : t('releases_page.empty.title')
                "
                :description="
                  hasComponentFilter || onlyComponentRelated
                    ? t('releases_page.empty.filtered_desc')
                    : t('releases_page.empty.desc')
                "
              />
            </div>
          </template>
        </SCard>
      </div>
    </section>

    <section class="relative min-w-0 overflow-hidden">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-r from-primary/8 via-warning/6 to-info/8 opacity-80"
      />
      <div class="relative min-w-0 px-5 py-6 sm:px-8 sm:py-8 xl:px-10 xl:py-10">
        <div class="min-w-0 space-y-6">
          <div class="space-y-2">
            <h2 class="scroll-mt-24 text-3xl font-black tracking-[-0.04em] text-foreground">
              {{ t('releases_page.sections.recent.title') }}
            </h2>
            <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {{ t('releases_page.sections.recent.desc') }}
            </p>
          </div>

          <SAlert
            v-if="!displayedReleases.length"
            color="info"
            variant="soft"
            icon="lucide:history"
            :title="
              hasComponentFilter || onlyComponentRelated
                ? t('releases_page.empty.filtered_title')
                : t('releases_page.empty.title')
            "
            :description="
              hasComponentFilter || onlyComponentRelated
                ? t('releases_page.empty.filtered_desc')
                : t('releases_page.empty.desc')
            "
          />

          <div v-else class="space-y-5">
            <SCard
              v-for="release in displayedReleases"
              :key="release.version"
              size="sm"
              split
              class="docs-card overflow-hidden"
            >
              <template #title>
                <div class="space-y-1">
                  <h3 class="text-2xl font-bold tracking-[-0.03em] text-foreground">
                    {{ release.version }}
                  </h3>
                  <p class="text-sm text-muted-foreground">{{ release.date }}</p>
                </div>
              </template>

              <template #extra>
                <div
                  class="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  <span>{{ release.entryCount }} {{ t('releases_page.stats.entries') }}</span>
                  <span>{{ release.componentCount }} {{ t('releases_page.stats.components') }}</span>
                  <SLink
                    :href="release.compareUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-primary hover:text-primary/80"
                  >
                    <span>{{ t('releases_page.actions.compare_release') }}</span>
                    <SIcon icon="lucide:arrow-up-right" class="text-sm" />
                  </SLink>
                </div>
              </template>

              <template #default>
                <div class="space-y-5">
                  <SAlert
                    v-if="release.typeCounts.breaking && !hasCuratedBreakingNote(release)"
                    color="destructive"
                    variant="soft"
                    icon="lucide:triangle-alert"
                    :title="t('releases_page.breaking_banner.title')"
                    :description="
                      t('releases_page.breaking_banner.desc', {
                        count: release.typeCounts.breaking
                      })
                    "
                  >
                    <SButtonLink
                      v-if="resolveReleaseDocLink(release)"
                      :to="resolveReleaseDocLink(release)"
                      size="sm"
                      variant="link"
                      color="destructive"
                      class="group justify-start -ml-2"
                    >
                      {{ t('releases_page.actions.upgrade_guide') }}
                      <SIcon
                        icon="lucide:arrow-right"
                        class="text-sm transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </SButtonLink>
                  </SAlert>

                  <div v-if="release.notes.length" class="space-y-3">
                    <SAlert
                      v-for="note in release.notes"
                      :key="note.summaryKey"
                      :color="resolveNoteConfig(note.type).color"
                      variant="soft"
                      :icon="resolveNoteConfig(note.type).icon"
                      :title="resolveNoteLabel(note.type)"
                      :description="resolveNoteSummary(note.summary, note.summaryKey)"
                    >
                      <SButtonLink
                        v-if="resolveNoteDocLink(note)"
                        :to="resolveNoteDocLink(note)"
                        size="sm"
                        variant="link"
                        class="group justify-start -ml-2"
                      >
                        {{ t('releases_page.actions.upgrade_guide') }}
                        <SIcon
                          icon="lucide:arrow-right"
                          class="text-sm transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </SButtonLink>
                    </SAlert>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="item in getOrderedTypeCounts(release)"
                      :key="item.type"
                      class="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                      :class="typeClassMap[item.type]"
                    >
                      {{ resolveTypeLabel(item.type) }} · {{ item.count }}
                    </span>
                  </div>

                  <div v-if="release.components.length" class="space-y-3">
                    <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {{ t('releases_page.sections.impacted.title') }}
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <SButtonLink
                        v-for="component in getHighlightedComponents(release)"
                        :key="component"
                        :to="toComponentLink(component)"
                        variant="pure"
                        shape="rounded"
                        class="inline-flex items-center gap-2"
                      >
                        {{ formatComponentLabel(component) }}
                        <span
                          v-if="isNewComponent(release, component)"
                          class="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary"
                        >
                          {{ t('releases_page.badges.new') }}
                        </span>
                      </SButtonLink>

                      <span
                        v-if="getRemainingComponentCount(release)"
                        class="inline-flex items-center rounded-full border border-border/60 bg-muted/60 px-3 py-1.5 text-sm text-muted-foreground"
                      >
                        +{{ getRemainingComponentCount(release) }}
                      </span>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {{ t('releases_page.sections.highlights.title') }}
                    </div>

                    <div class="space-y-4">
                      <div
                        v-for="typeGroup in getDisplayedEntryTypeGroups(release)"
                        :key="typeGroup.key"
                        class="rounded-2xl border border-border/50 bg-muted/20 px-4 py-4 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-5 lt-lg:space-y-4"
                      >
                        <div class="flex justify-between border-border/50 lg:border-r lg:pr-5">
                          <div>
                            <span
                              class="inline-flex items-center rounded-full border px-3 py-2 text-base font-semibold uppercase tracking-[0.14em]"
                              :class="typeClassMap[typeGroup.type]"
                            >
                              {{ resolveTypeLabel(typeGroup.type) }} · {{ typeGroup.entryCount }}
                            </span>
                          </div>
                        </div>

                        <div class="space-y-3 lg:min-w-0">
                          <div
                            v-for="scopeGroup in typeGroup.scopes"
                            :key="scopeGroup.key"
                            class="rounded-xl border border-border/40 bg-background/80 px-3.5 py-3 xl:grid xl:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] xl:gap-4 lt-xl:space-y-2.5"
                          >
                            <SButtonLink
                              v-if="scopeGroup.component"
                              :to="toComponentLink(scopeGroup.component)"
                              size="sm"
                              variant="pure"
                              shape="rounded"
                            >
                              {{ formatComponentLabel(scopeGroup.component) }}
                            </SButtonLink>

                            <div v-else class="text-sm font-medium text-foreground">
                              {{ formatScopeLabel(scopeGroup.scope) }}
                            </div>

                            <ul class="space-y-2.5 xl:min-w-0">
                              <li
                                v-for="entry in scopeGroup.entries"
                                :key="`${release.version}-${entry.commitHash ?? entry.summary}`"
                                class="flex items-start gap-3"
                              >
                                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border/80" />

                                <div class="min-w-0 flex-1 flex gap-8">
                                  <p class="text-sm leading-6 text-foreground sm:text-[15px]">
                                    {{ resolveSummary(entry.summary, entry.summaryKey) }}
                                  </p>

                                  <SLink
                                    v-if="entry.commitUrl && entry.commitHash"
                                    :href="entry.commitUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80"
                                  >
                                    <span>{{ t('changelog.actions.view_commit') }}</span>
                                    <span class="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
                                      {{ entry.commitHash }}
                                    </span>
                                  </SLink>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="hasHiddenEntries(release) || isReleaseExpanded(release.version)"
                      class="flex flex-wrap items-center gap-3"
                    >
                      <p
                        v-if="!isReleaseExpanded(release.version) && getRemainingEntryCount(release)"
                        class="text-sm text-muted-foreground"
                      >
                        {{
                          t('releases_page.more_entries', {
                            count: getRemainingEntryCount(release)
                          })
                        }}
                      </p>

                      <SButton
                        size="sm"
                        variant="ghost"
                        shape="rounded"
                        @click="toggleReleaseExpanded(release.version)"
                      >
                        {{
                          isReleaseExpanded(release.version)
                            ? t('releases_page.actions.collapse_release')
                            : t('releases_page.actions.view_full_release')
                        }}
                      </SButton>
                    </div>
                  </div>
                </div>
              </template>
            </SCard>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
