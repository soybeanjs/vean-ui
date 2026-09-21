import { computed, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { mobileViewportQuery } from '../shared';
import { useViewportContext } from './use-viewport';

/**
 * The resolved mobile view of a responsive component.
 */
export interface UseIsMobileReturn {
  /**
   * The view to render: the host's decision when it has one, the real viewport
   * otherwise.
   */
  isMobile: ComputedRef<boolean>;
  /**
   * The host's own decision — the explicit value, else a viewport published
   * through `provideViewportContext`. `undefined` when the host has no opinion,
   * which is what tells a caller the media query decided.
   */
  hostIsMobile: ComputedRef<boolean | undefined>;
}

/**
 * Resolve whether the current view is the mobile one.
 *
 * Resolution order, strongest first: the explicit `isMobile` passed here, a
 * viewport published by a host through `provideViewportContext`, then the real
 * viewport. `undefined` at every level means "no opinion", so the shared
 * breakpoint decides.
 *
 * The layout family resolves its own `isMobile` this way; a component that has
 * to agree with it — a shell that rearranges itself around the layout's drawer —
 * resolves through here instead of repeating the chain, so the two can never
 * land on different widths.
 */
export function useIsMobile(isMobile?: MaybeRefOrGetter<boolean | undefined>): UseIsMobileReturn {
  const viewport = useViewportContext();

  const mediaIsMobile = useMediaQuery(mobileViewportQuery);

  const hostIsMobile = computed(() => toValue(isMobile) ?? toValue(viewport?.isMobile));

  const resolved = computed(() => hostIsMobile.value ?? mediaIsMobile.value);

  return {
    isMobile: resolved,
    hostIsMobile
  };
}
