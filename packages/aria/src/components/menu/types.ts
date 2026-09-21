import type { ComputedRef, ShallowRef } from 'vue';
import type { RovingFocusGroupEmits, RovingFocusGroupOptions } from '../../composables';
import type {
  BaseProps,
  AcceptableBooleanValue,
  CheckedState,
  DefinedValue,
  Direction,
  DismissableLayerEmits,
  FocusScopeEmits,
  ForceMountProps,
  ToContext,
  TrapFocusProps,
  UiClass
} from '../../types';
import type { IconValue } from '../_icon/types';
import type { ButtonProps } from '../button/types';
import type { DialogRootEmits, DialogBaseProps } from '../dialog/types';
import type { KbdProps, KbdValue } from '../kbd/types';
import type { LinkBaseProps, LinkExtraProps } from '../link/types';
import type { PopperPopupProps, PopperPositionerProps } from '../popper/types';
import type { PortalProps as MenuPortalProps } from '../portal/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';
import type { SeparatorRootProps as MenuSeparatorProps } from '../separator/types';

// MenuRoot
/**
 * Properties for the MenuRoot component.
 */
export interface MenuRootProps extends DialogBaseProps {
  /**
   * The reading direction of the combobox when applicable.
   *
   * If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode.
   */
  dir?: Direction;
}
/**
 * Events for the MenuRoot component.
 */
export type MenuRootEmits = DialogRootEmits;

/**
 * Properties for the MenuPopup component.
 */
export interface MenuPopupProps extends PopperPopupProps {}

// MenuContentImpl
/**
 * Properties for the MenuContentImpl component.
 */
export interface MenuContentImplProps
  extends PopperPositionerProps, TrapFocusProps, Pick<RovingFocusGroupOptions, 'loop'> {
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: MenuPopupProps;
}
/**
 * Events for the MenuContentImpl component.
 */
export type MenuContentImplEmits = DismissableLayerEmits & FocusScopeEmits & Pick<RovingFocusGroupEmits, 'entryFocus'>;

// MenuContent
/**
 * Properties for the MenuContent component.
 */
export interface MenuContentProps
  extends PopperPositionerProps, ForceMountProps, Pick<RovingFocusGroupOptions, 'loop'> {
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: MenuPopupProps;
}
/**
 * Events for the MenuContent component.
 */
export type MenuContentEmits = MenuContentImplEmits;

/**
 * Properties for the MenuTrigger component.
 */
export interface MenuTriggerProps extends ButtonProps {}

// MenuSub
/**
 * Properties for the MenuSub component.
 */
export interface MenuSubProps extends Pick<MenuRootProps, 'open' | 'defaultOpen'> {}
/**
 * Events for the MenuSub component.
 */
export type MenuSubEmits = MenuRootEmits;

// MenuSubContent
/**
 * Properties for the MenuSubContent component.
 */
export interface MenuSubContentProps extends Omit<MenuContentProps, 'side' | 'align'> {}
/**
 * Events for the MenuSubContent component.
 */
export type MenuSubContentEmits = MenuContentEmits;

// MenuGroup
/**
 * Properties for the MenuGroup component.
 */
export interface MenuGroupProps extends Omit<PrimitiveWithBaseProps, 'dir' | 'onSelect'> {}

// MenuGroupLabel
/**
 * Properties for the MenuGroupLabel component.
 */
export interface MenuGroupLabelProps extends BaseProps {}

// MenuItemImpl
/**
 * Properties for the MenuItemImpl component.
 */
export interface MenuItemImplProps extends PrimitiveWithBaseProps {
  /** When `true`, prevents the user from interacting with the item. */
  disabled?: boolean;
  /**
   * Optional text used for typeahead purposes. By default the typeahead behavior will use the `.textContent` of the
   * item. <br> Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;
}

// MenuItem
/**
 * Properties for the MenuItem component.
 */
export interface MenuItemProps extends MenuItemImplProps {}
/**
 * Events for the MenuItem component.
 */
export type MenuItemEmits = {
  /**
   * Event handler called when the user selects an item (via mouse or keyboard). <br> Calling `event.preventDefault` in
   * this handler will prevent the menu from closing when selecting that item.
   */
  select: [event: Event];
};

// MenuCheckboxItem
/**
 * Properties for the MenuCheckboxItem component.
 */
export interface MenuCheckboxItemProps extends MenuItemImplProps {
  /** The controlled checked state of the item. Can be used as `v-model`. */
  modelValue?: CheckedState;
  /**
   * The value given as data when submitted with a `name`.
   *
   * @defaultValue on
   */
  value?: DefinedValue;
}
/**
 * Events for the MenuCheckboxItem component.
 */
export type MenuCheckboxItemEmits = MenuItemEmits & {
  /** Event handler called when the checked state of the item changes. */
  'update:modelValue': [value: CheckedState];
};

// MenuCheckboxGroup
/**
 * Properties for the MenuCheckboxGroup component.
 */
export interface MenuCheckboxGroupProps<T extends DefinedValue = DefinedValue> extends MenuGroupProps {
  /** The controlled value of the checkbox. Can be bound with v-model. */
  modelValue?: T[];
  /** The value of the checkbox when it is initially rendered. Use when you do not need to control its value. */
  defaultValue?: T[];
  /**
   * When `true`, prevents the user from interacting with the checkboxes
   *
   * @defaultValue false
   */
  disabled?: boolean;
}
/**
 * Events for the MenuCheckboxGroup component.
 */
export type MenuCheckboxGroupEmits<T extends DefinedValue = DefinedValue> = {
  /** Event handler called when the value of the checkbox group changes. */
  'update:modelValue': [value: T[]];
};

// MenuRadioItem
/**
 * Properties for the MenuRadioItem component.
 */
export interface MenuRadioItemProps extends MenuItemImplProps {
  /** The value given as data when submitted with a `name`. */
  value: NonNullable<AcceptableBooleanValue>;
}
/**
 * Events for the MenuRadioItem component.
 */
export type MenuRadioItemEmits = MenuItemEmits;

// MenuRadioGroup
/**
 * Properties for the MenuRadioGroup component.
 */
export interface MenuRadioGroupProps<T = AcceptableBooleanValue> extends MenuGroupProps {
  /** The controlled value of the radio item to check. Can be bound as `v-model`. */
  modelValue?: T | null;
  /**
   * The value of the radio item that should be checked when initially rendered. Use when you do not need to control the
   * state of the radio items.
   */
  defaultValue?: T;
  /** When `true`, prevents the user from interacting with radio items. */
  disabled?: boolean;
}
/**
 * Events for the MenuRadioGroup component.
 */
export type MenuRadioGroupEmits<T = AcceptableBooleanValue> = {
  /** Event handler called when the radio group value changes */
  'update:modelValue': [payload: Exclude<T, undefined> | null];
};

// MenuSubTrigger
/**
 * Properties for the MenuSubTrigger component.
 */
export interface MenuSubTriggerProps extends MenuItemImplProps {}

// MenuItemIndicator
/**
 * Properties for the MenuItemIndicator component.
 */
export interface MenuItemIndicatorProps extends ForceMountProps, PrimitiveWithBaseProps {}

/**
 * Type information for MenuCollectionItemData.
 */
export type MenuCollectionItemData = Pick<MenuItemImplProps, 'textValue'>;

/**
 * Option data for the Menu component.
 */
export interface MenuOptionData<T extends DefinedValue = DefinedValue>
  extends Pick<MenuItemProps, 'disabled' | 'textValue'>, LinkBaseProps {
  /** The label to display in the menu. */
  label: string;
  /** The value of the option. */
  value: T;
  /** Whether the option should render as a group label. */
  isGroupLabel?: boolean;
  /** The icon rendered before the label. */
  icon?: IconValue;
  /** Whether the option is hidden. */
  hidden?: boolean;
  /** Whether to show a separator after this option. */
  separator?: boolean;
  /** The shortcut rendered at the end of the option. */
  shortcut?: KbdValue | KbdValue[];
  /** The children of the option. */
  children?: MenuOptionData<T>[];
}

/**
 * Properties for the MenuShortcut component.
 */
export interface MenuShortcutProps extends Omit<KbdProps, 'value'> {}

/**
 * Properties for the MenuOptionCompact component.
 */
export interface MenuOptionCompactProps<T extends DefinedValue = DefinedValue> {
  /**
   * Current item data.
   */
  item: MenuOptionData<T>;
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: MenuItemProps;
  /**
   * Properties forwarded to the link element.
   */
  linkProps?: LinkExtraProps;
  /**
   * Properties forwarded to the group element.
   */
  groupProps?: MenuGroupProps;
  /**
   * Properties forwarded to the group label element.
   */
  groupLabelProps?: MenuGroupLabelProps;
  /**
   * Properties forwarded to the sub element.
   */
  subProps?: MenuSubProps;
  /**
   * Properties forwarded to the sub trigger element.
   */
  subTriggerProps?: MenuSubTriggerProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: MenuPortalProps;
  /**
   * Properties forwarded to the sub content element.
   */
  subContentProps?: MenuSubContentProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: MenuSeparatorProps;
  /**
   * Properties forwarded to the shortcut element.
   */
  shortcutProps?: MenuShortcutProps;
}

/**
 * Events for the MenuOptionCompactSelect component.
 */
export type MenuOptionCompactSelectEmits<T extends DefinedValue = DefinedValue> = {
  /**
   * Emitted when select occurs.
   */
  select: [item: MenuOptionData<T>, event: Event];
};

/**
 * Events for the MenuOptionCompact component.
 */
export type MenuOptionCompactEmits<T extends DefinedValue = DefinedValue> = MenuSubEmits &
  MenuSubContentEmits &
  MenuOptionCompactSelectEmits<T>;

/**
 * Slots for the MenuOptionCompact component.
 */
export type MenuOptionCompactSlots<T extends DefinedValue = DefinedValue> = {
  /**
   * Custom content for the item slot.
   */
  item?: (props: { item: MenuOptionData<T>; isTrigger?: boolean }) => any;
  /**
   * Custom content for the item leading slot.
   */
  'item-leading'?: (props: { item: MenuOptionData<T> }) => any;
  /**
   * Custom content for the item trailing slot.
   */
  'item-trailing'?: (props: { item: MenuOptionData<T> }) => any;
  /**
   * Custom content for the item trigger icon slot.
   */
  'item-trigger-icon'?: (props: { item: MenuOptionData<T> }) => any;
  /**
   * Custom content for the item link icon slot.
   */
  'item-link-icon'?: (props: { item: MenuOptionData<T> }) => any;
};

/**
 * Properties for the MenuOptionsCompact component.
 */
export interface MenuOptionsCompactProps<T extends DefinedValue = DefinedValue> extends Omit<
  MenuOptionCompactProps<T>,
  'item'
> {
  /**
   * Items rendered by the component.
   */
  items: MenuOptionData<T>[];
  /** The selected value of the menu. */
  selectedValue?: T;
}

/**
 * Events for the MenuOptionsCompact component.
 */
export type MenuOptionsCompactEmits<T extends DefinedValue = DefinedValue> = MenuOptionCompactEmits<T>;

/**
 * Slots for the MenuOptionsCompact component.
 */
export type MenuOptionsCompactSlots<T extends DefinedValue = DefinedValue> = MenuOptionCompactSlots<T>;

/**
 * Option data for the MenuCheckbox component.
 */
export interface MenuCheckboxOptionData<T extends DefinedValue = DefinedValue> extends Omit<
  MenuOptionData<T>,
  'children'
> {}

/**
 * Properties for the MenuCheckboxOptionsCompact component.
 */
export interface MenuCheckboxOptionsCompactProps<
  T extends DefinedValue = DefinedValue
> extends MenuCheckboxGroupProps<T> {
  /**
   * Items rendered by the component.
   */
  items: MenuCheckboxOptionData<T>[];
  /**
   * Properties forwarded to the group label element.
   */
  groupLabelProps?: MenuGroupLabelProps;
  /**
   * Properties forwarded to the checkbox item element.
   */
  checkboxItemProps?: MenuCheckboxItemProps;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: MenuItemIndicatorProps;
  /**
   * Properties forwarded to the shortcut element.
   */
  shortcutProps?: MenuShortcutProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: MenuSeparatorProps;
}

/**
 * Events for the MenuCheckboxOptionsCompactSelect component.
 */
export type MenuCheckboxOptionsCompactSelectEmits<T extends DefinedValue = DefinedValue> = {
  /**
   * Emitted when select occurs.
   */
  select: [item: MenuCheckboxOptionData<T>, event: Event];
};

/**
 * Events for the MenuCheckboxOptionsCompact component.
 */
export type MenuCheckboxOptionsCompactEmits<T extends DefinedValue = DefinedValue> = MenuCheckboxGroupEmits<T> &
  MenuCheckboxOptionsCompactSelectEmits<T>;

/**
 * Slots for the MenuCheckboxOptionsCompact component.
 */
export type MenuCheckboxOptionsCompactSlots<T extends DefinedValue = DefinedValue> = {
  /**
   * Custom content for the item slot.
   */
  item?: (props: MenuCheckboxOptionData<T>) => any;
  /**
   * Custom content for the item leading slot.
   */
  'item-leading'?: (props: MenuCheckboxOptionData<T>) => any;
  /**
   * Custom content for the item trailing slot.
   */
  'item-trailing'?: (props: MenuCheckboxOptionData<T>) => any;
  /**
   * Custom content for the item indicator icon slot.
   */
  'item-indicator-icon'?: (props: MenuCheckboxOptionData<T>) => any;
};

/**
 * Option data for the MenuRadio component.
 */
export interface MenuRadioOptionData<T extends AcceptableBooleanValue = AcceptableBooleanValue>
  extends Pick<MenuItemProps, 'disabled' | 'textValue'>, LinkBaseProps {
  /** The label to display in the menu. */
  label: string;
  /** The value of the option. */
  value: NonNullable<T>;
  /** Whether the option should render as a group label. */
  isGroupLabel?: boolean;
  /** The icon rendered before the label. */
  icon?: IconValue;
  /** Whether the option is hidden. */
  hidden?: boolean;
  /** Whether to show a separator after this option. */
  separator?: boolean;
  /** The shortcut rendered at the end of the option. */
  shortcut?: KbdValue | KbdValue[];
}

/**
 * Properties for the MenuRadioOptionsCompact component.
 */
export interface MenuRadioOptionsCompactProps<
  T extends AcceptableBooleanValue = AcceptableBooleanValue
> extends MenuRadioGroupProps<T> {
  /**
   * Items rendered by the component.
   */
  items: MenuRadioOptionData<T>[];
  /**
   * Properties forwarded to the group label element.
   */
  groupLabelProps?: MenuGroupLabelProps;
  /**
   * Properties forwarded to the radio item element.
   */
  radioItemProps?: MenuRadioItemProps;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: MenuItemIndicatorProps;
  /**
   * Properties forwarded to the shortcut element.
   */
  shortcutProps?: MenuShortcutProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: MenuSeparatorProps;
}

/**
 * Events for the MenuRadioOptionsCompactSelect component.
 */
export type MenuRadioOptionsCompactSelectEmits<T extends AcceptableBooleanValue = AcceptableBooleanValue> = {
  /**
   * Emitted when select occurs.
   */
  select: [item: MenuRadioOptionData<T>, event: Event];
};

/**
 * Events for the MenuRadioOptionsCompact component.
 */
export type MenuRadioOptionsCompactEmits<T extends AcceptableBooleanValue = AcceptableBooleanValue> =
  MenuRadioGroupEmits<T> & MenuRadioOptionsCompactSelectEmits<T>;

/**
 * Slots for the MenuRadioOptionsCompact component.
 */
export type MenuRadioOptionsCompactSlots<T extends AcceptableBooleanValue = AcceptableBooleanValue> = {
  /**
   * Custom content for the item slot.
   */
  item?: (props: MenuRadioOptionData<T>) => any;
  /**
   * Custom content for the item leading slot.
   */
  'item-leading'?: (props: MenuRadioOptionData<T>) => any;
  /**
   * Custom content for the item trailing slot.
   */
  'item-trailing'?: (props: MenuRadioOptionData<T>) => any;
  /**
   * Custom content for the item indicator icon slot.
   */
  'item-indicator-icon'?: (props: MenuRadioOptionData<T>) => any;
};

// Context
/**
 * Context for the MenuRoot component.
 */
export interface MenuRootContext extends ToContext<MenuRootProps, 'modal'> {
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Whether an using keyboard.
   */
  isUsingKeyboard: ComputedRef<boolean>;
  /**
   * Callback invoked when the close event fires.
   */
  onClose: () => void;
}
/**
 * Parameters used to create the Menu context.
 */
export interface MenuContextParams {
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Whether this context is the root.
   */
  isRoot?: boolean;
  /**
   * Whether the component is open.
   */
  open: ShallowRef<boolean | undefined>;
}
/**
 * Parameters used to create the MenuContent context.
 */
export interface MenuContentContextParams {
  /**
   * Popup element used by the component context.
   */
  popupElement: ShallowRef<HTMLElement | undefined>;
}

/**
 * Parameters used to create the MenuCheckboxGroup context.
 */
export interface MenuCheckboxGroupContextParams {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<DefinedValue[] | undefined>;
  /**
   * Whether the component is disabled.
   */
  disabled: ComputedRef<boolean>;
}
/**
 * Parameters used to create the MenuRadioGroup context.
 */
export interface MenuRadioGroupContextParams {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<AcceptableBooleanValue | null>;
  /**
   * Whether the component is disabled.
   */
  disabled: ComputedRef<boolean>;
}
/**
 * Context for the MenuItemIndicator component.
 */
export interface MenuItemIndicatorContext {
  /**
   * Current model value.
   */
  modelValue: ComputedRef<CheckedState | undefined>;
}

/**
 * Context for the MenuSubAttribute component.
 */
export interface MenuSubAttributeContext {
  /**
   * Sub trigger used by the component context.
   */
  subTrigger: ComputedRef<Record<string, any>>;
  /**
   * Sub content used by the component context.
   */
  subContent: ComputedRef<Record<string, any>>;
}

/**
 * Context for the MenuOptionsCompact component.
 */
export interface MenuOptionsCompactContext<T extends DefinedValue = DefinedValue> {
  /**
   * Selected value used by the component context.
   */
  selectedValue: ComputedRef<T | undefined>;
  /**
   * Selected paths tracked by the component context.
   */
  selectedPaths: ComputedRef<T[]>;
}

/**
 * Available UI slots for the Menu component.
 */
export type MenuUiSlot =
  | 'positioner'
  | 'popup'
  | 'arrow'
  | 'subPositioner'
  | 'subPopup'
  | 'subTrigger'
  | 'group'
  | 'groupLabel'
  | 'item'
  | 'itemIcon'
  | 'itemLink'
  | 'itemLinkIcon'
  | 'checkboxGroup'
  | 'checkboxItem'
  | 'radioGroup'
  | 'radioItem'
  | 'itemIndicator'
  | 'subTriggerIcon'
  | 'shortcut'
  | 'separator';

/**
 * UI class overrides for the Menu component.
 */
export type MenuUi = UiClass<MenuUiSlot>;
