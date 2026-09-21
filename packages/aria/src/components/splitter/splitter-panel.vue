<script setup lang="ts">
import { computed, onMounted, onUnmounted, useId, watch } from 'vue';
import { clamp } from '../../shared';
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useSplitterGroupContext, useSplitterUi } from './context';
import type { SplitterPanelProps, SplitterPanelEmits } from './types';

defineOptions({
  name: 'SplitterPanel'
});

const props = withDefaults(defineProps<SplitterPanelProps>(), {
  defaultSize: undefined,
  collapsible: false,
  collapsedSize: 0,
  maxSize: 100,
  minSize: 10,
  order: undefined
});

const emit = defineEmits<SplitterPanelEmits>();

const cls = useSplitterUi('panel');

const forwardedProps = useOmitProps(props, [
  'defaultSize',
  'collapsible',
  'collapsedSize',
  'maxSize',
  'minSize',
  'order'
]);

const panelId = `vean-splitter-panel-${useId()}`;

const {
  groupId,
  registerPanel,
  unregisterPanel,
  refreshLayout,
  getPanelStyle,
  getPanelSize,
  isPanelCollapsed,
  collapsePanel,
  expandPanel,
  resizePanel
} = useSplitterGroupContext('SplitterPanel');

const defaultSize = computed(() => (props.defaultSize === undefined ? undefined : clamp(props.defaultSize, 0, 100)));
const collapsedSize = computed(() => clamp(props.collapsedSize, 0, 100));
const minSize = computed(() => clamp(props.minSize, 0, 100));
const maxSize = computed(() => clamp(props.maxSize, minSize.value, 100));
const collapsible = computed(() => props.collapsible);
const order = computed(() => props.order);

const style = computed(() => getPanelStyle(panelId));
const size = computed(() => getPanelSize(panelId));
const dataState = computed(() =>
  collapsible.value ? (isPanelCollapsed(panelId) ? 'collapsed' : 'expanded') : undefined
);
const isCollapsed = computed(() => isPanelCollapsed(panelId));
const isExpanded = computed(() => !isCollapsed.value);

watch([defaultSize, collapsedSize, minSize, maxSize, collapsible, order], refreshLayout);

onMounted(() => {
  registerPanel({
    id: panelId,
    order,
    defaultSize,
    minSize,
    maxSize,
    collapsible,
    collapsedSize,
    onCollapse: () => emit('collapse'),
    onExpand: () => emit('expand'),
    onResize: (nextSize, prevSize) => emit('resize', nextSize, prevSize)
  });
});

onUnmounted(() => {
  unregisterPanel(panelId);
});

function collapse() {
  collapsePanel(panelId);
}

function expand() {
  expandPanel(panelId);
}

function resize(sizeValue: number) {
  resizePanel(panelId, sizeValue);
}

defineExpose({
  collapse,
  expand,
  getSize: () => size.value,
  resize,
  isCollapsed,
  isExpanded
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :id="panelId"
    :as="as"
    :as-child="asChild"
    data-vean-splitter-panel
    :class="cls"
    :style="style"
    data-panel=""
    :data-panel-group-id="groupId"
    :data-panel-size="size"
    :data-panel-collapsible="collapsible || undefined"
    :data-state="dataState"
  >
    <slot
      :is-collapsed="isCollapsed"
      :is-expanded="isExpanded"
      :collapse="collapse"
      :expand="expand"
      :resize="resize"
    />
  </Primitive>
</template>
