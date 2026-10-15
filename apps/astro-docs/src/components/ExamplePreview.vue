<script setup lang="ts">
/**
 * The live half of a playground card: one example SFC, hydrated.
 *
 * Kept deliberately minimal — the card shell, the controls and the code panel are
 * build-time markup (`PlaygroundGallery.astro`), so the only thing Vue owns per
 * example is the demo itself.
 *
 * `component`/`name` are the keys used to resolve the example through the same
 * build-time glob the page used (`plugin/component-loader.ts`); module loaders
 * cannot cross the island boundary as props.
 */
import { onMounted, shallowRef, type Component } from 'vue';

const props = defineProps<{
  component: string;
  name: string;
  /** DOM id of the teleport target when the example declares a `playgroundRegion` prop. */
  region?: string;
}>();

const example = shallowRef<Component | null>(null);

onMounted(async () => {
  const { loadExamples } = await import('../plugin/component-loader');
  const entry = loadExamples(props.component).find(item => item.name === props.name);

  if (!entry) {
    return;
  }

  const module = await entry.componentLoader();
  example.value = (module as { default: Component }).default;
});
</script>

<template>
  <component :is="example" v-if="example" :playground-region="region ? `#${region}` : undefined" />
</template>
