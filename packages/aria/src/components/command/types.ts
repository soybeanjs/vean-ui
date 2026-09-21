import type { UseFuseOptions } from '../../composables';
import type { BaseProps, UiClass } from '../../types';
import type { IconValue } from '../_icon/types';
import type { KbdProps, KbdValue } from '../kbd/types';
import type {
  ListboxContentProps as CommandListProps,
  ListboxGroupLabelProps as CommandGroupLabelProps,
  ListboxGroupProps as CommandGroupProps,
  ListboxItemEmits as CommandItemEmits,
  ListboxItemProps as CommandItemProps,
  ListboxFilterProps as CommandInputProps,
  ListboxRootEmits as CommandRootEmits,
  ListboxRootProps as CommandRootProps,
  ListboxUiSlot
} from '../listbox/types';
import type { SeparatorRootProps } from '../separator/types';

/**
 * Option data for the CommandSingle component.
 */
export interface CommandSingleOptionData extends Pick<CommandItemProps, 'value' | 'disabled'> {
  /**
   * Icon rendered by the component.
   */
  icon?: IconValue;
  /**
   * Label text rendered by the component.
   */
  label: string;
  /**
   * Secondary description text rendered under the label (also searchable by the built-in filter).
   */
  description?: string;
  /**
   * Whether separator.
   */
  separator?: boolean;
  /**
   * Shortcut.
   */
  shortcut?: KbdValue | KbdValue[];
}

/**
 * Option data for the CommandGroup component.
 */
export interface CommandGroupOptionData<T extends CommandSingleOptionData = CommandSingleOptionData> extends Pick<
  CommandSingleOptionData,
  'value' | 'label' | 'separator'
> {
  /**
   * Items rendered by the component.
   */
  items: T[];
}

/**
 * Option data for the Command component.
 */
export type CommandOptionData<T extends CommandSingleOptionData = CommandSingleOptionData> =
  | T
  | CommandGroupOptionData<T>;

/**
 * Properties for the CommandItemLabel component.
 */
export interface CommandItemLabelProps extends BaseProps {}

/**
 * Properties for the CommandItemContent component.
 */
export interface CommandItemContentProps extends BaseProps {}

/**
 * Properties for the CommandDescription component.
 */
export interface CommandDescriptionProps extends BaseProps {}

/**
 * Properties for the CommandShortcut component.
 */
export interface CommandShortcutProps extends Omit<KbdProps, 'value'> {}

/**
 * Properties for the CommandSeparator component.
 */
export interface CommandSeparatorProps extends SeparatorRootProps {}

/**
 * Option data for the CommandSearch component.
 */
export type CommandSearchOptionData<T extends CommandSingleOptionData = CommandSingleOptionData> = T & {
  /**
   * Group value.
   */
  groupValue?: string;
  /**
   * Group label.
   */
  groupLabel?: string;
  /**
   * Whether group separator.
   */
  groupSeparator?: boolean;
};

/**
 * Properties for the CommandEmpty component.
 */
export interface CommandEmptyProps extends BaseProps {}

/**
 * Available UI slots for the Command component.
 */
export type CommandUiSlot =
  | Extract<ListboxUiSlot, 'root' | 'item' | 'group' | 'groupLabel'>
  | 'list'
  | 'inputRoot'
  | 'inputControl'
  | 'inputIcon'
  | 'inputClearable'
  | 'itemLabel'
  | 'itemContent'
  | 'itemDescription'
  | 'shortcut'
  | 'separator'
  | 'empty';

/**
 * UI class overrides for the Command component.
 */
export type CommandUi = UiClass<CommandUiSlot>;

/**
 * Properties for the CommandCompact component.
 */
export interface CommandCompactProps<T extends CommandSingleOptionData = CommandSingleOptionData> extends Omit<
  CommandRootProps,
  'onSelect'
> {
  /**
   * Items rendered by the component.
   */
  items: CommandOptionData<T>[];
  /**
   * Placeholder.
   */
  placeholder?: string;
  /**
   * Search term.
   */
  searchTerm?: string;
  /**
   * Whether the items are already filtered and ranked by an external engine
   * (e.g. full-text content search). When true, the built-in fuzzy filter is
   * skipped and all `items` render as-is; `searchTerm` still syncs via
   * `update:searchTerm` so the caller can drive its own search.
   */
  externalFilter?: boolean;
  /**
   * Whether clearable.
   */
  clearable?: boolean;
  /**
   * Fuse options.
   */
  fuseOptions?: UseFuseOptions<CommandSearchOptionData<T>>;
  /**
   * Properties forwarded to the list element.
   */
  listProps?: CommandListProps;
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: CommandItemProps;
  /**
   * Properties forwarded to the item label element.
   */
  itemLabelProps?: CommandItemLabelProps;
  /**
   * Properties forwarded to the item content element (wraps label + description).
   */
  itemContentProps?: CommandItemContentProps;
  /**
   * Properties forwarded to the item description element.
   */
  itemDescriptionProps?: CommandDescriptionProps;
  /**
   * Properties forwarded to the group element.
   */
  groupProps?: CommandGroupProps;
  /**
   * Properties forwarded to the group label element.
   */
  groupLabelProps?: CommandGroupLabelProps;
  /**
   * Properties forwarded to the shortcut element.
   */
  shortcutProps?: CommandShortcutProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: CommandSeparatorProps;
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: CommandInputProps;
  /**
   * Properties forwarded to the empty element.
   */
  emptyProps?: CommandEmptyProps;
  /**
   * Empty label.
   */
  emptyLabel?: string;
}

/**
 * Events for the CommandSearchTerm component.
 */
export type CommandSearchTermEmits = {
  /**
   * Emitted when the search term value changes.
   */
  'update:searchTerm': [value: string];
};

/**
 * Events for the CommandCompact component.
 */
export type CommandCompactEmits = CommandRootEmits & CommandItemEmits & CommandSearchTermEmits;

/**
 * Slot properties for the CommandCompactInput component.
 */
export interface CommandCompactInputSlotProps {
  /**
   * Clear exposed in the slot scope.
   */
  clear: () => void;
}

/**
 * Slot properties for the CommandCompactItem component.
 */
export interface CommandCompactItemSlotProps<T extends CommandSingleOptionData = CommandSingleOptionData> {
  /**
   * Current item data.
   */
  item: T;
}

/**
 * Slots for the CommandCompact component.
 */
export type CommandCompactSlots<T extends CommandSingleOptionData = CommandSingleOptionData> = {
  /**
   * Custom content for the input leading slot.
   */
  'input-leading'?: (props: CommandCompactInputSlotProps) => any;
  /**
   * Custom content for the input trailing slot.
   */
  'input-trailing'?: (props: CommandCompactInputSlotProps) => any;
  /**
   * Custom content for the empty slot.
   */
  empty?: () => any;
  /**
   * Custom content for the item leading slot.
   */
  'item-leading'?: (props: CommandCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item trailing slot.
   */
  'item-trailing'?: (props: CommandCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item label slot.
   */
  'item-label'?: (props: CommandCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item description slot.
   */
  'item-description'?: (props: CommandCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the bottom slot.
   */
  bottom?: () => any;
};

export type {
  CommandRootProps,
  CommandRootEmits,
  CommandListProps,
  CommandInputProps,
  CommandGroupLabelProps,
  CommandGroupProps,
  CommandItemProps,
  CommandItemEmits
};
