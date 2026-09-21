import type {
  VirtualizerContentProps,
  VirtualizerDynamicContentProps,
  VirtualizerRootProps
} from '@vean/aria/virtualizer';

/**
 * Properties for the Virtualizer component.
 */
export interface VirtualizerProps<T extends Record<string, any>> extends VirtualizerRootProps<T> {
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: VirtualizerContentProps;
  /**
   * Properties forwarded to the dynamic content element.
   */
  dynamicContentProps?: VirtualizerDynamicContentProps;
}
