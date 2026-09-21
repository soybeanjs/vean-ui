import { onWatcherCleanup, toValue, watchPostEffect } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { INERT_MARKER_ATTR } from '../constants';
import { filterNullish, isClient, markOthers, supportsInert } from '../shared';
import type { MarkOthersOptions } from '../shared';
import type { MaybeArray } from '../types';

export interface UseHideOthersOptions extends MarkOthersOptions {
  /**
   * Keep a modal layer's own control channel instead of the modal default.
   * By default a modal layer hides with `inert` where supported (background
   * content leaves the accessibility tree and the tab order at once) and
   * falls back to `aria-hidden="true"` elsewhere; pass explicit
   * `inert` / `ariaHidden` values to override.
   */
  inert?: boolean;
  ariaHidden?: boolean;
}

/**
 * Hides everything outside `target` from assistive technology while the floating layer is
 * open, and restores it when the target changes, the component unmounts, or `enabled`
 * flips back to `false`. Non-modal layers pass `enabled: false` and become no-ops.
 *
 * Modality resolution: when `enabled` is on and neither `inert` nor `ariaHidden` is set
 * explicitly, `inert` wins where the runtime supports it (see `supportsInert`), falling
 * back to `aria-hidden="true"`.
 *
 * @param target - The floating element (or elements) that stays visible and announced.
 * @param enabled - Whether background hiding applies (supports reactive values).
 * @param options - Channel overrides on top of the modal default.
 */
export function useHideOthers(
  target: MaybeRefOrGetter<MaybeArray<HTMLElement | null | undefined>>,
  enabled: MaybeRefOrGetter<boolean | undefined> = true,
  options: UseHideOthersOptions = {}
) {
  watchPostEffect(() => {
    // Ensure we're in a browser environment
    if (!isClient) {
      return;
    }

    const targetValue = toValue(target);
    const elements = filterNullish(Array.isArray(targetValue) ? targetValue : [targetValue]);

    if (elements.length === 0) {
      return;
    }

    // The browser owns the visibility of native popover subtrees; writing our own control
    // attributes there trips the "Blocked aria-hidden on an element" warning.
    if (elements.some(element => element.closest('[popover]:not(:popover-open)'))) {
      return;
    }

    const isEnabled = toValue(enabled);
    // Early return if not enabled or in test mode
    if (!isEnabled || import.meta.env.MODE === 'test') {
      return;
    }

    const { inert, ariaHidden, ...markOptions } = options;
    const resolvedOptions: MarkOthersOptions = {
      ...markOptions,
      inert: inert ?? supportsInert(),
      ariaHidden: ariaHidden ?? !supportsInert()
    };

    const undo = markOthers(elements, resolvedOptions);

    onWatcherCleanup(() => {
      // Restore visibility when target changes, component unmounts, or enabled becomes false
      undo();
    });
  });
}

/** Whether the element currently carries the `markOthers` marker tag. Test-facing helper. */
export function isMarkedAsInert(element: Element): boolean {
  return element.hasAttribute(INERT_MARKER_ATTR);
}
