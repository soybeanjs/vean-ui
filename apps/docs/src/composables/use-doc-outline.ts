import { inject, provide, shallowRef } from 'vue';
import type { InjectionKey, ShallowRef } from 'vue';
import type { AnchorOptionData } from '@vean/aria/anchor';

const DOC_OUTLINE_KEY: InjectionKey<ShallowRef<AnchorOptionData[]>> = Symbol('doc-outline');

/**
 * Creates the per-render-tree outline state in the layout (provider side).
 *
 * State must NOT live in a module-level singleton: under SSR the module is
 * shared across requests, so a previous page's outline would leak into the
 * next render and produce hydration mismatches (children + class) on the
 * anchor aside.
 */
export function provideDocOutline() {
  const items = shallowRef<AnchorOptionData[]>([]);
  provide(DOC_OUTLINE_KEY, items);
  return items;
}

/** Outline state consumer (pages/doc-md write `items.value`; layout aside reads it). */
export function useDocOutline(): ShallowRef<AnchorOptionData[]> {
  return inject(DOC_OUTLINE_KEY, shallowRef<AnchorOptionData[]>([]));
}
