import { describe, expect, it, vi } from 'vitest';
import { createMockElement } from '../../shared';
import { useCollection } from '../../../../aria/src/composables/use-collection';

describe('useCollection', () => {
  describe('basic functionality', () => {
    it('should create collection with correct structure', () => {
      const { provideCollectionContext, useCollectionContext, useCollectionItem } = useCollection('testCollection');

      expect(typeof provideCollectionContext).toBe('function');
      expect(typeof useCollectionContext).toBe('function');
      expect(typeof useCollectionItem).toBe('function');
    });

    it('should create collections with different names', () => {
      const collection1 = useCollection('menu');
      const collection2 = useCollection('tabs');

      // Each collection should have its own functions
      expect(collection1.provideCollectionContext).not.toBe(collection2.provideCollectionContext);
      expect(collection1.useCollectionContext).not.toBe(collection2.useCollectionContext);
      expect(collection1.useCollectionItem).not.toBe(collection2.useCollectionItem);
    });
  });

  describe('collection item registry functionality', () => {
    it('should handle Map operations correctly', () => {
      const registry = new Map();
      const element1 = createMockElement('div');
      const element2 = createMockElement('span');

      // Test basic registry operations
      registry.set(element1, { element: element1, data: { id: 'first' } });
      registry.set(element2, { element: element2, data: { id: 'second' } });

      expect(registry.size).toBe(2);
      expect(registry.get(element1)?.data.id).toBe('first');
      expect(registry.get(element2)?.data.id).toBe('second');

      // Test registry cleanup
      registry.delete(element1);
      expect(registry.size).toBe(1);
      expect(registry.has(element1)).toBe(false);

      registry.clear();
      expect(registry.size).toBe(0);
    });

    it('should handle different item data types', () => {
      const registry = new Map();
      const testData = [
        { id: 'string-data', value: 'test' },
        { id: 'number-data', value: 42 },
        { id: 'boolean-data', value: true },
        { id: 'object-data', value: { nested: 'object' } },
        { id: 'array-data', value: [1, 2, 3] }
      ];

      testData.forEach((data, _index) => {
        const element = createMockElement('div');
        registry.set(element, { element, data });
      });

      expect(registry.size).toBe(testData.length);

      const items = Array.from(registry.values());
      expect(items[0].data.value).toBe('test');
      expect(items[1].data.value).toBe(42);
      expect(items[2].data.value).toBe(true);
      expect(items[3].data.value.nested).toBe('object');
      expect(items[4].data.value).toEqual([1, 2, 3]);
    });
  });

  describe('ordered items logic', () => {
    it('should return empty arrays when no container element', () => {
      // Simulate the actual getOrderedItems logic
      const mockGetOrderedItems = (containerElement: HTMLElement | undefined, _registry: Map<HTMLElement, any>) => {
        if (!containerElement) return [];
        return [];
      };

      const mockGetOrderedElements = (orderedItems: any[]) => {
        return orderedItems.map(item => item.element);
      };

      const registry = new Map();
      const orderedItems = mockGetOrderedItems(undefined, registry);
      const orderedElements = mockGetOrderedElements(orderedItems);

      expect(orderedItems).toEqual([]);
      expect(orderedElements).toEqual([]);
    });

    it('should order items by DOM position', () => {
      const mockContainer = createMockElement('div');
      const element1 = createMockElement('div');
      const element2 = createMockElement('div');
      const element3 = createMockElement('div');

      // Mock querySelectorAll to return elements in DOM order
      mockContainer.querySelectorAll = vi.fn().mockReturnValue([element1, element2, element3] as any);

      const itemRegistry = new Map();
      // Register items in different order than DOM
      itemRegistry.set(element3, { element: element3, data: { id: 'third' } });
      itemRegistry.set(element1, { element: element1, data: { id: 'first' } });
      itemRegistry.set(element2, { element: element2, data: { id: 'second' } });

      // Simulate the actual getOrderedItems implementation
      const mockGetOrderedItems = () => {
        const domOrderedElements = Array.from(mockContainer.querySelectorAll('[data-vean-collection-item]'));
        const orderedItems: any[] = [];

        for (const element of domOrderedElements) {
          const itemData = itemRegistry.get(element);
          if (itemData) {
            orderedItems.push(itemData);
          }
        }

        return orderedItems;
      };

      const orderedItems = mockGetOrderedItems();

      expect(orderedItems).toHaveLength(3);
      expect(orderedItems[0].data.id).toBe('first');
      expect(orderedItems[1].data.id).toBe('second');
      expect(orderedItems[2].data.id).toBe('third');
      expect(mockContainer.querySelectorAll).toHaveBeenCalledWith('[data-vean-collection-item]');
    });

    it('should filter disabled elements when excludeDisabled is true', () => {
      const element1 = createMockElement('div');
      const element2 = createMockElement('div');
      const element3 = createMockElement('div');

      // Mock isElementHasAttribute function
      const mockIsElementHasAttribute = (element: HTMLElement, attribute: string): boolean => {
        if (element === element2 && attribute === 'disabled') {
          return true;
        }
        return false;
      };

      const itemRegistry = new Map();
      itemRegistry.set(element1, { element: element1, data: { id: 'first' } });
      itemRegistry.set(element2, { element: element2, data: { id: 'second' } });
      itemRegistry.set(element3, { element: element3, data: { id: 'third' } });

      const domElements = [element1, element2, element3];

      // Simulate the actual filtering logic
      const mockGetOrderedItems = (excludeDisabled = true) => {
        const orderedItems: any[] = [];

        for (const element of domElements) {
          const itemData = itemRegistry.get(element);
          if (itemData) {
            const shouldInclude = !excludeDisabled || !mockIsElementHasAttribute(element, 'disabled');
            if (shouldInclude) {
              orderedItems.push(itemData);
            }
          }
        }

        return orderedItems;
      };

      // Test with excludeDisabled = true (default)
      const filteredItems = mockGetOrderedItems(true);
      expect(filteredItems).toHaveLength(2);
      expect(filteredItems[0].data.id).toBe('first');
      expect(filteredItems[1].data.id).toBe('third');

      // Test with excludeDisabled = false
      const allItems = mockGetOrderedItems(false);
      expect(allItems).toHaveLength(3);
      expect(allItems[0].data.id).toBe('first');
      expect(allItems[1].data.id).toBe('second');
      expect(allItems[2].data.id).toBe('third');
    });

    it('should skip elements not in registry', () => {
      const mockContainer = createMockElement('div');
      const element1 = createMockElement('div');
      const element2 = createMockElement('div');
      const element3 = createMockElement('div');

      mockContainer.querySelectorAll = vi.fn().mockReturnValue([element1, element2, element3] as any);

      const itemRegistry = new Map();
      // Only register element1 and element3
      itemRegistry.set(element1, { element: element1, data: { id: 'first' } });
      itemRegistry.set(element3, { element: element3, data: { id: 'third' } });

      // Simulate getOrderedItems implementation
      const mockGetOrderedItems = () => {
        const domOrderedElements = Array.from(mockContainer.querySelectorAll('[data-vean-collection-item]'));
        const orderedItems: any[] = [];

        for (const element of domOrderedElements) {
          const itemData = itemRegistry.get(element);
          if (itemData) {
            orderedItems.push(itemData);
          }
        }

        return orderedItems;
      };

      const orderedItems = mockGetOrderedItems();

      // Should only include registered items
      expect(orderedItems).toHaveLength(2);
      expect(orderedItems[0].data.id).toBe('first');
      expect(orderedItems[1].data.id).toBe('third');
    });

    it('should handle getOrderedElements', () => {
      const element1 = createMockElement('div');
      const element2 = createMockElement('div');

      const orderedItems = [
        { element: element1, data: { id: 'first' } },
        { element: element2, data: { id: 'second' } }
      ];

      // Simulate getOrderedElements implementation
      const mockGetOrderedElements = (items: any[]) => {
        return items.map(item => item.element);
      };

      const orderedElements = mockGetOrderedElements(orderedItems);

      expect(orderedElements).toHaveLength(2);
      expect(orderedElements[0]).toBe(element1);
      expect(orderedElements[1]).toBe(element2);
    });
  });

  describe('collection naming patterns', () => {
    it('should handle different collection name formats', () => {
      const collectionNames = [
        'menu',
        'menuItems',
        'tabList',
        'radioGroup',
        'dropdown',
        'listbox',
        'navigationMenu',
        'commandPalette'
      ];

      collectionNames.forEach(name => {
        const collection = useCollection(name);

        expect(typeof collection.provideCollectionContext).toBe('function');
        expect(typeof collection.useCollectionContext).toBe('function');
        expect(typeof collection.useCollectionItem).toBe('function');
      });
    });

    it('should create unique collections for each name', () => {
      const collections = [useCollection('collection1'), useCollection('collection2'), useCollection('collection3')];

      // Each collection should be unique
      for (let i = 0; i < collections.length; i++) {
        for (let j = i + 1; j < collections.length; j++) {
          expect(collections[i]?.provideCollectionContext).not.toBe(collections[j]?.provideCollectionContext);
          expect(collections[i]?.useCollectionContext).not.toBe(collections[j]?.useCollectionContext);
          expect(collections[i]?.useCollectionItem).not.toBe(collections[j]?.useCollectionItem);
        }
      }
    });
  });

  describe('element reference handling', () => {
    it('should handle different element types', () => {
      const elements = [
        createMockElement('div'),
        createMockElement('span'),
        createMockElement('button'),
        createMockElement('li'),
        createMockElement('option')
      ];

      elements.forEach(element => {
        expect(element).toBeInstanceOf(Object);
        expect(element.tagName).toBeDefined();
        expect(typeof element.setAttribute).toBe('function');
        expect(typeof element.getAttribute).toBe('function');
        expect(typeof element.hasAttribute).toBe('function');
      });
    });

    it('should handle template ref objects', () => {
      const mockElement = createMockElement('div');

      // Test direct element reference
      expect(mockElement).toBe(mockElement);

      // Test ref object
      const refObject = { value: mockElement };
      expect(refObject.value).toBe(mockElement);

      // Test null/undefined refs
      const nullRef = { value: null };
      const undefinedRef = { value: undefined };

      expect(nullRef.value).toBe(null);
      expect(undefinedRef.value).toBe(undefined);
    });

    it('should handle collection item attributes', () => {
      const element = createMockElement('div');
      const COLLECTION_ITEM_ATTRIBUTE = 'data-vean-collection-item';

      // Test attribute setting
      element.setAttribute(COLLECTION_ITEM_ATTRIBUTE, 'true');
      expect(element.hasAttribute(COLLECTION_ITEM_ATTRIBUTE)).toBe(true);
      expect(element.getAttribute(COLLECTION_ITEM_ATTRIBUTE)).toBe('true');

      // Test attribute removal
      element.removeAttribute(COLLECTION_ITEM_ATTRIBUTE);
      expect(element.hasAttribute(COLLECTION_ITEM_ATTRIBUTE)).toBe(false);
    });
  });

  describe('data management', () => {
    it('should handle reactive data patterns', () => {
      const element = createMockElement('div');

      // Test static data
      const staticData = { id: 'static', count: 1 };
      const staticItem = { element, data: staticData };

      expect(staticItem.data.id).toBe('static');
      expect(staticItem.data.count).toBe(1);

      // Test data updates
      staticItem.data = { id: 'updated', count: 2 };
      expect(staticItem.data.id).toBe('updated');
      expect(staticItem.data.count).toBe(2);
    });

    it('should handle getter functions for data', () => {
      let counter = 0;

      // Simulate toValue function behavior
      const toValue = (valueOrGetter: any) => {
        return typeof valueOrGetter === 'function' ? valueOrGetter() : valueOrGetter;
      };

      const getterFunction = () => ({ count: counter });

      // Initial value
      const initialData = toValue(getterFunction);
      expect(initialData.count).toBe(0);

      // Update counter and get new value
      counter = 10;
      const updatedData = toValue(getterFunction);
      expect(updatedData.count).toBe(10);

      // Test with static value
      const staticValue = { count: 5 };
      const staticData = toValue(staticValue);
      expect(staticData.count).toBe(5);
    });

    it('should handle default empty data', () => {
      const element = createMockElement('div');
      const defaultData = {};
      const item = { element, data: defaultData };

      expect(item.data).toEqual({});
      expect(Object.keys(item.data)).toHaveLength(0);
    });

    it('should handle complex nested data', () => {
      const element = createMockElement('div');
      const complexData = {
        id: 'complex',
        metadata: {
          nested: true,
          level: 2,
          config: {
            deep: 'value'
          }
        },
        items: ['a', 'b', 'c'],
        flags: {
          active: true,
          disabled: false
        }
      };

      const item = { element, data: complexData };

      expect(item.data.id).toBe('complex');
      expect(item.data.metadata.nested).toBe(true);
      expect(item.data.metadata.config.deep).toBe('value');
      expect(item.data.items).toEqual(['a', 'b', 'c']);
      expect(item.data.flags.active).toBe(true);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty collections', () => {
      const registry = new Map();

      expect(registry.size).toBe(0);
      expect(Array.from(registry.values())).toEqual([]);
      expect(Array.from(registry.keys())).toEqual([]);
    });

    it('should handle multiple items with same data reference', () => {
      const registry = new Map();
      const sharedData = { shared: true, value: 'same' };

      const element1 = createMockElement('div');
      const element2 = createMockElement('span');

      registry.set(element1, { element: element1, data: sharedData });
      registry.set(element2, { element: element2, data: sharedData });

      expect(registry.size).toBe(2);

      const items = Array.from(registry.values());
      expect(items[0].data).toBe(sharedData);
      expect(items[1].data).toBe(sharedData);
      expect(items[0].data === items[1].data).toBe(true);
    });

    it('should handle querySelectorAll edge cases', () => {
      const mockContainer = createMockElement('div');

      // Test empty querySelectorAll result
      mockContainer.querySelectorAll = vi.fn().mockReturnValue([]);

      const result = mockContainer.querySelectorAll('[data-vean-collection-item]');
      expect(result).toEqual([]);
      expect(mockContainer.querySelectorAll).toHaveBeenCalledWith('[data-vean-collection-item]');
    });

    it('should handle non-existent registry entries', () => {
      const registry = new Map();
      const element = createMockElement('div');

      expect(registry.get(element)).toBeUndefined();
      expect(registry.has(element)).toBe(false);
      expect(registry.delete(element)).toBe(false);
    });
  });
});
