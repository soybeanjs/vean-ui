import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, toHandlers, useId } from 'vue';
import type { ComputedRef } from 'vue';
import { COLLECTION_ITEM_ATTRIBUTE } from '../constants';
import { getFocusIntent, isElementHasAttribute, isNullish, tryFocusFirst, wrapArray } from '../shared';
import { useDirection } from '../components/config-provider/context';
import type { DataOrientation, Direction, EmitsToHookProps, ToContext, VNodeRef } from '../types';
import { useCollection } from './use-collection';
import type { CollectionItemData } from './use-collection';
import { useContext } from './use-context';
import { useControllableState } from './use-controllable-state';
import { useForwardElement } from './use-forward-element';

export interface RovingFocusGroupOptions {
  /** The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) */
  orientation?: DataOrientation;
  /** The direction of navigation between items. */
  dir?: Direction;
  /**
   * Whether keyboard navigation should loop around
   *
   * @defaultValue false
   */
  loop?: boolean;
  /** The controlled value of the current stop item. Can be bound as `v-model`. */
  currentTabStopId?: string | null;
  /**
   * The value of the current stop item.
   *
   * Use when you do not need to control the state of the stop item.
   */
  defaultCurrentTabStopId?: string;
  /** When `true`, will prevent scrolling to the focus item when focused. */
  preventScrollOnEntryFocus?: boolean;
}

export type RovingFocusGroupEmits = {
  /** Emitted when entry focus occurs. */
  entryFocus: [event: Event];
  /** Emitted when the current tab stop id value changes. */
  'update:currentTabStopId': [value: string | null | undefined];
};

export interface RovingFocusItemOptions {
  /** Tab stop id. */
  tabStopId?: string;
  /**
   * When `false`, item will not be focusable.
   *
   * @defaultValue `true`
   */
  focusable?: boolean;
  /** When `true`, item will be initially focused. */
  active?: boolean;
  /** When `true`, shift + arrow key will allow focusing on next/previous item. */
  allowShiftKey?: boolean;
  /** Additional data to be passed to the collection item. */
  itemData?: Record<string, unknown>;
}

/** Reactive context params for the group; build from plain props with `toContext`. */
export type RovingFocusGroupContextParams = ToContext<
  RovingFocusGroupOptions,
  'orientation' | 'dir' | 'loop' | 'currentTabStopId' | 'defaultCurrentTabStopId' | 'preventScrollOnEntryFocus'
> &
  EmitsToHookProps<RovingFocusGroupEmits>;

/** Reactive item options for `useRovingFocusGroupItem`. */
export type RovingFocusGroupItemOptions = Partial<
  ToContext<RovingFocusItemOptions, 'tabStopId' | 'focusable' | 'active' | 'allowShiftKey' | 'itemData'>
>;

const ON_ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus';
const ROVING_FOCUS_EVENT_OPTIONS = { bubbles: false, cancelable: true };

const { provideCollectionContext, useCollectionContext, useCollectionItem } =
  useCollection<Record<string, unknown>>('RovingFocusGroup');

const [provideRovingFocusGroupContext, useRovingFocusGroupContext] = useContext(
  'RovingFocusGroup',
  (params: RovingFocusGroupContextParams) => {
    const { onContainerElementChange, getOrderedItems, getOrderedElements } = provideCollectionContext();

    const {
      loop,
      orientation,
      defaultCurrentTabStopId,
      preventScrollOnEntryFocus,
      onEntryFocus,
      onUpdateCurrentTabStopId
    } = params;

    const dir = useDirection(params.dir);

    const currentTabStopId = useControllableState(
      () => params.currentTabStopId.value,
      onUpdateCurrentTabStopId,
      defaultCurrentTabStopId.value ?? ''
    );

    const onItemFocus = (tabStopId: string) => {
      currentTabStopId.value = tabStopId;
    };

    const isTabbingBackOut = shallowRef(false);
    const isClickFocus = shallowRef(false);

    const onItemShiftTab = () => {
      isTabbingBackOut.value = true;
    };

    const focusableItemsCount = shallowRef(0);

    const onFocusableItemAdd = () => {
      focusableItemsCount.value++;
    };
    const onFocusableItemRemove = () => {
      focusableItemsCount.value--;
    };

    const onFocus = (event: FocusEvent) => {
      // We normally wouldn't need this check, because we already check
      // that the focus is on the current target and not bubbling to it.
      // We do this because Safari doesn't focus buttons when clicked, and
      // instead, the wrapper will get focused and not through a bubbling event.
      const isKeyboardFocus = !isClickFocus.value;

      if (!event.currentTarget || event.target !== event.currentTarget || !isKeyboardFocus || isTabbingBackOut.value) {
        isClickFocus.value = false;

        return;
      }

      const entryFocusEvent = new CustomEvent(ON_ENTRY_FOCUS, ROVING_FOCUS_EVENT_OPTIONS);
      event.currentTarget.dispatchEvent(entryFocusEvent);
      onEntryFocus?.(entryFocusEvent);

      if (entryFocusEvent.defaultPrevented) return;

      const items = getOrderedElements();
      const activeItem = items.find(item => isElementHasAttribute(item, 'active'));
      const highlightedItem = items.find(item => isElementHasAttribute(item, 'highlighted'));
      const currentItem = items.find(item => item.id === currentTabStopId.value);
      const candidateItems = [activeItem, highlightedItem, currentItem, ...items].filter(
        (item): item is HTMLElement => !isNullish(item)
      );

      tryFocusFirst(candidateItems, preventScrollOnEntryFocus.value);
    };

    const rovingFocusGroupProps = computed(() => {
      return {
        tabindex: isTabbingBackOut.value || focusableItemsCount.value === 0 ? '-1' : '0',
        'data-orientation': orientation.value,
        dir: dir.value,
        'data-loop': loop.value ? '' : undefined,
        style: 'outline: none'
      };
    });

    const rovingFocusGroupListeners = {
      mousedown: () => {
        isClickFocus.value = true;
      },
      mouseup: () => {
        // reset `isClickFocus` after 1 tick because handleFocus might not triggered due to focused element
        setTimeout(() => {
          isClickFocus.value = false;
        }, 1);
      },
      focus: onFocus,
      blur: () => {
        isTabbingBackOut.value = false;
      }
    };

    return {
      onContainerElementChange,
      loop,
      dir,
      orientation,
      currentTabStopId,
      onItemFocus,
      onItemShiftTab,
      onFocusableItemAdd,
      onFocusableItemRemove,
      rovingFocusGroupProps,
      rovingFocusGroupListeners,
      getOrderedItems
    };
  }
);

/**
 * Roving focus group as a pure hook: no render shell, consumers render their
 * own element (usually `Primitive`) and spread the returned bindings.
 *
 * @param params - Reactive context params; build from plain props with `toContext`.
 * @returns A container ref binder, the merged group props (attributes + listeners + data marker)
 * and the ordered collection accessor.
 */
export function useRovingFocusGroup(params: RovingFocusGroupContextParams) {
  const { onContainerElementChange, rovingFocusGroupProps, rovingFocusGroupListeners, getOrderedItems } =
    provideRovingFocusGroupContext(params);

  const [, setContainerElement] = useForwardElement(onContainerElementChange);

  const groupProps = computed(() => ({
    ...rovingFocusGroupProps.value,
    ...toHandlers(rovingFocusGroupListeners),
    'data-vean-roving-focus-group': ''
  }));

  return {
    setContainerElement,
    groupProps,
    getOrderedItems
  } as {
    setContainerElement: (nodeRef: VNodeRef) => void;
    groupProps: ComputedRef<Record<string, unknown>>;
    getOrderedItems: (excludeDisabled?: boolean) => CollectionItemData<Record<string, unknown>>[];
  };
}

/**
 * Roving focus item as a pure hook: registers with the group collection and
 * returns merged item props (tabindex, data attributes, listeners) for `v-bind`.
 *
 * @param options - Reactive item options; build from plain props with `toContext`.
 * @returns An item ref binder and the merged item props.
 */
export function useRovingFocusGroupItem(options: RovingFocusGroupItemOptions = {}) {
  const { getOrderedElements } = useCollectionContext('RovingFocusItem');
  const { setItemElement } = useCollectionItem(() => options.itemData?.value ?? {});
  const {
    currentTabStopId,
    orientation,
    dir,
    loop,
    onItemFocus,
    onItemShiftTab,
    onFocusableItemAdd,
    onFocusableItemRemove
  } = useRovingFocusGroupContext('RovingFocusItem');

  const { active, allowShiftKey } = options;

  const generatedTabStopId = useId();

  const tabStopId = computed(() => options.tabStopId?.value ?? generatedTabStopId);
  const focusable = computed(() => options.focusable?.value ?? true);

  const isCurrentTabStop = computed(() => currentTabStopId.value === tabStopId.value);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && event.shiftKey) {
      onItemShiftTab();
      return;
    }

    if (event.target !== event.currentTarget) return;

    const focusIntent = getFocusIntent(event, orientation.value, dir.value);

    if (isNullish(focusIntent)) return;

    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (!allowShiftKey?.value && event.shiftKey) return;

    event.preventDefault();

    let candidateNodes = getOrderedElements();
    if (focusIntent === 'last') {
      candidateNodes.reverse();
    }

    if (focusIntent === 'prev' || focusIntent === 'next') {
      if (focusIntent === 'prev') {
        candidateNodes.reverse();
      }

      const currentIndex = candidateNodes.indexOf(event.currentTarget as HTMLElement);

      candidateNodes = loop.value
        ? wrapArray(candidateNodes, currentIndex + 1)
        : candidateNodes.slice(currentIndex + 1);
    }

    nextTick(() => {
      tryFocusFirst(candidateNodes);
    });
  };

  const itemListeners = {
    mousedown: (event: MouseEvent) => {
      // We prevent focusing non-focusable items on `mousedown`.
      // Even though the item has tabIndex={-1}, that only means take it out of the tab order.
      if (!focusable.value) {
        event.preventDefault();
      } else {
        // Safari doesn't focus a button when clicked so we run our logic on mousedown also
        onItemFocus(tabStopId.value);
      }
    },
    focus: () => {
      onItemFocus(tabStopId.value);
    },
    keydown: onKeyDown
  };

  const itemProps = computed(() => ({
    tabindex: isCurrentTabStop.value ? '0' : '-1',
    [COLLECTION_ITEM_ATTRIBUTE]: '',
    'data-orientation': orientation.value,
    // Only expose the key when the item is active: mergeProps lets extra
    // props override with `undefined`, which would wipe a child's own
    // `data-active` binding.
    ...(active?.value ? { 'data-active': '' } : {}),
    'data-disabled': !focusable.value ? '' : undefined,
    ...toHandlers(itemListeners),
    'data-vean-roving-focus-item': ''
  }));

  onMounted(() => {
    onFocusableItemAdd();
  });

  onBeforeUnmount(() => {
    onFocusableItemRemove();
  });

  return {
    setItemElement,
    itemProps
  } as {
    setItemElement: (nodeRef: VNodeRef) => void;
    itemProps: ComputedRef<Record<string, unknown>>;
  };
}
