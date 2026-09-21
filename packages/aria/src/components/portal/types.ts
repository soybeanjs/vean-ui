import type { ForceMountProps } from '../../types';

/**
 * Properties for the Portal component.
 */
export interface PortalProps extends ForceMountProps {
  /**
   * Vue native teleport component prop `:to`
   *
   * {@link https://vuejs.org/guide/built-ins/teleport.html#basic-usage}
   */
  to?: string | HTMLElement;
  /**
   * Disable teleport and render the component inline
   *
   * {@link https://vuejs.org/guide/built-ins/teleport.html#disabling-teleport}
   */
  disabled?: boolean;
  /**
   * Defer the resolving of a Teleport target until other parts of the application have mounted (requires Vue 3.5.0+)
   *
   * {@link https://vuejs.org/guide/built-ins/teleport.html#deferred-teleport}
   */
  defer?: boolean;
}
