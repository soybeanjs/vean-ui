import { COLLECTION_ITEM_ATTRIBUTE } from '../constants';
import type { Direction } from '../types';

type ArrowKeyOptions = 'horizontal' | 'vertical' | 'both';

interface ArrowNavigationOptions {
  /**
   * The arrow key options to allow navigation
   *
   * @defaultValue 'both'
   */
  arrowKeyOptions?: ArrowKeyOptions;

  /**
   * The attribute name to find the collection items in the parent element.
   *
   * @defaultValue 'data-vean-collection-item'
   */
  attributeName?: string;

  /**
   * The parent element where contains all the collection items, this will collect every item to be used when nav It
   * will be ignored if attributeName is provided
   *
   * @defaultValue [ ]
   */
  itemsArray?: HTMLElement[];

  /**
   * Allow loop navigation. If false, it will stop at the first and last element
   *
   * @defaultValue true
   */
  loop?: boolean;

  /**
   * The orientation of the collection
   *
   * @defaultValue 'ltr'
   */
  dir?: Direction;

  /**
   * Prevent the scroll when navigating. This happens when the direction of the key matches the scroll direction of any
   * ancestor scrollable elements.
   *
   * @defaultValue true
   */
  preventScroll?: boolean;

  /**
   * By default all currentElement would trigger navigation. If `true`, currentElement nodeName in the ignore list will
   * return null
   *
   * @defaultValue false
   */
  enableIgnoredElement?: boolean;

  /**
   * Focus the element after navigation
   *
   * @defaultValue false
   */
  focus?: boolean;
}

interface ArrowNavigationConfig extends Required<ArrowNavigationOptions> {
  attributeName: string;
}

interface NavigationDirection {
  /** Whether the right arrow key was pressed */
  right: boolean;
  /** Whether the left arrow key was pressed */
  left: boolean;
  /** Whether the up arrow key was pressed */
  up: boolean;
  /** Whether the down arrow key was pressed */
  down: boolean;
  /** Whether the home key was pressed */
  home: boolean;
  /** Whether the end key was pressed */
  end: boolean;
  /** Whether any vertical navigation key was pressed */
  goingVertical: boolean;
  /** Whether any horizontal navigation key was pressed */
  goingHorizontal: boolean;
  /** Whether the navigation should go forward based on direction */
  goForward: boolean;
}

interface FindNextFocusableElementOptions {
  /** Whether to search forwards or backwards. */
  goForward: boolean;
  /**
   * Whether to allow looping the search. If false, it will stop at the first/last element.
   *
   * @default true
   */
  loop?: boolean;
}

// Use Set for O(1) lookup performance instead of array
const IGNORED_ELEMENTS = new Set(['INPUT', 'TEXTAREA']);

// Cache key mappings for better performance
const KEY_MAPPINGS = {
  ArrowRight: 'right',
  ArrowLeft: 'left',
  ArrowUp: 'up',
  ArrowDown: 'down',
  Home: 'home',
  End: 'end'
} as const;

/**
 * Allow arrow navigation for every html element with data-vean-collection-item tag
 *
 * @param e Keyboard event
 * @param currentElement Event initiator element or any element that wants to handle the navigation
 * @param parentElement Parent element where contains all the collection items, this will collect every item to be used
 *   when nav
 * @param options further options
 * @returns the navigated html element or null if none
 */
export function useArrowNavigation(
  e: KeyboardEvent,
  currentElement: HTMLElement,
  parentElement: HTMLElement | undefined,
  options: ArrowNavigationOptions = {}
): HTMLElement | null {
  const config: ArrowNavigationConfig = {
    attributeName: `[${COLLECTION_ITEM_ATTRIBUTE}]`,
    itemsArray: [],
    loop: true,
    dir: 'ltr' as Direction,
    preventScroll: true,
    focus: false,
    arrowKeyOptions: 'both' as ArrowKeyOptions,
    enableIgnoredElement: false,
    ...options
  };

  // Early return for ignored elements
  if (!currentElement || (config.enableIgnoredElement && IGNORED_ELEMENTS.has(currentElement.nodeName))) {
    return null;
  }

  const navigationInfo = getNavigationDirection(e, config.dir);

  if (shouldSkipNavigation(config.arrowKeyOptions, navigationInfo)) {
    return null;
  }

  return handleNavigation(e, currentElement, parentElement, config, navigationInfo);
}

/** Handle the actual navigation logic */
function handleNavigation(
  e: KeyboardEvent,
  currentElement: HTMLElement,
  parentElement: HTMLElement | undefined,
  config: ArrowNavigationConfig,
  navigationInfo: NavigationDirection
): HTMLElement | null {
  // Cache collection items to avoid repeated DOM queries
  const allCollectionItems: HTMLElement[] = parentElement
    ? Array.from(parentElement.querySelectorAll(config.attributeName))
    : config.itemsArray;

  if (allCollectionItems.length === 0) return null;

  if (config.preventScroll) {
    e.preventDefault();
  }

  const { home, end, goForward, goingHorizontal, goingVertical } = navigationInfo;

  let item: HTMLElement | null = null;

  if (goingHorizontal || goingVertical) {
    item = findNextFocusableElement(allCollectionItems, currentElement, {
      goForward,
      loop: config.loop
    });
  } else if (home) {
    item = allCollectionItems[0] || null;
  } else if (end) {
    item = allCollectionItems[allCollectionItems.length - 1] || null;
  }

  if (config.focus && item) {
    item.focus();
  }

  return item;
}

function getNavigationDirection(e: KeyboardEvent, dir: Direction): NavigationDirection {
  // Use cached key mapping for better performance
  const keyType = KEY_MAPPINGS[e.key as keyof typeof KEY_MAPPINGS];

  if (!keyType) {
    return {
      right: false,
      left: false,
      up: false,
      down: false,
      home: false,
      end: false,
      goingVertical: false,
      goingHorizontal: false,
      goForward: false
    };
  }

  const keys = {
    right: keyType === 'right',
    left: keyType === 'left',
    up: keyType === 'up',
    down: keyType === 'down',
    home: keyType === 'home',
    end: keyType === 'end'
  };

  const goingVertical = keys.up || keys.down;
  const goingHorizontal = keys.right || keys.left;
  const goForward = keys.down || (dir === 'ltr' ? keys.right : keys.left);

  return {
    ...keys,
    goingVertical,
    goingHorizontal,
    goForward
  };
}

function shouldSkipNavigation(arrowKeyOptions: ArrowKeyOptions, navigationInfo: NavigationDirection): boolean {
  const { goingVertical, goingHorizontal, home, end } = navigationInfo;

  // Allow home/end keys regardless of arrow key options
  if (home || end) {
    return false;
  }

  // No navigation keys pressed
  if (!goingVertical && !goingHorizontal) {
    return true;
  }

  // Check arrow key restrictions
  return (arrowKeyOptions === 'vertical' && goingHorizontal) || (arrowKeyOptions === 'horizontal' && goingVertical);
}

/**
 * Find the next focusable element to avoid disabled elements Uses iterative approach instead of recursion for better
 * performance
 *
 * @param elements Elements to navigate
 * @param currentElement Current active element
 * @param options Navigation options
 * @returns next focusable element
 */
function findNextFocusableElement(
  elements: HTMLElement[],
  currentElement: HTMLElement,
  options: FindNextFocusableElementOptions
): HTMLElement | null {
  const { goForward, loop = true } = options;
  const elementsLength = elements.length;

  if (elementsLength === 0) return null;

  const currentIndex = elements.indexOf(currentElement);

  // If current element is not in the list, start from beginning or end
  if (currentIndex === -1) {
    return (goForward ? elements[0] : elements[elementsLength - 1]) || null;
  }

  // Use iterative approach instead of recursion for better performance
  let attempts = 0;
  let index = currentIndex;

  while (attempts < elementsLength) {
    index = goForward ? index + 1 : index - 1;

    // Handle bounds
    if (!loop && (index < 0 || index >= elementsLength)) {
      return null;
    }

    // Wrap around if looping is enabled
    if (index < 0) {
      index = elementsLength - 1;
    } else if (index >= elementsLength) {
      index = 0;
    }

    const candidate = elements[index];
    if (candidate) {
      // Check if element is disabled more efficiently
      const disabled = candidate.getAttribute('disabled');
      const isDisabled = disabled !== null && disabled !== 'false';

      if (!isDisabled) {
        return candidate;
      }
    }

    attempts++;
  }

  return null;
}
