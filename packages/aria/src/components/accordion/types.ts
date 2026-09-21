import type { ComputedRef, ShallowRef } from 'vue';
import type {
  BaseProps,
  DataOrientation,
  Direction,
  MaybeArray,
  ToContext,
  SelectionEmits,
  SelectionProps,
  UiClass
} from '../../types';
import type { IconValue } from '../_icon/types';
import type { CollapsibleContentProps, CollapsibleTriggerProps, CollapsibleRootProps } from '../collapsible/types';

/**
 * Properties for the AccordionRoot component.
 */
export interface AccordionRootProps<M extends boolean = false> extends Omit<SelectionProps<M>, 'clearable'>, BaseProps {
  /**
   * When type is "single", allows closing content when clicking trigger for an open item.
   *
   * When type is "multiple", this prop has no effect.
   *
   * @defaultValue false
   */
  collapsible?: boolean;
  /**
   * The reading direction of the accordion when applicable. If omitted, assumes LTR (left-to-right) reading mode.
   *
   * @defaultValue 'ltr'
   */
  dir?: Direction;
  /**
   * When `true`, prevents the user from interacting with the accordion and all its items
   *
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * The orientation of the accordion.
   *
   * @defaultValue 'vertical'
   */
  orientation?: DataOrientation;
  /**
   * When `true`, the element will be unmounted on closed state.
   *
   * @defaultValue `true`
   */
  unmountOnHide?: boolean;
}

/**
 * Events for the AccordionRoot component.
 */
export type AccordionRootEmits<M extends boolean = false> = SelectionEmits<M>;

/**
 * Properties for the AccordionItem component.
 */
export interface AccordionItemProps extends Omit<CollapsibleRootProps, 'open' | 'defaultOpen' | 'onOpenChange'> {
  /** Value of the accordion item. All items within an accordion should use a unique value. */
  value: string;
}

/**
 * Properties for the AccordionHeader component.
 */
export interface AccordionHeaderProps extends BaseProps {}

/**
 * Properties for the AccordionTrigger component.
 */
export interface AccordionTriggerProps extends CollapsibleTriggerProps {}

/**
 * Properties for the AccordionContent component.
 */
export interface AccordionContentProps extends CollapsibleContentProps {}

/**
 * Properties for the AccordionDescription component.
 */
export interface AccordionDescriptionProps extends BaseProps {}

/**
 * Option data for the Accordion component.
 */
export interface AccordionOptionData extends Pick<AccordionItemProps, 'value' | 'disabled'> {
  /** The title of the accordion item. */
  title?: string;
  /** The description of the accordion content. */
  description?: string;
  /**
   * The icon of the accordion item.
   */
  icon?: IconValue;
}

/**
 * Properties for the AccordionCompact component.
 */
export interface AccordionCompactProps<
  T extends AccordionOptionData = AccordionOptionData,
  M extends boolean = false
> extends AccordionRootProps<M> {
  /**
   * Items rendered by the component.
   */
  items: T[];
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: AccordionItemProps;
  /**
   * Properties forwarded to the header element.
   */
  headerProps?: AccordionHeaderProps;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: AccordionTriggerProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: AccordionContentProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: AccordionDescriptionProps;
}

/**
 * Events for the AccordionCompact component.
 */
export type AccordionCompactEmits<M extends boolean = false> = AccordionRootEmits<M>;

/**
 * Slot properties for the AccordionCompact component.
 */
export interface AccordionCompactSlotProps<
  T extends AccordionOptionData = AccordionOptionData,
  M extends boolean = false
> {
  /**
   * Current item data.
   */
  item: T;
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Current model value.
   */
  modelValue: (M extends true ? string[] : string) | undefined;
  /**
   * Whether the component is open.
   */
  open: boolean;
}

/**
 * Slots for the AccordionCompact component.
 */
export type AccordionCompactSlots<T extends AccordionOptionData = AccordionOptionData, M extends boolean = false> = {
  /**
   * Custom content for the item slot.
   */
  item?: (props: AccordionCompactSlotProps<T, M>) => any;
  /**
   * Custom content for the leading slot.
   */
  leading?: (props: AccordionCompactSlotProps<T, M>) => any;
  /**
   * Custom content for the title slot.
   */
  title?: (props: AccordionCompactSlotProps<T, M>) => any;
  /**
   * Custom content for the trigger icon slot.
   */
  'trigger-icon'?: (props: AccordionCompactSlotProps<T, M>) => any;
  /**
   * Custom content for the content slot.
   */
  content?: (props: AccordionCompactSlotProps<T, M>) => any;
};

/**
 * Context for the AccordionRoot component.
 */
export interface AccordionRootContext extends ToContext<
  AccordionRootProps,
  'collapsible' | 'disabled' | 'orientation' | 'unmountOnHide'
> {
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Reference to the root element.
   */
  rootElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Current model value.
   */
  modelValue: ShallowRef<MaybeArray<string> | undefined>;
  /**
   * Whether multiple values are supported.
   */
  isMultiple: ComputedRef<boolean>;
  /**
   * Handler used to update the model value.
   */
  onModelValueChange: (value: string) => void;
}

/**
 * Parameters used to create the AccordionItem context.
 */
export interface AccordionItemContextParams extends ToContext<AccordionItemProps, 'value'> {
  /**
   * Whether the component is open.
   */
  open: ComputedRef<boolean>;
  /**
   * Whether the component is disabled.
   */
  disabled: ComputedRef<boolean>;
}

/**
 * Available UI slots for the Accordion component.
 */
export type AccordionUiSlot =
  | 'root'
  | 'item'
  | 'header'
  | 'trigger'
  | 'content'
  | 'description'
  | 'triggerLeadingIcon'
  | 'triggerIcon';

/**
 * UI class overrides for the Accordion component.
 */
export type AccordionUi = UiClass<AccordionUiSlot>;
