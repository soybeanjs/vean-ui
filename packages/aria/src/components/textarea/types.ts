import type { ComputedRef, ShallowRef, TextareaHTMLAttributes } from 'vue';
import type { BaseProps, FormFieldCommonProps, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';

/**
 * Type information for TextareaAutosizeOptions.
 */
export interface TextareaAutosizeOptions {
  /** The minimum number of rows to display */
  minRows?: number;
  /** The maximum number of rows to display */
  maxRows?: number;
}

/**
 * Properties for the TextareaBase component.
 */
export interface TextareaBaseProps {
  /** Id of the textarea element */
  id?: string;
  /** When `true`, the textarea is auto-focused. */
  autofocus?: boolean;
  /** When `true`, prevents the user from interacting with the textarea. */
  disabled?: boolean;
  /** The maximum number of characters allowed in the textarea */
  maxlength?: number;
  /** The minimum number of characters allowed in the textarea */
  minlength?: number;
  /** The placeholder of the textarea */
  placeholder?: string;
  /** When `true`, the textarea is read-only. */
  readonly?: boolean;
}

/**
 * Properties for the TextareaRoot component.
 */
export interface TextareaRootProps extends TextareaBaseProps, FormFieldCommonProps, BaseProps {
  /** The default value of the textarea */
  defaultValue?: string;
  /** The controlled value of the textarea */
  modelValue?: string;
  /** When `true` or an options object, enables auto-resizing based on content */
  autosize?: boolean | TextareaAutosizeOptions;
}

/**
 * Events for the TextareaRoot component.
 */
export type TextareaRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
};

/**
 * Properties for the TextareaControl component.
 */
export interface TextareaControlProps extends BaseProps<TextareaHTMLAttributes> {}

/**
 * Properties for the TextareaClear component.
 */
export interface TextareaClearProps extends ButtonProps {}

/**
 * Events for the TextareaClear component.
 */
export type TextareaClearEmits = {
  /**
   * Emitted when the clear button is clicked.
   */
  clear: [event: PointerEvent];
};

/**
 * Properties for the TextareaCounter component.
 */
export interface TextareaCounterProps extends BaseProps {}

/**
 * Context for the TextareaRoot component.
 */
export interface TextareaRootContext extends ToContext<TextareaBaseProps & FormFieldCommonProps> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<string | undefined>;
  /**
   * Clear handler.
   */
  onClear: () => void;
  /**
   * Count used by the component context.
   */
  count: ComputedRef<number>;
  /**
   * Autosize options used by the component context.
   */
  autosizeOptions: ComputedRef<TextareaAutosizeOptions | undefined>;
}

/**
 * Available UI slots for the Textarea component.
 */
export type TextareaUiSlot = 'root' | 'control' | 'counter' | 'clear';

/**
 * UI class overrides for the Textarea component.
 */
export type TextareaUi = UiClass<TextareaUiSlot>;

/**
 * Slot properties for the TextareaCompact component.
 */
export interface TextareaCompactSlotProps {
  /**
   * Current model value.
   */
  modelValue?: string;
  /**
   * Clear handler.
   */
  clear: () => void;
  /**
   * Current character count.
   */
  count: number;
  /**
   * Current maxlength.
   */
  maxlength?: number;
}

/**
 * Properties for the TextareaCompact component.
 */
export interface TextareaCompactProps extends TextareaRootProps {
  /**
   * The function to set the textarea element.
   */
  textareaRef?: (el: HTMLTextAreaElement) => void;
  /**
   * Whether to show the clear trigger.
   *
   * @defaultValue false
   */
  clearable?: boolean;
  /**
   * Whether to show the counter.
   *
   * @defaultValue false
   */
  showCounter?: boolean;
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: TextareaControlProps;
  /**
   * Properties forwarded to the clear element.
   */
  clearProps?: TextareaClearProps;
  /**
   * Properties forwarded to the counter element.
   */
  counterProps?: TextareaCounterProps;
}

/**
 * Events for the TextareaCompact component.
 */
export type TextareaCompactEmits = TextareaRootEmits & TextareaClearEmits;

/**
 * Slots for the TextareaCompact component.
 */
export type TextareaCompactSlots = {
  /**
   * Custom content for the clear slot.
   */
  clear?: (props: TextareaCompactSlotProps) => any;
  /**
   * Custom content for the counter slot.
   */
  counter?: (props: TextareaCompactSlotProps) => any;
  /**
   * Custom content for the footer slot.
   */
  footer?: (props: TextareaCompactSlotProps) => any;
};
