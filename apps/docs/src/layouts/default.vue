<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { extractLocaleFromPath } from 'ubean/client';
import { provideDocOutline } from '~/composables/use-doc-outline';

const visible = shallowRef(false);
const docOutline = provideDocOutline();
const route = useRoute();
const hasDocOutline = computed(() => docOutline.value.length > 0);
const barePath = computed(() => extractLocaleFromPath(route.path).pathWithoutLocale);
const shouldReserveOutlineSpace = computed(
  () => !['/', '/releases', '/playground', '/theme-editor'].includes(barePath.value)
);
const shouldShowSidebar = computed(() =>
  ['/overview', '/components', '/chart', '/aria'].some(p => barePath.value.startsWith(p))
);

const closeDrawer = () => {
  visible.value = false;
};
</script>

<template>
  <div
    class="[--docs-notice-h:2.25rem] [--app-header-main:3.75rem] [--app-header:calc(var(--app-header-main)+var(--docs-notice-h))] min-h-full pt-[--app-header] text-sm"
  >
    <AppAnnouncement />
    <AppHeader />
    <div
      v-if="shouldShowSidebar"
      class="lt-md:!hidden fixed top-[calc(var(--app-header)+0.5rem)] start-0 z-49 w-55 h-[calc(100vh-var(--app-header)-0.5rem)] p-3"
    >
      <SiderMenu />
    </div>
    <div
      v-if="shouldShowSidebar"
      class="md:hidden fixed top-[calc(var(--app-header)+0.5rem)] start-0 end-0 z-50 ps-2 py-1"
    >
      <SDrawer v-model:open="visible" side="left" :show-confirm="false" class="rounded-tl-none! rounded-bl-none!">
        <template #trigger>
          <SButtonIcon
            variant="pure"
            icon="lucide:menu"
            shape="circle"
            shadow="lg"
            :fit-content="false"
            class="text-lg"
          />
        </template>
        <SiderMenu @select="closeDrawer" />
      </SDrawer>
    </div>
    <div :class="shouldShowSidebar ? 'lt-md:ms-0 md:ms-55' : 'ms-0'" class="px-4 py-5 md:px-8 md:pb-7 md:pt-5 xl:px-10">
      <div
        class="mx-auto min-w-0"
        :class="shouldReserveOutlineSpace ? 'xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start xl:gap-8' : ''"
      >
        <div class="min-w-0">
          <PageView />
        </div>

        <ClientOnly>
          <aside v-if="shouldReserveOutlineSpace" class="lt-xl:hidden xl:w-72 xl:min-w-0">
            <!--
            The outline is filled asynchronously on the client (doc-md loads its
            markdown via an async glob), while SSR already rendered it from
            `onServerPrefetch`. The first client frame therefore differs in both
            the wrapper class and the anchor children; it self-heals once loaded.
          -->
            <div
              class="fixed top-[calc(var(--app-header)+1.25rem)] end-8 z-40 w-72 transition-opacity duration-200"
              :class="hasDocOutline ? 'opacity-100' : 'pointer-events-none opacity-0'"
            >
              <div
                class="max-h-[calc(100vh-var(--app-header)-2.5rem)] overflow-auto border border-border/50 dark:border-border p-3 rounded-xl"
              >
                <SAnchor :items="docOutline" :offset-top="124" :target-offset="124" />
              </div>
            </div>
          </aside>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
