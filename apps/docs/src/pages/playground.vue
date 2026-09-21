<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import type { Component } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { kebabCase, pascalCase } from '@vean/aria/shared';
import type { SelectSingleOptionData, TabsOptionData } from '@vean/ui';

definePage({ layout: 'default' });

const route = useRoute();
const { t } = useI18n();

interface PlaygroundTab extends TabsOptionData<string> {
  library: string;
  load: () => Promise<{ default: Component }>;
}

type PlaygroundView = 'docs' | 'playground';

const defaultLibrary = 'ui';

const examplePathPattern = /examples\/([^/]+)\/([^/]+)\/index\.vue$/u;

const exampleModules = import.meta.glob<{ default: Component }>('../examples/**/index.vue');

const libraryOptions: SelectSingleOptionData<string>[] = [
  { label: 'Aria', value: 'aria', icon: 'lucide:code-xml' },
  { label: 'UI', value: 'ui', icon: 'lucide:layout-grid' },
  { label: 'Chart', value: 'chart', icon: 'lucide:bar-chart-3' }
];

const viewTabs = computed<TabsOptionData<string>[]>(() => [
  { label: t('playground.view.docs'), value: 'docs' },
  { label: t('playground.view.playground'), value: 'playground' }
]);

function toPlaygroundTab(path: string, load: () => Promise<{ default: Component }>): PlaygroundTab | null {
  const match = path.match(examplePathPattern);
  const library = match?.[1];
  const component = match?.[2];

  if (!library || !component) {
    return null;
  }

  return {
    label: pascalCase(component),
    value: kebabCase(component),
    library,
    load
  };
}

function compareTabByLabel(left: PlaygroundTab, right: PlaygroundTab) {
  return left.label.localeCompare(right.label);
}

const playgroundTabs = Object.entries(exampleModules)
  .map(([path, load]) => toPlaygroundTab(path, load))
  .filter((tab): tab is PlaygroundTab => tab !== null)
  .sort(compareTabByLabel);

function findLibraryFirstTab(library: string): PlaygroundTab | null {
  return playgroundTabs.find(tab => tab.library === library) ?? null;
}

function resolveRouteTab(raw: unknown): PlaygroundTab | null {
  if (typeof raw !== 'string' || !raw) {
    return null;
  }

  return playgroundTabs.find(tab => tab.value === raw) ?? null;
}

const defaultTab = findLibraryFirstTab(defaultLibrary);

const activeView = shallowRef<PlaygroundView>('docs');
const activeLibrary = ref(defaultTab?.library ?? defaultLibrary);
const activeTab = shallowRef(defaultTab?.value ?? '');
const loadedComponent = shallowRef<Component | null>(null);

const filteredTabs = computed(() => playgroundTabs.filter(tab => tab.library === activeLibrary.value));
const activeIcon = computed(() => libraryOptions.find(option => option.value === activeLibrary.value)?.icon);

async function loadActiveComponent() {
  const tab = playgroundTabs.find(item => item.value === activeTab.value);

  if (!tab) {
    loadedComponent.value = null;
    return;
  }

  const mod = await tab.load();

  // the active tab may have changed while the module was loading
  if (tab.value !== activeTab.value) {
    return;
  }

  loadedComponent.value = mod.default ?? null;
}

function updateRouteQuery() {
  // ubean keys `PageView` by `route.fullPath`, so `router.replace` with a query
  // change would remount the page; sync the address bar directly instead.
  const url = new URL(window.location.href);

  if (activeView.value === 'playground' && activeTab.value) {
    url.searchParams.set('tab', activeTab.value);
  } else {
    url.searchParams.delete('tab');
  }

  window.history.replaceState(window.history.state, '', url);
}

function syncFromRoute() {
  const tab = resolveRouteTab(route.query.tab);

  if (!tab) {
    return;
  }

  activeLibrary.value = tab.library;
  activeTab.value = tab.value;
  activeView.value = 'playground';
}

watch(activeLibrary, library => {
  activeTab.value = findLibraryFirstTab(library)?.value ?? '';
});

watch([activeView, activeTab], ([view]) => {
  updateRouteQuery();

  // the example module is only loaded on demand once the playground view opens
  if (view === 'playground') {
    loadActiveComponent();
  }
});

onMounted(() => {
  // a valid `tab` query deep-links into the playground view; otherwise the docs view stays default
  syncFromRoute();
});
</script>

<template>
  <STabs v-model="activeView" :items="viewTabs" shape="rounded" fill="auto">
    <template #content>
      <SCard v-if="activeView === 'playground'" :title="t('playground.title')" class="bg-background">
        <template #extra>
          <SSelect v-model="activeLibrary" :items="libraryOptions" class="w-35">
            <template #trigger-leading>
              <SIcon :icon="activeIcon" />
            </template>
          </SSelect>
        </template>
        <SAlert
          v-if="!filteredTabs.length"
          color="info"
          variant="soft"
          icon="lucide:construction"
          :title="t('playground.empty.title')"
          :description="t('playground.empty.description')"
        />
        <STabs
          v-else
          v-model="activeTab"
          :items="filteredTabs"
          :enable-indicator="false"
          :ui="{
            root: 'md:h-full',
            list: 'grid grid-cols-10 gap-y-1 lt-sm:grid-cols-4 lt-md:grid-cols-5 lt-lg:grid-cols-6',
            content: 'overflow-auto'
          }"
        >
          <template #content>
            <component :is="loadedComponent" v-if="loadedComponent" />
            <div v-else class="py-12 text-center text-muted-foreground">
              {{ t('playground.loading') }}
            </div>
          </template>
        </STabs>
      </SCard>

      <DocMd v-else path="playground" />
    </template>
  </STabs>
</template>
