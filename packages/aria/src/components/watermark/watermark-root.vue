<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue';
import { useMutationObserver } from '@vueuse/core';
import { useForwardElement } from '../../composables';
import { generateWatermarkDataUrl, resolveWatermarkConfig } from './shared';
import { provideWatermarkRootContext, useWatermarkCompactContext, useWatermarkUi } from './context';
import type { WatermarkRootProps } from './types';

defineOptions({
  name: 'WatermarkRoot'
});

const props = defineProps<WatermarkRootProps>();

const cls = useWatermarkUi('root');
const compactContext = useWatermarkCompactContext();

const [rootElement, setRootElement] = useForwardElement<HTMLDivElement>();

const dataUrl = shallowRef<string | undefined>();
const overlayStyle = shallowRef<Record<string, string> | undefined>();
const defense = computed(() => props.defense ?? false);

const imageElement = shallowRef<HTMLImageElement | null>(null);

/** Track the currently loading image and its config so we can detach listeners on cleanup. */
const pendingLoad = shallowRef<{
  img: HTMLImageElement;
  config: ReturnType<typeof resolveWatermarkConfig>;
} | null>(null);

function detachPendingLoad() {
  const entry = pendingLoad.value;

  if (!entry) return;

  entry.img.removeEventListener('load', onImageLoad);
  entry.img.removeEventListener('error', onImageError);
  pendingLoad.value = null;
}

function onImageLoad(this: HTMLImageElement) {
  const entry = pendingLoad.value;

  if (!entry || entry.img !== this) return;

  imageElement.value = this;

  const url = generateWatermarkDataUrl(entry.config, this);

  dataUrl.value = url;
  overlayStyle.value = url
    ? {
        backgroundImage: `url(${url})`
      }
    : undefined;

  pendingLoad.value = null;
}

function onImageError(this: HTMLImageElement) {
  const entry = pendingLoad.value;

  if (!entry || entry.img !== this) return;

  imageElement.value = null;
  dataUrl.value = undefined;
  overlayStyle.value = undefined;

  pendingLoad.value = null;
}

function loadImageAndGenerate(config: ReturnType<typeof resolveWatermarkConfig>) {
  detachPendingLoad();

  const img = new Image();
  img.crossOrigin = 'anonymous';

  pendingLoad.value = { img, config };

  img.addEventListener('load', onImageLoad);
  img.addEventListener('error', onImageError);

  img.src = props.image!;
}

function updateWatermark() {
  const config = resolveWatermarkConfig(props);

  if (props.image) {
    loadImageAndGenerate(config);
  } else {
    const url = generateWatermarkDataUrl(config);

    dataUrl.value = url;
    overlayStyle.value = url
      ? {
          backgroundImage: `url(${url})`
        }
      : undefined;
  }
}

watch(
  () => [
    props.content,
    props.image,
    props.fontSize,
    props.fontFamily,
    props.fontColor,
    props.fontWeight,
    props.rotate,
    props.gap,
    props.offset,
    props.width,
    props.height,
    props.cross,
    props.defense
  ],
  () => {
    updateWatermark();
  },
  { immediate: true }
);

useMutationObserver(
  rootElement,
  mutations => {
    if (!defense.value || !overlayStyle.value) {
      return;
    }

    const overlayRemoved = mutations.some(mutation => {
      if (mutation.type !== 'childList') {
        return false;
      }

      return Array.from(mutation.removedNodes).some(node => {
        return node instanceof HTMLElement && node.hasAttribute('data-vean-watermark-overlay');
      });
    });

    if (!overlayRemoved) {
      return;
    }

    const overlay = rootElement.value?.querySelector('[data-vean-watermark-overlay]');

    if (!overlay) {
      compactContext?.repairOverlay();
    }
  },
  {
    childList: true
  }
);

provideWatermarkRootContext({
  overlayStyle,
  defense
});

onBeforeUnmount(() => {
  detachPendingLoad();
});

defineExpose({
  rootElement,
  dataUrl
});
</script>

<template>
  <div :ref="setRootElement" data-vean-watermark-root :class="cls">
    <slot />
  </div>
</template>
