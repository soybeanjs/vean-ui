import { onBeforeUnmount, onWatcherCleanup, ref, shallowRef, toValue, watchPostEffect } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { pascalCase, getCollectionItemElements, getElFromTemplateRef, isElementHasAttribute } from '../shared';
import type { VNodeRef } from '../types';
import { useContext } from './use-context';

export interface CollectionItemData<ItemData = Record<string, any>> {
  element: HTMLElement;
  data: ItemData;
}

/**
 * Create a collection composable for managing a group of related elements
 *
 * @param collectionName - The name of the collection (used for context naming)
 * @returns Collection management functions and hooks
 */
export function useCollection<ItemData = Record<string, any>>(collectionName: string) {
  const contextName = pascalCase(`${collectionName}Collection`);

  const [provideCollectionContext, useCollectionContext] = useContext(contextName, () => {
    const containerElement = shallowRef<HTMLElement>();

    const onContainerElementChange = (element: HTMLElement) => {
      containerElement.value = element;
    };

    const itemRegistry = ref(new Map()) as Ref<Map<HTMLElement, CollectionItemData<ItemData>>>;

    /**
     * Get collection items ordered by their DOM position
     *
     * @param excludeDisabled - Whether to exclude disabled items from the result
     * @returns Collection items ordered by DOM position
     */
    const getOrderedItems = (excludeDisabled = true): CollectionItemData<ItemData>[] => {
      if (!containerElement.value) return [];

      const domOrderedElements = getCollectionItemElements(containerElement.value);
      const orderedItems: CollectionItemData<ItemData>[] = [];

      // Iterate through DOM-ordered elements for optimal performance
      for (const element of domOrderedElements) {
        const itemData = itemRegistry.value.get(element);
        if (itemData) {
          const shouldInclude = !excludeDisabled || !isElementHasAttribute(element, 'disabled');
          if (shouldInclude) {
            orderedItems.push(itemData);
          }
        }
      }

      return orderedItems;
    };

    /**
     * Get collection elements ordered by their DOM position
     *
     * @param excludeDisabled - Whether to exclude disabled elements from the result
     * @returns Elements ordered by DOM position
     */
    const getOrderedElements = (excludeDisabled = true): HTMLElement[] =>
      getOrderedItems(excludeDisabled).map(item => item.element);

    // Clean up registry on component unmount
    onBeforeUnmount(() => {
      itemRegistry.value.clear();
    });

    return {
      containerElement,
      onContainerElementChange,
      itemRegistry,
      getOrderedItems,
      getOrderedElements
    };
  });

  /**
   * Hook for registering individual collection items
   *
   * @param itemData - Data to associate with this collection item
   * @returns Item element reference and properties for registration
   */
  const useCollectionItem = (itemData: MaybeRefOrGetter<ItemData> = {} as ItemData) => {
    const consumerName = pascalCase(`${collectionName}Item`);
    const { itemRegistry } = useCollectionContext(consumerName);

    const itemElement = shallowRef<HTMLElement>();

    const onItemElementChange = (element: HTMLElement) => {
      // Clean up previous registration if element changed
      if (itemElement.value && itemElement.value !== element) {
        itemRegistry.value.delete(itemElement.value);
      }

      itemElement.value = element;
    };

    /** Set the item element reference */
    const registerItemElement = (nodeRef: VNodeRef): void => {
      const element = getElFromTemplateRef(nodeRef);
      if (!element) return;

      onItemElementChange(element);
    };

    /** Handle item registration and data updates */
    watchPostEffect(() => {
      const element = itemElement.value;
      if (element) {
        // Register or update the item in the registry
        itemRegistry.value.set(element, {
          element,
          data: toValue(itemData)
        });
      }

      /** Unregister the item from the collection registry when watcher is cleaned up */
      onWatcherCleanup(() => {
        // Capture the element in a local variable instead of resetting
        // `itemElement` here: this cleanup runs synchronously during reactive
        // flushes (e.g. right after a function ref re-registers the item), and
        // writing the ref from within a render-triggered flush re-triggers the
        // pending render, causing a "Maximum recursive updates" loop.
        if (element) {
          itemRegistry.value.delete(element);
        }
      });
    });

    return {
      itemElement,
      onItemElementChange,
      setItemElement: registerItemElement
    };
  };

  return {
    provideCollectionContext,
    useCollectionContext,
    useCollectionItem
  };
}
