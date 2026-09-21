import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COLLECTION_ITEM_ATTRIBUTE } from '../../../../aria/src/constants';
import { createMockElement } from '../../shared';
import { useArrowNavigation } from '../../../../aria/src/composables/use-arrow-navigation';

describe('useArrowNavigation', () => {
  let currentElement: HTMLElement;
  let parentElement: HTMLElement;
  let collectionItems: HTMLElement[];

  // Helper function to create mock keyboard events
  const createKeyboardEvent = (key: string): KeyboardEvent =>
    ({
      key,
      preventDefault: vi.fn()
    }) as any;

  beforeEach(() => {
    // Create mock DOM structure
    parentElement = createMockElement('div');

    // Create collection items
    collectionItems = [
      createMockElement('button', { id: 'item-1' }),
      createMockElement('button', { id: 'item-2' }),
      createMockElement('button', { id: 'item-3' })
    ];

    // Add collection attribute to items
    collectionItems.forEach(item => {
      item.setAttribute(COLLECTION_ITEM_ATTRIBUTE, '');
    });

    currentElement = collectionItems[0]!;

    // Mock parentElement.querySelectorAll
    parentElement.querySelectorAll = vi.fn().mockReturnValue(collectionItems);
  });

  describe('basic navigation', () => {
    it('should navigate to next element with right arrow', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBe(collectionItems[1]);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to previous element with left arrow', () => {
      const mockEvent = createKeyboardEvent('ArrowLeft');
      currentElement = collectionItems[1]!; // Start from middle

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBe(collectionItems[0]);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to next element with down arrow', () => {
      const mockEvent = createKeyboardEvent('ArrowDown');

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBe(collectionItems[1]);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to previous element with up arrow', () => {
      const mockEvent = createKeyboardEvent('ArrowUp');
      currentElement = collectionItems[1]!; // Start from middle

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBe(collectionItems[0]);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to first element with Home key', () => {
      const mockEvent = createKeyboardEvent('Home');
      currentElement = collectionItems[2]!; // Start from last

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBe(collectionItems[0]);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to last element with End key', () => {
      const mockEvent = createKeyboardEvent('End');

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBe(collectionItems[2]);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('loop navigation', () => {
    it('should loop to first element when at end with loop enabled', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      currentElement = collectionItems[2]!; // Start from last

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        loop: true
      });

      expect(result).toBe(collectionItems[0]);
    });

    it('should not loop when at end with loop disabled', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      currentElement = collectionItems[2]!; // Start from last

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        loop: false
      });

      expect(result).toBeNull();
    });

    it('should loop to last element when at beginning with loop enabled', () => {
      const mockEvent = createKeyboardEvent('ArrowLeft');
      currentElement = collectionItems[0]!; // Start from first

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        loop: true
      });

      expect(result).toBe(collectionItems[2]);
    });

    it('should not loop when at beginning with loop disabled', () => {
      const mockEvent = createKeyboardEvent('ArrowLeft');
      currentElement = collectionItems[0]!; // Start from first

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        loop: false
      });

      expect(result).toBeNull();
    });
  });

  describe('direction support', () => {
    it('should respect RTL direction', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      // In RTL, right arrow should go backward
      const result = useArrowNavigation(mockEvent, collectionItems[1]!, parentElement, {
        dir: 'rtl'
      });

      expect(result).toBe(collectionItems[0]);
    });

    it('should respect LTR direction', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      // In LTR, right arrow should go forward
      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        dir: 'ltr'
      });

      expect(result).toBe(collectionItems[1]);
    });
  });

  describe('arrow key options', () => {
    it('should only allow horizontal navigation when set to horizontal', () => {
      const mockEvent = createKeyboardEvent('ArrowUp');

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        arrowKeyOptions: 'horizontal'
      });

      expect(result).toBeNull();
    });

    it('should only allow vertical navigation when set to vertical', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        arrowKeyOptions: 'vertical'
      });

      expect(result).toBeNull();
    });

    it('should allow both horizontal and vertical when set to both', () => {
      // Test horizontal
      const mockEventRight = createKeyboardEvent('ArrowRight');
      let result = useArrowNavigation(mockEventRight, currentElement, parentElement, {
        arrowKeyOptions: 'both'
      });
      expect(result).toBe(collectionItems[1]);

      // Test vertical
      const mockEventDown = createKeyboardEvent('ArrowDown');
      result = useArrowNavigation(mockEventDown, currentElement, parentElement, {
        arrowKeyOptions: 'both'
      });
      expect(result).toBe(collectionItems[1]);
    });

    it('should always allow Home/End keys regardless of arrowKeyOptions', () => {
      const mockEvent = createKeyboardEvent('Home');

      const result = useArrowNavigation(mockEvent, collectionItems[2]!, parentElement, {
        arrowKeyOptions: 'horizontal'
      });

      expect(result).toBe(collectionItems[0]);
    });
  });

  describe('disabled elements', () => {
    it('should skip disabled elements', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      // Disable the next element
      collectionItems[1]!.setAttribute('disabled', 'true');

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBe(collectionItems[2]);
    });

    it('should handle disabled="false" as enabled', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      // Set disabled="false" (should be treated as enabled)
      collectionItems[1]!.setAttribute('disabled', 'false');

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBe(collectionItems[1]);
    });

    it('should return null if all elements are disabled and loop is false', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      // Disable all remaining elements
      collectionItems.slice(1).forEach(item => {
        item.setAttribute('disabled', 'true');
      });

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        loop: false
      });

      expect(result).toBeNull();
    });
  });

  describe('focus management', () => {
    it('should focus element when focus option is true', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      const targetElement = collectionItems[1]!;
      targetElement.focus = vi.fn();

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        focus: true
      });

      expect(result).toBe(targetElement);
      expect(targetElement.focus).toHaveBeenCalled();
    });

    it('should not focus element when focus option is false', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      const targetElement = collectionItems[1]!;
      targetElement.focus = vi.fn();

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        focus: false
      });

      expect(result).toBe(targetElement);
      expect(targetElement.focus).not.toHaveBeenCalled();
    });
  });

  describe('ignored elements', () => {
    it('should return null for INPUT elements when enableIgnoredElement is true', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      const inputElement = createMockElement('input');
      Object.defineProperty(inputElement, 'nodeName', { value: 'INPUT' });

      const result = useArrowNavigation(mockEvent, inputElement, parentElement, {
        enableIgnoredElement: true
      });

      expect(result).toBeNull();
    });

    it('should return null for TEXTAREA elements when enableIgnoredElement is true', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      const textareaElement = createMockElement('textarea');
      Object.defineProperty(textareaElement, 'nodeName', { value: 'TEXTAREA' });

      const result = useArrowNavigation(mockEvent, textareaElement, parentElement, {
        enableIgnoredElement: true
      });

      expect(result).toBeNull();
    });

    it('should process INPUT elements when enableIgnoredElement is false', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      const inputElement = createMockElement('input');
      Object.defineProperty(inputElement, 'nodeName', { value: 'INPUT' });

      const result = useArrowNavigation(mockEvent, inputElement, parentElement, {
        enableIgnoredElement: false
      });

      expect(result).toBe(collectionItems[0]);
    });
  });

  describe('scroll prevention', () => {
    it('should prevent default when preventScroll is true', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      useArrowNavigation(mockEvent, currentElement, parentElement, {
        preventScroll: true
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default when preventScroll is false', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      useArrowNavigation(mockEvent, currentElement, parentElement, {
        preventScroll: false
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('custom items array', () => {
    it('should use itemsArray when parentElement is not provided', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      const result = useArrowNavigation(mockEvent, currentElement, undefined, {
        itemsArray: collectionItems
      });

      expect(result).toBe(collectionItems[1]);
    });

    it('should prefer parentElement over itemsArray when both are provided', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      const otherItems = [createMockElement('button', { id: 'other' })];

      const result = useArrowNavigation(mockEvent, currentElement, parentElement, {
        itemsArray: otherItems
      });

      expect(result).toBe(collectionItems[1]);
      expect(parentElement.querySelectorAll).toHaveBeenCalled();
    });
  });

  describe('custom attribute name', () => {
    it('should use custom attribute name for collection items', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      const customItems = [
        createMockElement('button', { id: 'custom-1' }),
        createMockElement('button', { id: 'custom-2' })
      ];

      parentElement.querySelectorAll = vi.fn().mockReturnValue(customItems);

      const result = useArrowNavigation(mockEvent, customItems[0]!, parentElement, {
        attributeName: '[data-custom-item]'
      });

      expect(parentElement.querySelectorAll).toHaveBeenCalledWith('[data-custom-item]');
      expect(result).toBe(customItems[1]);
    });
  });

  describe('edge cases', () => {
    it('should return null when no currentElement is provided', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');

      const result = useArrowNavigation(mockEvent, null as any, parentElement);

      expect(result).toBeNull();
    });

    it('should return null when no collection items exist', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      parentElement.querySelectorAll = vi.fn().mockReturnValue([]);

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBeNull();
    });

    it('should return null for unsupported keys', () => {
      const mockEvent = createKeyboardEvent('Tab');

      const result = useArrowNavigation(mockEvent, currentElement, parentElement);

      expect(result).toBeNull();
    });

    it('should handle currentElement not in collection', () => {
      const mockEvent = createKeyboardEvent('ArrowRight');
      const outsideElement = createMockElement('button', { id: 'outside' });

      const result = useArrowNavigation(mockEvent, outsideElement, parentElement);

      // Should start from first element when current element is not in collection
      expect(result).toBe(collectionItems[0]);
    });

    it('should handle navigation when going backwards and currentElement not in collection', () => {
      const mockEvent = createKeyboardEvent('ArrowLeft');
      const outsideElement = createMockElement('button', { id: 'outside' });

      const result = useArrowNavigation(mockEvent, outsideElement, parentElement);

      // Should start from last element when going backwards and current element is not in collection
      expect(result).toBe(collectionItems[2]);
    });
  });
});
