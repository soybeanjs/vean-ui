import { computed, nextTick, shallowRef, useId } from 'vue';
import { createEventHook } from '@vueuse/core';
import { findValuesBetween, getFocusIntent } from '../../shared';
import { useDirection } from '../config-provider/context';
import { provideInputUi } from '../input/context';
import { useCollection, useContext, useForwardElement, useTypeahead, useUiContext } from '../../composables';
import type {
  ListboxCollectionItemData,
  ListboxItemContextParams,
  ListboxRootContextParams,
  ListboxUiSlot
} from './types';

export const { provideCollectionContext, useCollectionContext, useCollectionItem } =
  useCollection<ListboxCollectionItemData>('Listbox');

export const [provideListboxRootContext, useListboxRootContext] = useContext(
  'ListboxRoot',
  (params: ListboxRootContextParams) => {
    const [rootElement, setRootElement] = useForwardElement();
    const { getOrderedItems, getOrderedElements } = provideCollectionContext();
    const { handleTypeaheadSearch } = useTypeahead();
    const {
      modelValue,
      orientation,
      selectionBehavior,
      isMultiple,
      onModelValueChange: _onModelValueChange,
      onHighlight,
      onEntryFocus
    } = params;
    const dir = useDirection(params.dir);

    const firstValue = shallowRef<string>();
    const isUserAction = shallowRef(false);
    const focusable = shallowRef(true);
    const highlightedElement = shallowRef<HTMLElement | null>(null);
    const previousElement = shallowRef<HTMLElement | null>(null);
    const isVirtual = shallowRef(false);
    const isComposing = shallowRef(false);
    const virtualFocusHook = createEventHook<Event | null | undefined>();
    const virtualKeydownHook = createEventHook<KeyboardEvent>();
    const virtualHighlightHook = createEventHook<string>();

    const onModelValueChange = (value: string) => {
      isUserAction.value = true;

      if (isMultiple.value && selectionBehavior.value === 'replace') {
        firstValue.value = value;
      }
      _onModelValueChange(value);

      setTimeout(() => {
        isUserAction.value = false;
      }, 1);
    };

    const changeHighlight = (el: HTMLElement, scrollIntoView = true, focus?: boolean) => {
      if (!el) return;

      highlightedElement.value = el;
      if (focus ?? focusable.value) {
        highlightedElement.value.focus();
      }
      if (scrollIntoView) {
        highlightedElement.value.scrollIntoView({ block: 'nearest' });
      }

      const highlightedItem = getOrderedItems().find(item => item.element === el);
      onHighlight(highlightedItem);
    };

    const highlightItem = (value: string) => {
      if (isVirtual.value) {
        virtualHighlightHook.trigger(value);
      } else {
        const item = getOrderedItems().find(i => i.data.value === value);
        if (item) {
          highlightedElement.value = item.element;
          changeHighlight(item.element);
        }
      }
    };

    const onKeydownEnter = (event: KeyboardEvent) => {
      if (!highlightedElement.value?.isConnected) return;
      event.preventDefault();
      event.stopPropagation();

      if (isComposing.value) return;
      highlightedElement.value.click();
    };

    const onKeydownTypeahead = (event: KeyboardEvent) => {
      isUserAction.value = true;
      if (isVirtual.value) {
        virtualKeydownHook.trigger(event);
      } else {
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;

        const collection = getOrderedItems();
        if (isMetaKey && event.key === 'a' && isMultiple.value) {
          const values = collection.map(i => i.data.value);
          modelValue.value = [...values];
          event.preventDefault();

          const lastElement = collection[collection.length - 1]?.element;
          if (lastElement) {
            changeHighlight(lastElement);
          }
        } else if (!isMetaKey) {
          const el = handleTypeaheadSearch(event.key, collection);
          if (el) {
            changeHighlight(el);
          }
        }
      }
      setTimeout(() => {
        isUserAction.value = false;
      }, 1);
    };

    const onCompositionStart = () => {
      isComposing.value = true;
    };

    const onCompositionEnd = () => {
      nextTick(() => {
        isComposing.value = false;
      });
    };

    const onLeave = (event: Event) => {
      const el = highlightedElement.value;

      if (el?.isConnected) {
        previousElement.value = el;
      }

      highlightedElement.value = null;
      params.onLeave(event);
    };

    const onEnter = (event: Event) => {
      const entryFocusEvent = new CustomEvent('listbox.entryFocus', {
        bubbles: false,
        cancelable: true
      });
      event.currentTarget?.dispatchEvent(entryFocusEvent);
      onEntryFocus(entryFocusEvent);

      if (entryFocusEvent.defaultPrevented) return;

      if (previousElement.value) {
        changeHighlight(previousElement.value);
      } else {
        const el = getOrderedElements()?.[0];
        if (el) {
          changeHighlight(el);
        }
      }
    };

    const onKeydownNavigation = (event: KeyboardEvent) => {
      const intent = getFocusIntent(event, orientation.value, dir.value);
      if (!intent) return;

      let collection = getOrderedElements();
      if (highlightedElement.value) {
        if (intent === 'last') {
          collection.reverse();
        } else if (intent === 'prev' || intent === 'next') {
          if (intent === 'prev') {
            collection.reverse();
          }

          const currentIndex = collection.indexOf(highlightedElement.value);
          collection = collection.slice(currentIndex + 1);
        }

        const firstElement = collection[0];
        if (firstElement) {
          handleMultipleReplace(event, firstElement);
        }
      }

      if (collection.length) {
        const index = !highlightedElement.value && intent === 'prev' ? collection.length - 1 : 0;
        const element = collection[index];
        if (element) {
          changeHighlight(element);
        }
      }

      if (isVirtual.value) {
        virtualKeydownHook.trigger(event);
      }
    };

    const highlightFirstItem = () => {
      nextTick(() => {
        const event = new KeyboardEvent('keydown', { key: 'PageUp' });
        onKeydownNavigation(event);
      });
    };

    function handleMultipleReplace(event: KeyboardEvent, targetEl: HTMLElement) {
      if (isVirtual.value || selectionBehavior.value !== 'replace') return;
      if (!isMultiple.value || !Array.isArray(modelValue.value)) return;

      const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
      if (isMetaKey && !event.shiftKey) return;
      if (!event.shiftKey) return;

      const collection = getOrderedItems();
      let lastValue = collection.find(item => item.element === targetEl)?.data?.value;

      if (event.key === 'End') {
        lastValue = collection[collection.length - 1]?.data?.value;
      } else if (event.key === 'Home') {
        lastValue = collection[0]?.data?.value;
      }

      if (!lastValue || !firstValue.value) return;

      const values = findValuesBetween(
        collection.map(item => item.data.value),
        firstValue.value,
        lastValue
      );
      modelValue.value = values;
    }

    const highlightSelected = async (event?: Event) => {
      await nextTick();

      if (isVirtual.value) {
        // Trigger on nextTick for Virtualizer to be mounted
        virtualFocusHook.trigger(event);
      } else {
        const collection = getOrderedElements();
        const item = collection.find(i => i.dataset.state === 'checked');
        if (item) {
          changeHighlight(item);
        } else if (collection[0]) {
          changeHighlight(collection[0]);
        }
      }
    };

    const onFocusOut = async (event: FocusEvent) => {
      const target = (event.relatedTarget || event.target) as HTMLElement | null;

      await nextTick();

      if (!highlightedElement.value || rootElement.value?.contains(target)) return;

      onLeave(event);
    };

    return {
      ...params,
      rootElement,
      setRootElement,
      isUserAction,
      isVirtual,
      virtualFocusHook,
      virtualKeydownHook,
      virtualHighlightHook,
      firstValue,
      focusable,
      onModelValueChange,
      onLeave,
      onEnter,
      highlightedElement,
      changeHighlight,
      highlightItem,
      highlightSelected,
      highlightFirstItem,
      onKeydownEnter,
      onKeydownNavigation,
      onKeydownTypeahead,
      onCompositionStart,
      onCompositionEnd,
      onFocusOut,
      getItems: getOrderedItems
    };
  }
);

export const [provideListboxGroupContext, useListboxGroupContext] = useContext('ListboxGroup', () => {
  const id = `vean-listbox-group-${useId()}`;

  return {
    id
  };
});

export const [provideListboxItemContext, useListboxItemContext] = useContext(
  'ListboxItem',
  (params: ListboxItemContextParams) => params
);

export const [provideListboxUi, useListboxUi] = useUiContext<ListboxUiSlot>('ListboxUi', ui => {
  const inputUi = computed(() => ({
    root: ui.value?.filterRoot,
    control: ui.value?.filterControl
  }));

  provideInputUi(inputUi);

  return ui;
});
