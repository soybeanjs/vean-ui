import { describe, expect, it } from 'vitest';
import {
  focus,
  focusFirstAndSelect,
  getActiveElement,
  getCollectionItemElements,
  getDirectionAwareKey,
  getFocusIntent,
  getTabbableCandidates,
  getTabbableEdges,
  isElementHasAttribute,
  isHTMLElement,
  removeLinks,
  removeFromTabOrder,
  tryFocusFirst
} from '../../../src/shared';

function createContainer(): {
  container: HTMLElement;
  first: HTMLButtonElement;
  middle: HTMLInputElement;
  last: HTMLButtonElement;
} {
  const container = document.createElement('div');
  const first = document.createElement('button');
  const middle = document.createElement('input');
  const last = document.createElement('button');
  container.append(first, middle, last);
  document.body.append(container);
  return { container, first, middle, last };
}

describe('focus helpers', () => {
  it('getActiveElement returns the currently focused element', () => {
    const { first } = createContainer();
    first.focus();
    expect(getActiveElement()).toBe(first);
  });

  it('getTabbableCandidates returns tabbable elements in DOM order', () => {
    const { container, first, middle, last } = createContainer();
    expect(getTabbableCandidates(container)).toEqual([first, middle, last]);
  });

  it('getTabbableCandidates skips disabled and hidden inputs', () => {
    const { container, first, middle, last } = createContainer();
    const disabled = document.createElement('button');
    disabled.disabled = true;
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    const hidden = document.createElement('button');
    hidden.hidden = true;
    container.append(disabled, hiddenInput, hidden);

    expect(getTabbableCandidates(container)).toEqual([first, middle, last]);
  });

  it('getTabbableEdges returns the first and last visible tabbable elements', () => {
    const { container, first, last } = createContainer();
    expect(getTabbableEdges(container)).toEqual([first, last]);
  });

  it('focus moves focus and can select input text', () => {
    const { middle } = createContainer();
    middle.value = 'text';
    focus(middle, { select: true });
    expect(getActiveElement()).toBe(middle);
  });

  it('focusFirstAndSelect focuses the first candidate', () => {
    const { middle, last } = createContainer();
    focusFirstAndSelect([middle, last]);
    expect(getActiveElement()).toBe(middle);
  });

  it('tryFocusFirst returns whether focus moved', () => {
    const { first, middle } = createContainer();
    first.focus();
    expect(tryFocusFirst([first])).toBe(true);
    expect(tryFocusFirst([middle])).toBe(true);
    expect(getActiveElement()).toBe(middle);
  });

  it('removeFromTabOrder sets tabindex=-1 and restores it', () => {
    const { first } = createContainer();
    const restore = removeFromTabOrder([first]);
    expect(first.getAttribute('tabindex')).toBe('-1');
    restore();
    expect(first.getAttribute('tabindex')).toBe('');
  });
});

describe('keyboard navigation helpers', () => {
  it('getDirectionAwareKey swaps left/right in rtl', () => {
    expect(getDirectionAwareKey('ArrowLeft', 'rtl')).toBe('ArrowRight');
    expect(getDirectionAwareKey('ArrowRight', 'rtl')).toBe('ArrowLeft');
    expect(getDirectionAwareKey('ArrowLeft', 'ltr')).toBe('ArrowLeft');
    expect(getDirectionAwareKey('ArrowUp', 'rtl')).toBe('ArrowUp');
  });

  it('getFocusIntent maps arrow keys to focus intents', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    expect(getFocusIntent(event, 'horizontal', 'ltr')).toBe('next');
    expect(getFocusIntent(event, 'vertical', 'ltr')).toBeUndefined();
  });
});

describe('dom helpers', () => {
  it('isHTMLElement checks the node type', () => {
    expect(isHTMLElement(document.createElement('div'))).toBe(true);
    expect(isHTMLElement(document.createTextNode('x'))).toBe(false);
  });

  it('isElementHasAttribute checks both plain and data- prefixed attributes', () => {
    const element = document.createElement('div');
    expect(isElementHasAttribute(element, 'disabled')).toBe(false);
    element.setAttribute('data-disabled', '');
    expect(isElementHasAttribute(element, 'disabled')).toBe(true);
    element.setAttribute('data-disabled', 'false');
    expect(isElementHasAttribute(element, 'disabled')).toBe(false);
  });

  it('getCollectionItemElements collects elements with the collection attribute', () => {
    const container = document.createElement('div');
    const item = document.createElement('div');
    item.setAttribute('data-vean-collection-item', '');
    const other = document.createElement('div');
    container.append(item, other);

    expect(getCollectionItemElements(container)).toEqual([item]);
  });

  it('removeLinks filters out anchor elements', () => {
    const div = document.createElement('div');
    const anchor = document.createElement('a');
    expect(removeLinks([div, anchor])).toEqual([div]);
  });
});
