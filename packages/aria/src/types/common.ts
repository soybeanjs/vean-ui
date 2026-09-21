export type PrimitiveType = null | undefined | string | number | boolean | symbol | bigint;

export type ClassValue = false | null | undefined | string | Record<string, any> | Array<ClassValue>;

export type UiClass<UiSlot extends string> = Record<UiSlot, ClassValue>;

export type DefinedValue = string | number;
export type DefinedWithBooleanValue = DefinedValue | boolean;
export type AcceptableValue = DefinedValue | null | undefined;
export type AcceptableBooleanValue = AcceptableValue | boolean;

export type MaybeArray<T> = T | Array<T>;
export type MaybePromise<T> = T | Promise<T>;

export type ArrayElement<T> = T extends (infer U)[] ? U : never;

export type DataOrientation = 'vertical' | 'horizontal';
export type Direction = 'ltr' | 'rtl';

export type DisclosureState = 'open' | 'closed';

export type FocusIntent = 'first' | 'last' | 'prev' | 'next';
export type CheckedState = boolean | 'indeterminate';

export type NavigationKey =
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'End'
  | 'Home'
  | 'PageDown'
  | 'PageUp';

export type KbdKey =
  | 'meta'
  | 'ctrl'
  | 'alt'
  | 'win'
  | 'command'
  | 'shift'
  | 'option'
  | 'enter'
  | 'delete'
  | 'backspace'
  | 'escape'
  | 'tab'
  | 'capslock'
  | 'arrowup'
  | 'arrowright'
  | 'arrowdown'
  | 'arrowleft'
  | 'pageup'
  | 'pagedown'
  | 'home'
  | 'end';

export type Side = 'top' | 'right' | 'bottom' | 'left';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Modality tier of a layered surface.
 *
 * - `true` — full modal: focus trap plus blocking of outside pointer events
 * - `'trap-focus'` — traps focus but keeps outside pointer events alive
 * - `false` — non-modal
 */
export type ModalityTier = boolean | 'trap-focus';

export type HorizontalSide = Extract<Side, 'left' | 'right'>;

export type Align = 'start' | 'center' | 'end';

export type AlignSide = Extract<Align, 'start' | 'end'>;

export type Placement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';

export interface Size {
  width: number;
  height: number;
}

export type Point = { x: number; y: number };

export type Polygon = Point[];

export interface GraceIntent {
  area: Polygon;
  side: HorizontalSide;
}

export type SelectionBehavior = 'toggle' | 'replace';

export interface SelectionProps<M extends boolean = false, N extends DefinedValue = string> {
  /**
   * The controlled value of the selected item(s).
   *
   * Use this when you need to control the state of the items. Can be bound with `v-model`
   */
  modelValue?: M extends true ? N[] : N;
  /**
   * The default value of the selected item(s).
   *
   * Use this when you need to set the initial state of the items.
   */
  defaultValue?: M extends true ? N[] : N;
  /**
   * Determines whether a "single" or "multiple" items can be selected at a time.
   *
   * This prop will overwrite the inferred type from `modelValue` and `defaultValue`.
   */
  multiple?: M;
  /**
   * Whether selected item can be cleared when `multiple` is false.
   */
  clearable?: boolean;
  /**
   * How multiple selection should behave in the collection.
   *
   * @defaultValue 'toggle'
   */
  selectionBehavior?: SelectionBehavior;
}

export type SelectionEmits<M extends boolean = false, N extends DefinedValue = string> = {
  'update:modelValue': [value: M extends true ? N[] : N];
};
