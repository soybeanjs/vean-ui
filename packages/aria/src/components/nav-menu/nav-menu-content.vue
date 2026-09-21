<script setup lang="ts">
import { computed, shallowRef, useAttrs } from 'vue';
import { getActiveElement, getTabbableCandidates, isClient, tryFocusFirst } from '../../shared';
import { useArrowNavigation, useExposedElement, useOmitProps, usePresence } from '../../composables';
import { useNavMenuItemContext, useNavMenuRootContext, useNavMenuUi } from './context';
import type { NavMenuContentProps } from './types';

defineOptions({
  name: 'NavMenuContent',
  inheritAttrs: false
});

const props = defineProps<NavMenuContentProps>();

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['forceMount'], attrs);

const { modelValue, viewportElement, orientation } = useNavMenuRootContext('NavMenuContent');
const { value, triggerId, contentId, dataState, focusProxyElement, onContentFocusOutside } =
  useNavMenuItemContext('NavMenuContent');

const cls = useNavMenuUi('content');

const [contentElement, setContentElement] = useExposedElement();

const open = computed(() => modelValue.value === value);

const isPresent = props.forceMount ? shallowRef(true) : usePresence(contentElement, open);

const to = computed(() => (isClient && viewportElement.value ? viewportElement.value : 'body'));
const disabledTeleport = computed(() => !isClient || !viewportElement.value);

// Tab moves between focusable candidates and hands off to the focus proxy at the edges;
// arrow keys navigate the candidates as well.
const onKeydown = (event: KeyboardEvent) => {
  if (!contentElement.value?.contains(event.target as HTMLElement)) return;

  const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
  const isTabKey = event.key === 'Tab' && !isMetaKey;
  const candidates = getTabbableCandidates(contentElement.value);

  if (isTabKey) {
    const focusedElement = getActiveElement();
    const index = candidates.findIndex(candidate => candidate === focusedElement);
    const isMovingBackwards = event.shiftKey;
    const nextCandidates = isMovingBackwards
      ? candidates.slice(0, index).reverse()
      : candidates.slice(index + 1, candidates.length);

    if (tryFocusFirst(nextCandidates)) {
      // prevent browser tab keydown because we've handled focus
      event.preventDefault();
    } else {
      // at the edges, hand focus to the proxy so the browser can continue tabbing
      focusProxyElement.value?.focus();
      return;
    }
  }

  const newSelectedElement = useArrowNavigation(event, getActiveElement() as HTMLElement, undefined, {
    itemsArray: candidates,
    loop: false,
    enableIgnoredElement: true
  });
  newSelectedElement?.focus();
};

// Remove the content candidates from the tab order once focus leaves the content.
const onFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget as Node | null;
  if (!contentElement.value?.contains(next)) {
    onContentFocusOutside();
  }
};
</script>

<template>
  <Teleport :to="to" :disabled="disabledTeleport">
    <div
      v-if="isPresent"
      v-bind="forwardedProps"
      :id="contentId"
      :ref="setContentElement"
      data-vean-nav-menu-content
      :class="cls"
      :aria-labelledby="triggerId"
      :data-orientation="orientation"
      :data-state="dataState"
      @keydown="onKeydown"
      @focusout="onFocusOut"
    >
      <slot />
    </div>
  </Teleport>
</template>
