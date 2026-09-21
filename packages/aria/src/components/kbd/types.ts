import type { BaseProps, KbdKey } from '../../types';

/**
 * Type information for KbdValue.
 */
export type KbdValue = KbdKey | (string & {});

/**
 * Properties for the Kbd component.
 */
export interface KbdProps extends BaseProps {
  /**
   * The value of the component.
   */
  value?: KbdValue | KbdValue[];
  /**
   * Whether to convert the command value to symbol representation.
   *
   * @defaultValue true
   */
  symbolize?: boolean;
}
