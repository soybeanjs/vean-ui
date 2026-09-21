import { computed, nextTick, watchEffect } from 'vue';
import type { Ref, ShallowRef } from 'vue';
import { useForwardElement } from '../../composables';
import type { MaybePromise } from '../../types';
import type { PageTabsOptionData, PageTabsState } from './types';

interface UsePageTabsStateOptions<T extends PageTabsOptionData> {
  items: Ref<T[]>;
  modelValue: Ref<string>;
  beforeClose: (value: string) => MaybePromise<boolean | void>;
}

/**
 * Sort zone of a tab: `0` = pinned, `1` = unpinned. Tabs may reorder by
 * dragging within their own zone only, which keeps the pinned group
 * aggregated at the front. `hidePinnedIcon` is display-only and never
 * affects the zone, so all pinned tabs reorder among themselves.
 *
 * The zone doubles as the reorder group handed to `useSortableList`.
 */
export function getPageTabZone(tab: Pick<PageTabsOptionData, 'pinned'>): number {
  return tab.pinned ? 0 : 1;
}

export function usePageTabsScroll(selectedValue: ShallowRef<string>) {
  const [rootElement, setRootElement] = useForwardElement();

  const onWheel = (event: WheelEvent) => {
    if (rootElement.value) {
      rootElement.value.scrollLeft += event.deltaY;
    }
  };

  watchEffect(async () => {
    if (!rootElement.value || !selectedValue.value) return;

    await nextTick();

    // Re-check after the await — the element may have been removed during the tick.
    if (!rootElement.value) return;

    const selectedElement = rootElement.value.querySelector<HTMLElement>(`[data-value="${selectedValue.value}"]`);
    if (!selectedElement) return;

    const centerX = (rootElement.value?.offsetWidth ?? 0) / 2;

    const offsetX = selectedElement.offsetLeft + selectedElement.offsetWidth / 2 - centerX;

    rootElement.value.scrollTo({ left: offsetX, behavior: 'smooth' });
  });

  return {
    rootElement,
    setRootElement,
    onWheel
  };
}

export function usePageTabsState<T extends PageTabsOptionData>(options: UsePageTabsStateOptions<T>) {
  const { items, modelValue } = options;

  const values = computed(() => items.value.map(item => item.value));

  const pinTab = (tab: T, pinned: boolean) => {
    tab.pinned = pinned;
  };

  const removeTab = (value: string) => {
    const index = values.value.indexOf(value);

    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const canCloseTab = (value: string) => {
    return !items.value.find(item => item.value === value)?.pinned;
  };

  const closeTab = async (value: string, onClose?: () => void) => {
    if (!canCloseTab(value)) {
      return;
    }

    const closable = await options.beforeClose(value);

    if (closable === false) {
      return;
    }

    const isActive = modelValue.value === value;

    let nextValue: string | undefined;

    if (isActive) {
      const index = values.value.indexOf(value);
      const nextItem = items.value[index + 1] ?? items.value[index - 1] ?? undefined;

      nextValue = nextItem?.value;
    }

    removeTab(value);

    if (isActive) {
      modelValue.value = nextValue ?? '';
    }

    onClose?.();
  };

  const removeTabs = (removed: string[]) => {
    if (removed.length === 0) {
      return;
    }

    const updated = items.value.filter(item => !removed.includes(item.value));
    const hasActive = removed.includes(modelValue.value);

    let nextValue: string | undefined;

    if (hasActive) {
      nextValue = updated[updated.length - 1]?.value;
    }

    items.value = updated;

    if (hasActive) {
      modelValue.value = nextValue ?? '';
    }
  };

  const getLeftClosableTabs = (value: string) => {
    const index = values.value.indexOf(value);

    if (index <= 0) {
      return [];
    }

    return items.value
      .slice(0, index)
      .filter(item => !item.pinned)
      .map(item => item.value);
  };

  const canCloseLeftTabs = (value: string) => getLeftClosableTabs(value).length > 0;

  const closeLeftTabs = (value: string) => {
    if (!canCloseLeftTabs(value)) {
      return;
    }

    removeTabs(getLeftClosableTabs(value));
  };

  const getRightClosableTabs = (value: string) => {
    const index = values.value.indexOf(value);

    if (index === -1 || index >= values.value.length - 1) {
      return [];
    }

    return items.value
      .slice(index + 1)
      .filter(item => !item.pinned)
      .map(item => item.value);
  };

  const canCloseRightTabs = (value: string) => getRightClosableTabs(value).length > 0;

  const closeRightTabs = (value: string) => {
    if (!canCloseRightTabs(value)) {
      return;
    }

    removeTabs(getRightClosableTabs(value));
  };

  const getOtherClosableTabs = (value: string) => {
    return items.value.filter(item => item.value !== value && !item.pinned).map(item => item.value);
  };

  const canCloseOtherTabs = (value: string) => getOtherClosableTabs(value).length > 0;

  const closeOtherTabs = (value: string) => {
    if (!canCloseOtherTabs(value)) {
      return;
    }

    removeTabs(getOtherClosableTabs(value));
  };

  const getAllClosableTabs = () => items.value.filter(item => !item.pinned).map(item => item.value);
  const canCloseAllTabs = () => getAllClosableTabs().length > 0;

  const closeAllTabs = () => {
    if (!canCloseAllTabs()) {
      return;
    }

    removeTabs(getAllClosableTabs());
  };

  const sortTabs = () => {
    // Stable sort by zone keeps the relative order within each zone, so
    // drag-reordered tabs never bounce back after a pin/unpin transition.
    const updated = [...items.value].sort((a, b) => getPageTabZone(a) - getPageTabZone(b));
    const hasChanged = updated.some((item, index) => item.value !== items.value[index].value);

    if (hasChanged) {
      items.value = updated;
    }
  };

  const getState = (tab: T): PageTabsState => {
    const value = tab.value;

    return {
      pin: () => {
        tab.pinned = true;
        sortTabs();
      },
      unpin: () => {
        tab.pinned = false;
        sortTabs();
      },
      closable: canCloseTab(value),
      close: async () => {
        await closeTab(value);
      },
      leftClosable: canCloseLeftTabs(value),
      closeLeft: () => {
        closeLeftTabs(value);
      },
      rightClosable: canCloseRightTabs(value),
      closeRight: () => {
        closeRightTabs(value);
      },
      otherClosable: canCloseOtherTabs(value),
      closeOther: () => {
        closeOtherTabs(value);
      },
      allClosable: canCloseAllTabs(),
      closeAll: () => {
        closeAllTabs();
      }
    };
  };

  return {
    closeTab,
    pinTab,
    sortTabs,
    getState
  };
}
