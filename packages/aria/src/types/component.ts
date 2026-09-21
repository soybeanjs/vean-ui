import type { FocusOutsideEvent, PointerDownOutsideEvent } from './event';

export interface ForceMountProps {
  /**
   * Used to force mounting when more control is needed.
   *
   * Useful when controlling animation with Vue animation libraries.
   */
  forceMount?: boolean;
}

export interface TrapFocusProps {
  /**
   * When `true`, focus cannot escape the content via keyboard, pointer, or a programmatic focus.
   *
   * @defaultValue false
   */
  trapFocus?: boolean;
}

export interface DismissableLayerProps {
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside the `DismissableLayer`. Users will
   * need to click twice on outside elements to interact with them: once to close the `DismissableLayer`, and again to
   * trigger the element.
   */
  disableOutsidePointerEvents?: boolean;
}

export type DismissableLayerEmits = {
  /** Event handler called when the escape key is down. Can be prevented. */
  escapeKeyDown: [event: KeyboardEvent];
  /** Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. */
  pointerDownOutside: [event: PointerDownOutsideEvent];
  /** Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. */
  focusOutside: [event: FocusOutsideEvent];
  /**
   * Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown`
   * event happens outside or focus moves outside of it. Can be prevented.
   */
  interactOutside: [event: PointerDownOutsideEvent | FocusOutsideEvent];
};

export type FocusScopeEmits = {
  /** Event handler called when auto-focusing on open. Can be prevented. */
  openAutoFocus: [event: Event];
  /** Event handler called when auto-focusing on close. Can be prevented. */
  closeAutoFocus: [event: Event];
};

export interface FormNameValueProps<T = unknown> {
  name: string;
  value: T;
}

export interface FormFieldCommonProps {
  /** The name of the field. Submitted with its owning form as part of a name/value pair. */
  name?: string;
  /** When `true`, indicates that the user must set the value before the owning form can be submitted. */
  required?: boolean;
}
