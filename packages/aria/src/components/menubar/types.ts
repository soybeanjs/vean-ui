import type { ComputedRef, ShallowRef } from 'vue';
import type { DefinedValue, Direction, Placement, ToContext, UiClass } from '../../types';
import type { IconValue } from '../_icon/types';
import type { ButtonProps } from '../button/types';
import type { LinkExtraProps } from '../link/types';
import type {
  MenuPopupProps,
  MenuPortalProps,
  MenuArrowProps,
  MenuContentEmits,
  MenuContentProps,
  MenuSubContentEmits,
  MenuSubContentProps,
  MenuSubTriggerProps,
  MenuOptionsCompactProps,
  MenuOptionsCompactEmits,
  MenuOptionsCompactSlots,
  MenuOptionData,
  MenuUiSlot
} from '../menu';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Supported menubar trigger values.
 */
export type MenubarTriggerType = 'click' | 'hover';

/**
 * Properties for the MenubarRoot component.
 */
export interface MenubarRootProps<T extends DefinedValue = DefinedValue> extends Omit<
  PrimitiveWithBaseProps,
  'onSelect'
> {
  /** The controlled value of the menu to open. Can be used as `v-model`. */
  modelValue?: T;
  /** The value of the menu that should be open when initially rendered. */
  defaultValue?: T;
  /** The reading direction of the menubar when applicable. */
  dir?: Direction;
  /** When `true`, keyboard navigation loops from last trigger to first and vice versa. */
  loop?: boolean;
  /**
   * The trigger type of the menubar.
   *
   * - `click`: The menu will be opened when the trigger is clicked (hovering
   *   an open menubar still switches between menus).
   * - `hover`: The menu will be opened when the trigger is hovered.
   *
   * @defaultValue 'click'
   */
  trigger?: MenubarTriggerType;
  /**
   * The duration from when the pointer enters the trigger until the menu gets
   * opened in hover mode.
   *
   * @defaultValue 150
   */
  delayDuration?: number;
  /**
   * How much time a user has to enter another trigger without incurring a
   * delay again.
   *
   * @defaultValue 300
   */
  skipDelayDuration?: number;
}

/**
 * Events for the MenubarRoot component.
 */
export type MenubarRootEmits<T extends DefinedValue = DefinedValue> = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: T];
};

/**
 * Properties for the MenubarMenu component.
 */
export interface MenubarMenuProps {
  /** A unique value that associates the trigger with the active root value when controlled. */
  value?: DefinedValue;
}

/**
 * Properties for the MenubarTrigger component.
 */
export interface MenubarTriggerProps extends ButtonProps {}

/**
 * Type information for MenubarCollectionItemData.
 */
export interface MenubarCollectionItemData {
  /**
   * Value associated with the current item.
   */
  value: DefinedValue;
}

/**
 * Events for the MenubarContent component.
 */
export type MenubarContentEmits = MenuContentEmits;
/**
 * Properties for the MenubarContent component.
 */
export interface MenubarContentProps extends MenuContentProps {}

/**
 * Properties for the MenubarSubTrigger component.
 */
export interface MenubarSubTriggerProps extends MenuSubTriggerProps {}

/**
 * Properties for the MenubarSubContent component.
 */
export interface MenubarSubContentProps extends MenuSubContentProps {}
/**
 * Events for the MenubarSubContent component.
 */
export type MenubarSubContentEmits = MenuSubContentEmits;

/**
 * Properties for the MenubarCompact component.
 */
export interface MenubarCompactProps<T extends DefinedValue = DefinedValue>
  extends MenubarRootProps<T>, MenuOptionsCompactProps<T> {
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Placement.
   */
  placement?: Placement;
  /**
   * Whether to show an arrow.
   */
  showArrow?: boolean;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: MenubarTriggerProps;
  /**
   * When `true`, if the menubar content is wider than its container, the
   * trailing items collapse into a trailing "more" menu so the content always
   * fits inside the container.
   */
  collapsible?: boolean;
  /**
   * Label of the trailing "more" trigger when `collapsible`.
   *
   * @defaultValue undefined
   */
  moreLabel?: string;
  /**
   * Icon of the trailing "more" trigger when `collapsible`.
   */
  moreIcon?: IconValue;
  /**
   * Properties forwarded to the trailing "more" trigger.
   */
  moreProps?: MenubarTriggerProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: MenuPortalProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: MenubarContentProps;
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
 * Events for the MenubarCompact component.
 */
export type MenubarCompactEmits<T extends DefinedValue = DefinedValue> = MenubarRootEmits<T> &
  MenuContentEmits &
  MenuOptionsCompactEmits<T>;
/**
 * Slots for the MenubarCompact component.
 */
export type MenubarCompactSlots<T extends DefinedValue = DefinedValue> = MenuOptionsCompactSlots<T> & {
  /**
   * Custom content for the trigger slot.
   *
   * Optional: `MenubarCompact` renders full default trigger content (icon,
   * label, link icon, trailing slot) when the consumer does not provide it.
   */
  trigger?: (data: { item: MenuOptionData<T> }) => any;
  /**
   * Custom content for the trailing "more" trigger when `collapsible`.
   */
  'more-trigger'?: () => any;
};

/**
 * Properties for the MenubarMenus component (the internal list renderer used
 * by `MenubarCompact`).
 */
export interface MenubarMenusProps<T extends DefinedValue = DefinedValue> {
  /**
   * Top-level items rendered as visible triggers.
   */
  items: MenuOptionData<T>[];
  /**
   * Items collapsed into the trailing "more" menu.
   */
  moreItems: MenuOptionData<T>[];
  /**
   * Props forwarded to the menubar root.
   */
  rootProps: Record<string, unknown>;
  /**
   * Listeners forwarded to the menubar root.
   */
  listeners: Record<string, unknown>;
  /**
   * Props forwarded to the menu options of each open menu.
   */
  optionsProps: Record<string, unknown>;
  /**
   * Props forwarded to link triggers.
   */
  linkProps?: LinkExtraProps;
  /**
   * Props forwarded to the content of each menu.
   */
  contentProps: MenubarContentProps;
  /**
   * Props forwarded to the portal of each menu.
   */
  portalProps?: MenuPortalProps;
  /**
   * Resolve the effective props of a top-level trigger item.
   */
  getTriggerProps: (item: MenuOptionData<T>) => MenubarTriggerProps;
  /**
   * Props forwarded to the trailing "more" trigger.
   */
  moreTriggerProps: Record<string, unknown>;
  /**
   * Label of the trailing "more" trigger.
   */
  moreLabel?: string;
  /**
   * Icon of the trailing "more" trigger.
   */
  moreIcon?: IconValue;
}

/**
 * Parameters used to create the MenubarRoot context.
 */
export interface MenubarRootContextParams extends ToContext<
  MenubarRootProps,
  'dir' | 'loop' | 'trigger' | 'delayDuration' | 'skipDelayDuration'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<DefinedValue>;
  /**
   * Current tab stop id used by the component context.
   */
  currentTabStopId: ShallowRef<string | null>;
}

/**
 * Parameters used to create the MenubarMenu context.
 */
export interface MenubarMenuContextParams {
  /**
   * Value associated with the current item.
   */
  value: ComputedRef<DefinedValue>;
  /**
   * Trigger id used by the component context.
   */
  triggerId: string;
  /**
   * Content id used by the component context.
   */
  contentId: ShallowRef<string>;
  /**
   * Trigger element used by the component context.
   */
  triggerElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Whether was keyboard trigger open.
   */
  wasKeyboardTriggerOpen: ShallowRef<boolean>;
  /**
   * Whether the component is open.
   */
  open: ComputedRef<boolean>;
}

/**
 * Available UI slots for the Menubar component.
 */
export type MenubarUiSlot = 'root' | 'trigger' | MenuUiSlot;
/**
 * UI class overrides for the Menubar component.
 */
export type MenubarUi = UiClass<MenubarUiSlot>;
