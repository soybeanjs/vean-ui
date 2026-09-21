import type { BaseProps } from '../../types';

/**
 * Properties for the Label component.
 */
export interface LabelProps extends BaseProps {
  /** The id of the element the label is associated with. */
  for?: string;
}
