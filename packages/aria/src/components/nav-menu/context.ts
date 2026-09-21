import { computed, shallowRef } from 'vue';
import { useEventListener } from '@vueuse/core';
import { getDisclosureState } from '../../shared';
import { providePopperUi } from '../popper/context';
import { useCollection, useContext, useForwardElement, useUiContext } from '../../composables';
import { EVENT_ROOT_CONTENT_DISMISS } from './shared';
import type { NavMenuItemContextParams, NavMenuRootContextParams, NavMenuUiSlot } from './types';

export const [provideNavMenuRootContext, useNavMenuRootContext] = useContext(
  'NavMenuRoot',
  (params: NavMenuRootContextParams) => {
    const { modelValue } = params;

    const rootElement = shallowRef<HTMLElement>();
    const onRootElementChange = (node: HTMLElement) => {
      rootElement.value = node;
    };

    // The shared popup surface (the viewport); the active content teleports into it.
    const [viewportElement, setViewportElement] = useForwardElement();

    const activeTriggerElement = shallowRef<HTMLElement>();
    const onActiveTriggerElementChange = (node: HTMLElement) => {
      activeTriggerElement.value = node;
    };

    const values = shallowRef(new Set<string>());

    const addValue = (val: string) => {
      values.value.add(val);
    };
    const removeValue = (val: string) => {
      values.value.delete(val);
    };

    const open = computed(() => values.value.has(modelValue.value));

    // The single shared Popper hover machine has no per-trigger identity, so this slot
    // carries the value of whichever trigger was most recently hovered; opening routes
    // `modelValue` to it (value routing replaces per-item roots).
    const pendingValue = shallowRef('');

    // Escape-close guard so hover does not immediately re-open after an explicit close.
    const wasEscapeCloseRef = shallowRef(false);

    const onItemSelect = (val: string) => {
      modelValue.value = val;
    };

    const onItemDismiss = () => {
      modelValue.value = '';
    };

    useEventListener(rootElement, EVENT_ROOT_CONTENT_DISMISS, onItemDismiss);

    return {
      ...params,
      baseId: 'vean-nav-menu',
      rootElement,
      onRootElementChange,
      viewportElement,
      setViewportElement,
      activeTriggerElement,
      values,
      addValue,
      removeValue,
      open,
      pendingValue,
      wasEscapeCloseRef,
      onActiveTriggerElementChange,
      onItemSelect,
      onItemDismiss
    };
  }
);

export const { provideCollectionContext, useCollectionContext, useCollectionItem } = useCollection('NavMenu');

export const [provideNavMenuItemContext, useNavMenuItemContext] = useContext(
  'NavMenuItem',
  (params: NavMenuItemContextParams) => {
    const [focusProxyElement, setFocusProxyElement] = useForwardElement();

    const { modelValue, value } = params;

    const triggerElement = shallowRef<HTMLElement>();
    const onTriggerElementChange = (node: HTMLElement) => {
      triggerElement.value = node;
    };

    const open = computed(() => modelValue.value === value);

    const dataState = computed(() => getDisclosureState(open.value));

    return {
      ...params,
      triggerElement,
      onTriggerElementChange,
      focusProxyElement,
      setFocusProxyElement,
      open,
      dataState
    };
  }
);

export const [provideNavMenuUi, useNavMenuUi] = useUiContext<NavMenuUiSlot>('NavMenuUi', ui => {
  const popperUi = computed(() => ({
    positioner: ui.value.positioner,
    popup: ui.value.viewport,
    arrow: ui.value.arrow
  }));

  providePopperUi(popperUi);

  return ui;
});
