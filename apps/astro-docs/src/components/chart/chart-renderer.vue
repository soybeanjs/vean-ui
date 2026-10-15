<script
  setup
  lang="ts"
  generic="TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue"
>
import { computed, onBeforeUnmount, onMounted, onUpdated, shallowRef, useAttrs, useId } from 'vue';
import type { CSSProperties } from 'vue';
import type { ChartMotionTransition, ChartValue, DomChartDefinition } from '@tanstack/charts';
import { resolveChartAdapterLayout } from '@tanstack/charts/adapter';
import { createChartRendererAdapter } from '@tanstack/charts/adapter/renderer';
import { motion } from '@tanstack/charts/motion';

interface Props {
  /** 图表定义(来自 `defineChart`)。 */
  definition: DomChartDefinition<TDatum, TXValue, TYValue>;
  ariaDescription?: string;
  /** 固定像素高度;缺省时按定义的 aspectRatio 或 320px 兜底。 */
  height?: number;
  width?: number;
  /**
   * 动效过渡曲线。默认对齐 TanStack 官方 shadcn 示例的弹簧参数,
   * 驱动 tooltip 位置跟手的弹簧位移与出入场的透明度/缩放过渡。
   */
  transition?: ChartMotionTransition;
}

const props = defineProps<Props>();
const attrs = useAttrs();

/** `aria-label` 走 attrs 透传(同时落到宿主 div),供 SVG surface 复用。 */
const ariaLabel = computed(() => (typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : ''));

const renderer = motion<TDatum, TXValue, TYValue>({
  initial: 'always',
  transition: props.transition ?? { type: 'spring', stiffness: 170, damping: 18, mass: 1 }
});

const generatedId = useId();
const idPrefix = `ts-chart-${generatedId.replaceAll(/[^a-zA-Z0-9_-]/gu, '')}`;

function toHostOptions() {
  return {
    definition: props.definition,
    renderer,
    ariaLabel: ariaLabel.value,
    ariaDescription: props.ariaDescription,
    height: props.height,
    width: props.width,
    idPrefix
  };
}

const adapter = createChartRendererAdapter<TDatum, TXValue, TYValue>(toHostOptions());
const initialMarkup = adapter.prerender();

const layout = computed(() => resolveChartAdapterLayout({ width: props.width, height: props.height }));

const hostStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  width: props.width === undefined ? '100%' : props.width,
  height: props.height ?? (layout.value.aspectRatio === undefined ? 320 : undefined),
  aspectRatio: props.height === undefined ? layout.value.aspectRatio : undefined
}));

const container = shallowRef<HTMLElement>();

onMounted(() => {
  if (container.value) {
    adapter.mount(container.value);
  }
});

onUpdated(() => {
  adapter.update(toHostOptions());
});

onBeforeUnmount(() => {
  adapter.destroy();
});
</script>

<template>
  <div class="ts-chart-host" :style="hostStyle">
    <div
      ref="container"
      class="ts-chart-surface"
      :style="{ width: '100%', height: '100%' }"
      :innerHTML="initialMarkup"
    />
  </div>
</template>

<style>
/* TanStack 生成的 svg 自带 tabindex=0（键盘交互需要），鼠标点击聚焦时
   浏览器会画默认 outline。这里只去掉鼠标/触摸聚焦的 outline，
   键盘导航（:focus-visible）的焦点环保留。 */
.ts-chart-surface > svg:focus:not(:focus-visible) {
  outline: none;
}
</style>
