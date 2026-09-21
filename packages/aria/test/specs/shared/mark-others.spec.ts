import { afterEach, describe, expect, it } from 'vitest';
import { markOthers } from '../../../src/shared/mark-others';

function setup(): { target: HTMLElement; sibling: HTMLElement } {
  const target = document.createElement('div');
  const sibling = document.createElement('div');
  document.body.append(target, sibling);
  return { target, sibling };
}

function cleanup() {
  document.body.innerHTML = '';
}

afterEach(cleanup);

describe('markOthers', () => {
  it('marks outside elements by default (mark channel only)', () => {
    const { target, sibling } = setup();
    const undo = markOthers([target]);

    expect(sibling.hasAttribute('data-vean-inert')).toBe(true);
    expect(target.hasAttribute('data-vean-inert')).toBe(false);
    expect(sibling.hasAttribute('inert')).toBe(false);
    expect(sibling.getAttribute('aria-hidden')).toBe(null);

    undo();
    expect(sibling.hasAttribute('data-vean-inert')).toBe(false);
  });

  it('applies aria-hidden when requested', () => {
    const { target, sibling } = setup();
    const undo = markOthers([target], { ariaHidden: true, mark: false });

    expect(sibling.getAttribute('aria-hidden')).toBe('true');
    expect(target.getAttribute('aria-hidden')).toBe(null);

    undo();
    expect(sibling.getAttribute('aria-hidden')).toBe(null);
  });

  it('applies inert when requested and inert wins over ariaHidden', () => {
    const { target, sibling } = setup();
    const undo = markOthers([target], { inert: true, ariaHidden: true, mark: false });

    expect(sibling.hasAttribute('inert')).toBe(true);
    expect(sibling.getAttribute('aria-hidden')).toBe(null);

    undo();
    expect(sibling.hasAttribute('inert')).toBe(false);
  });

  it('keeps the ancestor chain and subtree of avoid elements visible', () => {
    const parent = document.createElement('div');
    const target = document.createElement('div');
    const child = document.createElement('span');
    const sibling = document.createElement('div');
    parent.append(target);
    target.append(child);
    document.body.append(parent, sibling);

    const undo = markOthers([target], { ariaHidden: true, mark: false });

    expect(parent.getAttribute('aria-hidden')).toBe(null);
    expect(child.getAttribute('aria-hidden')).toBe(null);
    expect(sibling.getAttribute('aria-hidden')).toBe('true');

    undo();
  });

  it('reference counts stacked layers and only restores on the last undo', () => {
    const { target, sibling } = setup();
    const undo1 = markOthers([target], { ariaHidden: true, mark: false });
    const undo2 = markOthers([target], { ariaHidden: true, mark: false });

    expect(sibling.getAttribute('aria-hidden')).toBe('true');

    undo1();
    expect(sibling.getAttribute('aria-hidden')).toBe('true');

    undo2();
    expect(sibling.getAttribute('aria-hidden')).toBe(null);
  });

  it('preserves pre-existing aria-hidden attributes on release', () => {
    const { target, sibling } = setup();
    sibling.setAttribute('aria-hidden', 'true');

    const undo = markOthers([target], { ariaHidden: true, mark: false });
    expect(sibling.getAttribute('aria-hidden')).toBe('true');

    undo();
    // Pre-existing (uncontrolled) attributes are preserved
    expect(sibling.getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps aria-live regions announced', () => {
    const target = document.createElement('div');
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    document.body.append(target, liveRegion);

    const undo = markOthers([target], { ariaHidden: true, mark: false });

    expect(liveRegion.getAttribute('aria-hidden')).toBe(null);

    undo();
  });

  it('skips script elements', () => {
    const target = document.createElement('div');
    const script = document.createElement('script');
    document.body.append(target, script);

    const undo = markOthers([target], { ariaHidden: true, mark: false });

    expect(script.hasAttribute('aria-hidden')).toBe(false);

    undo();
  });

  it('returns a no-op undo for empty avoid elements', () => {
    const undo = markOthers([]);
    expect(() => undo()).not.toThrow();
  });
});
