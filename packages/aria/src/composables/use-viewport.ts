import type { MaybeRefOrGetter } from 'vue';
import { useContext } from './use-context';

/**
 * Host-owned viewport decision, inherited by every responsive component in the
 * provider's subtree.
 *
 * A component that resolves responsive behaviour itself — today the layout
 * family's `isMobile` — treats this as the *environment*: an explicit prop still
 * wins, and `undefined` means "no opinion", which falls back to the real
 * `matchMedia` viewport.
 */
export interface ViewportContext {
  /** Whether the host considers the viewport mobile. */
  isMobile: MaybeRefOrGetter<boolean | undefined>;
}

/**
 * Provide/consume pair for the host viewport decision.
 *
 * Consumption is optional: a component outside a provider keeps following the
 * real viewport, so providers are additive rather than required.
 */
export const [provideViewportContext, useViewportContext] = useContext<ViewportContext>('Viewport');
