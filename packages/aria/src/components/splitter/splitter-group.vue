<script setup lang="ts">
import { computed, shallowRef, useId } from 'vue';
import { useForwardElement, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import {
  areLayoutsEqual,
  getDefaultLayout,
  getPanelBounds,
  getPanelState,
  normalizeLayout,
  resizeLayoutPair,
  sortPanels
} from './shared';
import { provideSplitterGroupContext, useSplitterUi } from './context';
import type { SplitterGroupProps, SplitterGroupEmits, SplitterPanelRecord, SplitterPanelRegistration } from './types';

defineOptions({
  name: 'SplitterGroup'
});

const props = withDefaults(defineProps<SplitterGroupProps>(), {
  direction: 'horizontal',
  dir: undefined,
  defaultLayout: undefined,
  keyboardResizeBy: 10
});

const emit = defineEmits<SplitterGroupEmits>();

const [rootElement, setRootElement] = useForwardElement();

const cls = useSplitterUi('root');

const forwardedProps = useOmitProps(props, ['direction', 'dir', 'defaultLayout', 'keyboardResizeBy']);

const panels = shallowRef<SplitterPanelRecord[]>([]);
const layout = shallowRef<number[]>([]);
const previousNotifiedSizes = shallowRef<Record<string, number | undefined>>({});
const previousCollapsedState = shallowRef<Record<string, boolean | undefined>>({});
const lastExpandedSizes = shallowRef<Record<string, number | undefined>>({});
let registrationIndex = 0;

const direction = computed(() => (props.direction === 'vertical' ? 'vertical' : 'horizontal'));
const dirProp = computed(() => props.dir);
const keyboardResizeBy = computed(() => Math.max(props.keyboardResizeBy, 1));
const orderedPanels = computed(() => sortPanels(panels.value));
const groupId = `vean-splitter-group-${useId()}`;

function getLayoutByPanelId() {
  return new Map(orderedPanels.value.map((panel, index) => [panel.id, layout.value[index]]));
}

function notifyPanels(nextLayout: number[]) {
  const nextSizes = { ...previousNotifiedSizes.value };
  const nextCollapsed = { ...previousCollapsedState.value };

  orderedPanels.value.forEach((panel, index) => {
    const nextSize = nextLayout[index];
    const prevSize = previousNotifiedSizes.value[panel.id];

    panel.onResize(nextSize!, prevSize);

    const isCollapsed = getPanelState(nextSize, panel) === 'collapsed';
    const wasCollapsed = previousCollapsedState.value[panel.id];

    if (isCollapsed !== wasCollapsed) {
      if (isCollapsed) {
        panel.onCollapse();
      } else if (wasCollapsed !== undefined) {
        panel.onExpand();
      }
    }

    if (!isCollapsed) {
      lastExpandedSizes.value = {
        ...lastExpandedSizes.value,
        [panel.id]: nextSize
      };
    }

    nextSizes[panel.id] = nextSize;
    nextCollapsed[panel.id] = isCollapsed;
  });

  previousNotifiedSizes.value = nextSizes;
  previousCollapsedState.value = nextCollapsed;
}

function setLayout(nextLayout: number[]) {
  if (areLayoutsEqual(layout.value, nextLayout)) {
    return;
  }

  layout.value = nextLayout;
  emit('layout', nextLayout);
  notifyPanels(nextLayout);
}

function refreshLayout() {
  const currentSizesById = layout.value.length === orderedPanels.value.length ? getLayoutByPanelId() : undefined;
  const fallbackLayout =
    props.defaultLayout?.length === orderedPanels.value.length
      ? props.defaultLayout
      : getDefaultLayout(orderedPanels.value, currentSizesById);
  const nextLayout = normalizeLayout(fallbackLayout, orderedPanels.value);

  setLayout(nextLayout);
}

function getPanelIndex(panelId: string) {
  return orderedPanels.value.findIndex(panel => panel.id === panelId);
}

function getGroupSize() {
  const rect = rootElement.value?.getBoundingClientRect();

  if (!rect) {
    return 0;
  }

  return direction.value === 'vertical' ? rect.height : rect.width;
}

function resizePanelPairByIndex(pairIndex: number, delta: number) {
  const nextLayout = resizeLayoutPair(layout.value, orderedPanels.value, pairIndex, delta);

  setLayout(nextLayout);
}

function getPanelRecordByIndex(index: number) {
  return orderedPanels.value[index];
}

function getPanelBoundsById(panelId: string) {
  const panelIndex = getPanelIndex(panelId);
  const panel = orderedPanels.value[panelIndex];

  if (!panel) {
    return undefined;
  }

  const pairTotal =
    panelIndex < orderedPanels.value.length - 1
      ? (layout.value[panelIndex] ?? 0) + (layout.value[panelIndex + 1] ?? 0)
      : panelIndex > 0
        ? (layout.value[panelIndex - 1] ?? 0) + (layout.value[panelIndex] ?? 0)
        : 100;

  return getPanelBounds(panel, pairTotal);
}

function resizePanel(panelId: string, size: number) {
  const panelIndex = getPanelIndex(panelId);

  if (panelIndex < 0) {
    return;
  }

  if (panelIndex < orderedPanels.value.length - 1) {
    const currentSize = layout.value[panelIndex] ?? 0;
    resizePanelPairByIndex(panelIndex, size - currentSize);
    return;
  }

  if (panelIndex > 0) {
    const currentSize = layout.value[panelIndex] ?? 0;
    const previousSize = layout.value[panelIndex - 1] ?? 0;
    const pairTotal = currentSize + previousSize;
    resizePanelPairByIndex(panelIndex - 1, pairTotal - size - previousSize);
  }
}

function collapsePanel(panelId: string) {
  const panel = orderedPanels.value.find(item => item.id === panelId);

  if (!panel?.collapsible.value) {
    return;
  }

  const size = getPanelSize(panelId);

  if (size !== undefined && size > panel.collapsedSize.value) {
    lastExpandedSizes.value = {
      ...lastExpandedSizes.value,
      [panelId]: size
    };
  }

  resizePanel(panelId, panel.collapsedSize.value);
}

function expandPanel(panelId: string) {
  const panel = orderedPanels.value.find(item => item.id === panelId);

  if (!panel) {
    return;
  }

  const fallbackSize = lastExpandedSizes.value[panelId] ?? panel.defaultSize.value ?? panel.minSize.value;
  resizePanel(panelId, Math.max(fallbackSize, panel.minSize.value));
}

function getPanelSize(panelId: string) {
  const panelIndex = getPanelIndex(panelId);

  if (panelIndex < 0) {
    return undefined;
  }

  return layout.value[panelIndex];
}

function isPanelCollapsed(panelId: string) {
  const panel = orderedPanels.value.find(item => item.id === panelId);
  const size = getPanelSize(panelId);

  if (!panel) {
    return false;
  }

  return getPanelState(size, panel) === 'collapsed';
}

function getPanelStyle(panelId: string) {
  const size = getPanelSize(panelId);

  return {
    flexBasis: '0px',
    flexGrow: size ?? 0,
    flexShrink: 1,
    overflow: 'hidden'
  };
}

function registerPanel(panel: SplitterPanelRegistration) {
  panels.value = [
    ...panels.value,
    {
      ...panel,
      registrationIndex
    }
  ];
  registrationIndex += 1;

  refreshLayout();
}

function unregisterPanel(panelId: string) {
  panels.value = panels.value.filter(panel => panel.id !== panelId);
  refreshLayout();
}

const { dir } = provideSplitterGroupContext({
  direction,
  dir: dirProp,
  keyboardResizeBy,
  groupId,
  layout,
  rootElement,
  registerPanel,
  unregisterPanel,
  refreshLayout,
  getPanelStyle,
  getPanelSize,
  isPanelCollapsed,
  collapsePanel,
  expandPanel,
  resizePanel,
  resizePanelPair: resizePanelPairByIndex,
  getPanelRecordByIndex,
  getPanelBounds: getPanelBoundsById,
  getGroupSize
});

refreshLayout();
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :ref="setRootElement"
    :as="as"
    :as-child="asChild"
    data-vean-splitter-group
    :class="cls"
    :dir="dir"
    :data-orientation="direction"
    :data-panel-group-direction="direction"
    :data-splitter-group-id="groupId"
  >
    <slot :layout="layout" />
  </Primitive>
</template>
