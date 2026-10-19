/**
 * The DOM events the adapters use to reach the code path being timed.
 *
 * `click()` and a real pointer sequence are not the same thing. Our select opens
 * on `pointerdown` (see `packages/aria/src/components/select/select-trigger.vue`,
 * `onPointerDown`), so a synthetic `click` never reaches the open path and the
 * benchmark would measure nothing. Which event each library listens for is a
 * per-adapter fact, not a shared one — Base UI, for example, opens on `click`
 * and ignores `pointerdown` — so these are helpers an adapter picks from, never
 * a fixed recipe.
 *
 * These events are untrusted: `isTrusted` is `false` and no pointer capture
 * actually happens. That is acceptable here because the gesture only exists to
 * reach the timed code. The contracts that depend on a trusted gesture — pointer
 * capture, `pointerType === 'touch'`, button filtering — are asserted with a real
 * driver in `packages/aria/test/browser/specs/`.
 */
const pointerInit = {
  bubbles: true,
  button: 0,
  cancelable: true,
  clientX: 4,
  clientY: 4,
  pointerId: 1,
  pointerType: 'mouse'
} as const;

export function clickElement(element: Element): void {
  (element as HTMLElement).click();
}

/**
 * `pointerdown` alone, which is what the select path in `aria`, `reka-ui` and
 * `bits-ui` listens for. Base UI is not in that group; see its adapter.
 */
export function pointerDown(element: Element): void {
  element.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
}

/** `Escape` on the document — how a user dismisses an open popup. */
export function pressEscape(): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }));
}
