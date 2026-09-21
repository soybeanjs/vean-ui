import type { RouteLocationRaw } from 'vue-router';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the Link component.
 */
export interface LinkProps extends PrimitiveWithBaseProps {
  /**
   * Route Location the link should navigate to when clicked on.
   */
  to?: RouteLocationRaw;
  /**
   * Calls `router.replace` instead of `router.push`.
   */
  replace?: boolean;
  /**
   * The URL the link should navigate to when clicked on.
   */
  href?: string;
  /**
   * When `true`, the link is disabled.
   */
  disabled?: boolean;
  /**
   * Class to apply when the link is active
   */
  activeClass?: string;
  /**
   * Class to apply when the link is exact active
   */
  exactActiveClass?: string;
  /**
   * The class to apply to the link when it is inactive.
   */
  inactiveClass?: string;
  /**
   * A class to apply to links that have been prefetched.
   */
  prefetchedClass?: string;
  /**
   * Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases
   */
  external?: boolean;
  /**
   * Value passed to the attribute `aria-current` when the link is exact active.
   *
   * @defaultValue `'page'`
   */
  ariaCurrentValue?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
  /**
   * Pass the returned promise of `router.push()` to `document.startViewTransition()` if supported.
   */
  viewTransition?: boolean;
  /**
   * Where to display the linked URL, as the name for a browsing context.
   */
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null;
  /**
   * A rel attribute value to apply on the link. Defaults to "noopener noreferrer" for external links.
   *
   * @default 'noopener noreferrer'
   */
  rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | (string & {}) | null;
  /**
   * If set to true, no rel attribute will be added to the link
   */
  noRel?: boolean;
  /**
   * When enabled will prefetch middleware, layouts and payloads of links in the viewport.
   */
  prefetch?: boolean;
  /**
   * Allows controlling when to prefetch links. By default, prefetch is triggered only on visibility.
   */
  prefetchOn?:
    | 'visibility'
    | 'interaction'
    | Partial<{
        visibility: boolean;
        interaction: boolean;
      }>;
  /**
   * Escape hatch to disable `prefetch` attribute.
   */
  noPrefetch?: boolean;
  /**
   * An option to either add or remove trailing slashes in the `href` for this specific link.
   * Overrides the global `trailingSlash` option if provided.
   */
  trailingSlash?: 'append' | 'remove';
}

/**
 * Type information for LinkBasePropsKey.
 */
export type LinkBasePropsKey = Extract<keyof LinkProps, 'to' | 'href' | 'external' | 'target'>;

/**
 * Properties for the LinkBase component.
 */
export interface LinkBaseProps extends Pick<LinkProps, LinkBasePropsKey> {}

/**
 * Properties for the LinkExtra component.
 */
export interface LinkExtraProps extends Omit<LinkProps, LinkBasePropsKey> {}
