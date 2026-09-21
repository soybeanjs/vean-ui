import type { CollapsibleRootEmits, CollapsibleRootProps, CollapsibleUi } from '@vean/aria/collapsible';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Collapsible component.
 */
export interface CollapsibleProps extends CollapsibleRootProps {
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<CollapsibleUi>;
}

/**
 * Events for the Collapsible component.
 */
export type CollapsibleEmits = CollapsibleRootEmits;
