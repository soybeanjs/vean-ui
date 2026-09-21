import type { AcceptableBooleanValue, DefinedValue, ToContext } from '../../types';
import type {
  MenuContentEmits,
  MenuContentProps,
  MenuRootEmits,
  MenuRootProps,
  MenuTriggerProps,
  MenuPopupProps,
  MenuPortalProps,
  MenuArrowProps,
  MenuOptionsCompactProps,
  MenuOptionsCompactEmits,
  MenuOptionsCompactSlots,
  MenuCheckboxOptionsCompactProps,
  MenuCheckboxOptionsCompactEmits,
  MenuCheckboxOptionsCompactSlots,
  MenuRadioOptionsCompactProps,
  MenuRadioOptionsCompactEmits,
  MenuRadioOptionsCompactSlots
} from '../menu';

/**
 * Properties for the ContextMenuRoot component.
 */
export interface ContextMenuRootProps extends Omit<MenuRootProps, 'open' | 'defaultOpen'> {
  /**
   * The duration from when the trigger is pressed until the menu opens.
   *
   * @defaultValue 700
   */
  pressOpenDelay?: number;
}
/**
 * Events for the ContextMenuRoot component.
 */
export type ContextMenuRootEmits = MenuRootEmits;

/**
 * Properties for the ContextMenuContent component.
 */
export type ContextMenuContentProps = Omit<
  MenuContentProps,
  'side' | 'sideOffset' | 'align' | 'arrowPadding' | 'updatePositionStrategy'
>;
/**
 * Events for the ContextMenuContent component.
 */
export type ContextMenuContentEmits = MenuContentEmits;

/**
 * Parameters used to create the ContextMenuRoot context.
 */
export interface ContextMenuRootContextParams extends ToContext<ContextMenuRootProps, 'pressOpenDelay'> {}
/**
 * Properties for the ContextMenuTrigger component.
 */
export interface ContextMenuTriggerProps extends MenuTriggerProps {
  /**
   * The reference element for the context menu trigger.
   */
  reference?: HTMLElement | null;
}

/**
 * Properties for the ContextMenuWrapperCompact component.
 */
export interface ContextMenuWrapperCompactProps extends ContextMenuRootProps {
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Whether to show an arrow.
   */
  showArrow?: boolean;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: ContextMenuTriggerProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: MenuPortalProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: ContextMenuContentProps;
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: MenuPopupProps;
  /**
   * Properties forwarded to the arrow element.
   */
  arrowProps?: MenuArrowProps;
}

/**
 * Events for the ContextMenuWrapperCompact component.
 */
export type ContextMenuWrapperCompactEmits = MenuRootEmits & MenuContentEmits;

/**
 * Properties for the ContextMenuCompact component.
 */
export interface ContextMenuCompactProps<T extends DefinedValue = DefinedValue>
  extends ContextMenuWrapperCompactProps, MenuOptionsCompactProps<T> {}

/**
 * Events for the ContextMenuCompact component.
 */
export type ContextMenuCompactEmits<T extends DefinedValue = DefinedValue> = ContextMenuWrapperCompactEmits &
  MenuOptionsCompactEmits<T>;

/**
 * Slots for the ContextMenuCompact component.
 */
export type ContextMenuCompactSlots<T extends DefinedValue = DefinedValue> = MenuOptionsCompactSlots<T> & {
  /**
   * Custom content for the trigger slot.
   */
  trigger: () => any;
};

// Menu Checkbox
/**
 * Properties for the ContextMenuCheckboxCompact component.
 */
export interface ContextMenuCheckboxCompactProps<T extends DefinedValue = DefinedValue>
  extends ContextMenuWrapperCompactProps, MenuCheckboxOptionsCompactProps<T> {}

/**
 * Events for the ContextMenuCheckboxCompact component.
 */
export type ContextMenuCheckboxCompactEmits<T extends DefinedValue = DefinedValue> = ContextMenuWrapperCompactEmits &
  MenuCheckboxOptionsCompactEmits<T>;

/**
 * Slots for the ContextMenuCheckboxCompact component.
 */
export type ContextMenuCheckboxCompactSlots<T extends DefinedValue = DefinedValue> =
  MenuCheckboxOptionsCompactSlots<T> & {
    /**
     * Custom content for the trigger slot.
     */
    trigger: () => any;
  };

// Menu Radio
/**
 * Properties for the ContextMenuRadioCompact component.
 */
export interface ContextMenuRadioCompactProps<T extends AcceptableBooleanValue = AcceptableBooleanValue>
  extends ContextMenuWrapperCompactProps, MenuRadioOptionsCompactProps<T> {}

/**
 * Events for the ContextMenuRadioCompact component.
 */
export type ContextMenuRadioCompactEmits<T extends AcceptableBooleanValue = AcceptableBooleanValue> =
  ContextMenuWrapperCompactEmits & MenuRadioOptionsCompactEmits<T>;

/**
 * Slots for the ContextMenuRadioCompact component.
 */
export type ContextMenuRadioCompactSlots<T extends AcceptableBooleanValue = AcceptableBooleanValue> =
  MenuRadioOptionsCompactSlots<T> & {
    /**
     * Custom content for the trigger slot.
     */
    trigger: () => any;
  };
