<script setup lang="ts">
import { computed, nextTick, onMounted, shallowRef, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { useForwardElement, usePresence } from '../../composables';
import { Primitive } from '../primitive';
import { collapsibleContentCssVars } from './shared';
import { useCollapsibleRootContext, useCollapsibleUi } from './context';
import type { CollapsibleContentProps } from './types';

defineOptions({
  name: 'CollapsibleContent'
});

const props = defineProps<CollapsibleContentProps>();

const [contentElement, setContentElement] = useForwardElement();

const { contentId, initContentId, open, dataDisabled, dataState, unmountOnHide } =
  useCollapsibleRootContext('CollapsibleContent');

const cls = useCollapsibleUi('content');

const isPresent = props.forceMount ? shallowRef(true) : usePresence(contentElement, open, handleNodeStyle);

const style: CSSProperties = {
  [collapsibleContentCssVars.width]: '0px',
  [collapsibleContentCssVars.height]: '0px'
};

// when opening we want it to immediately open to retrieve dimensions
// when closing we delay `present` to retrieve dimensions before closing
const isOpen = computed(() => isPresent.value || open.value);
let isMountAnimationPrevented = open.value;
let originalAnimationName: string | undefined;

const hidden = computed(() => {
  if (isOpen.value) {
    return undefined;
  }

  return unmountOnHide.value ? '' : 'until-found';
});

function handleNodeStyle() {
  const node = contentElement.value;

  if (!node) return;

  const nodeStyle = node.style;

  // Capture the inline value to restore after the measurement freeze. It has to
  // be captured once, before the first freeze, and it is normally the empty
  // string — hence a nullish check, not `||=`: re-capturing on the next call
  // would pick up the frozen `'none'` written below and turn the restore into a
  // permanent no-op, so a content that mounted already open (default-expanded
  // branch, deep selection, `defaultOpen`) collapsed without its animation and
  // never animated again.
  originalAnimationName ??= nodeStyle.animationName;

  const restoreAnimationName = originalAnimationName;

  // Block the keyframe animation so the element renders at its full dimensions
  // instead of at the animation's current height.
  //
  // Only `animation-name` is blocked. Freezing `transition-duration` here (the
  // other half of the usual measurement dance) would cancel whatever the content
  // element transitions on close — the card transitions its own padding — because
  // this measurement and the closing state change land in the *same* style recalc,
  // so the transition never survives to run.
  nodeStyle.animationName = 'none';

  // get width and height from full dimensions
  const rect = node.getBoundingClientRect();
  nodeStyle.setProperty(collapsibleContentCssVars.width, `${rect.width}px`);
  nodeStyle.setProperty(collapsibleContentCssVars.height, `${rect.height}px`);

  if (!isMountAnimationPrevented) {
    // kick off any animations that were originally set up if it isn't the initial mount
    nodeStyle.animationName = restoreAnimationName;
  }
}

watch(
  isOpen,
  async () => {
    await nextTick();
    handleNodeStyle();
  },
  { immediate: true, flush: 'post' }
);

initContentId();

onMounted(() => {
  requestAnimationFrame(() => {
    isMountAnimationPrevented = false;
  });
});
</script>

<template>
  <Primitive
    :id="contentId"
    :ref="setContentElement"
    :as="as"
    :as-child="asChild"
    data-vean-collapsible-content
    :class="cls"
    :data-disabled="dataDisabled"
    :data-state="dataState"
    :hidden="hidden"
    :style="style"
  >
    <slot v-if="!unmountOnHide || isOpen" />
  </Primitive>
</template>
