import type { AcceptableValue } from './common';

export type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

export type SelectEvent<T> = CustomEvent<{ originalEvent: MouseEvent; value?: T }>;

export type TreeSelectEvent<T = AcceptableValue> = CustomEvent<{
  originalEvent: PointerEvent | KeyboardEvent;
  value?: T;
  isExpanded: boolean;
  isSelected: boolean;
}>;

export type TreeToggleEvent<T = AcceptableValue> = CustomEvent<{
  originalEvent: PointerEvent | KeyboardEvent;
  value?: T;
  isExpanded: boolean;
  isSelected: boolean;
}>;

export type SwipeEvent = Omit<
  CustomEvent<{ originalEvent: PointerEvent; delta: { x: number; y: number } }>,
  'currentTarget'
> & { currentTarget: EventTarget & HTMLElement };
