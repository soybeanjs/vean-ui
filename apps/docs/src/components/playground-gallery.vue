<script setup lang="ts">
import { computed, onUnmounted, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBodyScrollLock, useEscapeKeyDown } from '@vean/aria/composables';
import { isClient, pascalCase } from '@vean/aria/shared';
import { getOrderedPlaygroundExamples } from '~/constants/globs';
import { defaultPlaygroundDevice } from '~/constants/playground';
import type { PlaygroundDevice, PlaygroundTab } from '~/constants/playground';
import { acceptsPlaygroundRegion } from '~/shared/playground-region';
import CodeBlock from './code-block.vue';
import PlaygroundControls from './playground-controls.vue';
import PlaygroundViewport from './playground-viewport.vue';

interface Props {
  component: string;
}

const props = defineProps<Props>();

const { te, t } = useI18n();

function resolveExampleTitle(file: string) {
  const key = `playground.examples.${props.component}.${file}`;

  return te(key) ? t(key) : pascalCase(file);
}

const components = computed(() =>
  getOrderedPlaygroundExamples(props.component).map(item => ({
    title: resolveExampleTitle(item.name),
    file: item.name,
    rawFileName: item.rawFileName,
    code: item.code,
    component: item.component,
    /** Opt-in target of the example's out-of-frame part, or `undefined` for the vast majority. */
    region: acceptsPlaygroundRegion(item.component) ? `playground-${props.component}-${item.name}` : undefined
  }))
);

/**
 * Per-example state, held per file so every card keeps its own device and view.
 *
 * `fullscreen` is tracked apart from the picked device so entering it leaves the
 * card's previous device untouched and exiting restores it, and it stays
 * exclusive: the layer covering the viewport owns the only switcher.
 */
const deviceState = shallowRef<Partial<Record<string, PlaygroundDevice>>>({});
const tabState = shallowRef<Partial<Record<string, PlaygroundTab>>>({});
const fullscreenFile = shallowRef<string | null>(null);
const unlockScroll = shallowRef<(() => void) | null>(null);

const fullscreenLayerVisible = computed(
  () => fullscreenFile.value !== null && resolveTab(fullscreenFile.value) === 'preview'
);

function resolveDevice(file: string): PlaygroundDevice {
  return fullscreenFile.value === file ? 'fullscreen' : (deviceState.value[file] ?? defaultPlaygroundDevice);
}

function resolveTab(file: string): PlaygroundTab {
  return tabState.value[file] ?? 'preview';
}

function resolveViewportClass(file: string): string {
  return resolveDevice(file) === 'fullscreen'
    ? 'fixed inset-0 z-50 flex flex-col gap-3 bg-background p-4'
    : 'flex flex-col gap-3';
}

function isFullscreenPreview(file: string): boolean {
  return resolveDevice(file) === 'fullscreen';
}

/**
 * Selector of the region an example teleports its out-of-frame part into.
 *
 * No target switching is needed for fullscreen: the element holding this region
 * is the same one that becomes the lifted layer, so the escaped part stays inside
 * whichever layer is currently on screen. (Switching the target instead resolves
 * against an element the same patch has not inserted yet, and Vue keeps the
 * teleport where it was.)
 */
function bindRegion(region?: string) {
  return region ? { playgroundRegion: `#${region}` } : {};
}

function handleDeviceChange(file: string, value: PlaygroundDevice) {
  if (value === 'fullscreen') {
    fullscreenFile.value = file;
    return;
  }

  fullscreenFile.value = null;
  deviceState.value = { ...deviceState.value, [file]: value };
}

function handleTabChange(file: string, value: PlaygroundTab) {
  tabState.value = { ...tabState.value, [file]: value };
}

function exitFullscreen() {
  fullscreenFile.value = null;
}

useEscapeKeyDown(() => (isClient ? document : undefined), exitFullscreen);

// The lock follows the visible layer, not just the picked device: switching a card
// away from the preview hides the layer, so its lock has to be released with it.
watch(fullscreenLayerVisible, visible => {
  if (visible) {
    unlockScroll.value = useBodyScrollLock();
    return;
  }

  unlockScroll.value?.();
  unlockScroll.value = null;
});

onUnmounted(() => {
  unlockScroll.value?.();
  unlockScroll.value = null;
});
</script>

<template>
  <div class="space-y-5">
    <template v-for="(item, index) in components" :key="index">
      <SCard :title="item.title" split class="overflow-hidden">
        <!--
          The control strip lives in the header, not above the demo: the preview keeps the whole
          body, and the switchers stay reachable while the card shows its code.
        -->
        <template #extra>
          <PlaygroundControls
            :device="resolveDevice(item.file)"
            :tab="resolveTab(item.file)"
            @update:device="handleDeviceChange(item.file, $event)"
            @update:tab="handleTabChange(item.file, $event)"
          />
        </template>
        <template #default>
          <template v-if="item.component">
            <div v-if="resolveTab(item.file) === 'preview'" :class="resolveViewportClass(item.file)">
              <!-- The lifted layer covers the card header, so it carries its own strip. -->
              <div v-if="isFullscreenPreview(item.file)" class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-medium text-foreground">{{ item.title }}</span>
                <PlaygroundControls
                  :device="resolveDevice(item.file)"
                  exit-visible
                  @update:device="handleDeviceChange(item.file, $event)"
                  @exit="exitFullscreen"
                />
              </div>
              <!--
                Out-of-frame region, for the part of an example that is not the thing being
                simulated (its own controls). It sits above the frame, outside `PlaygroundViewport`
                and inside the element that turns into the fullscreen layer.
              -->
              <div v-if="item.region" :id="item.region" class="empty:hidden" />
              <PlaygroundViewport :device="resolveDevice(item.file)">
                <component :is="item.component" v-bind="bindRegion(item.region)" />
              </PlaygroundViewport>
            </div>
            <CodeBlock v-else :code="item.code" lang="vue" />
          </template>
          <SAlert
            v-else
            color="destructive"
            :title="`${component}/${item.rawFileName} ${t('not_found')}`"
            icon="lucide:alert-circle"
          />
        </template>
      </SCard>
    </template>
  </div>
</template>
