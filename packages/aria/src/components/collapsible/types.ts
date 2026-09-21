import type { Ref } from 'vue';
import type { ForceMountProps, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the CollapsibleRoot component.
 */
export interface CollapsibleRootProps extends PrimitiveWithBaseProps {
  /**
   * The open state of the collapsible when it is initially rendered.
   *
   * Use when you do not need to control its open state.
   */
  defaultOpen?: boolean;
  /** The controlled open state of the collapsible. Can be bound with `v-model`. */
  open?: boolean;
  /** When `true`, prevents the user from interacting with the collapsible. */
  disabled?: boolean;
  /** When `true`, the element will be unmounted on closed state. */
  unmountOnHide?: boolean;
}

/**
 * Events for the CollapsibleRoot component.
 */
export type CollapsibleRootEmits = {
  /** Event handler called when the open state of the collapsible changes. */
  'update:open': [value: boolean];
};

/**
 * Properties for the CollapsibleContent component.
 */
export interface CollapsibleContentProps extends ForceMountProps, PrimitiveWithBaseProps {}

/**
 * Properties for the CollapsibleTrigger component.
 */
export interface CollapsibleTriggerProps extends ButtonProps {
  /** When `true`, prevents the user from toggling the collapsible. */
  disabledCollapsible?: boolean;
}

/**
 * Parameters used to create the CollapsibleRoot context.
 */
export interface CollapsibleRootContextParams extends ToContext<CollapsibleRootProps, 'disabled' | 'unmountOnHide'> {
  /**
   * Whether the component is open.
   */
  open: Ref<boolean | undefined>;
}

/**
 * Available UI slots for the Collapsible component.
 */
export type CollapsibleUiSlot = 'root' | 'trigger' | 'content';

/**
 * UI class overrides for the Collapsible component.
 */
export type CollapsibleUi = UiClass<CollapsibleUiSlot>;
