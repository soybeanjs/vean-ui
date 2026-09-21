import type { ButtonProps } from '../button/types';

/**
 * State values for ToggleState.
 */
export type ToggleState = 'on' | 'off';

/**
 * Properties for the Toggle component.
 */
export interface ToggleProps extends ButtonProps {
  /**
   * The pressed state of the toggle when it is initially rendered.
   */
  defaultValue?: boolean;
  /**
   * The controlled pressed state of the toggle. Can be bound with v-model.
   */
  modelValue?: boolean;
}

/**
 * Events for the Toggle component.
 */
export type ToggleEmits = {
  /**
   * Event handler called when the pressed state changes.
   */
  'update:modelValue': [value: boolean];
};
