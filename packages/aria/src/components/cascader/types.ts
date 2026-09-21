import type { ComputedRef, ShallowRef } from 'vue';
import type {
  BaseProps,
  DefinedValue,
  Direction,
  DismissableLayerProps,
  ForceMountProps,
  FormFieldCommonProps,
  PointerDownOutsideEvent,
  ToContext,
  UiClass
} from '../../types';
import type { PopperAnchorProps, PopperArrowProps, PopperPositioningPositionerProps } from '../popper/types';
import type { PortalProps } from '../portal/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/** Alias of the popper arrow props used by the cascader arrow part. */
export type CascaderArrowProps = PopperArrowProps;
/** Alias of the portal props used by the cascader portal part. */
export type CascaderPortalProps = PortalProps;

// ---------- Data model ----------

/**
 * Raw option data for the Cascader component.
 *
 * The fields `value`, `label`, `children` and `disabled` can be mapped to arbitrary keys
 * of the raw option via the `fieldKeys` prop.
 */
export interface CascaderOptionData<T extends DefinedValue = DefinedValue> {
  value?: T;
  label?: string;
  children?: CascaderOptionData<T>[] | true;
  disabled?: boolean;
  [key: string]: unknown;
}

/**
 * Field keys used to extract the `value`, `label`, `children` and `disabled` fields
 * from the raw option data.
 */
export interface CascaderFieldKeys {
  /** Key of the option value. @defaultValue 'value' */
  value?: string;
  /** Key of the option label. @defaultValue 'label' */
  label?: string;
  /** Key of the option children. A `true` value marks a lazy-loadable node. @defaultValue 'children' */
  children?: string;
  /** Key of the option disabled state. @defaultValue 'disabled' */
  disabled?: string;
}

/**
 * Internal node model of the Cascader component.
 *
 * Paths (`pathValues`, `pathLabels`) and `level` are cached while the tree is built so
 * that lookups at runtime are O(1).
 */
export interface CascaderNode<T extends DefinedValue = DefinedValue> {
  /** Stable unique id of the node. */
  uid: string;
  /** Value of the node. */
  value: T;
  /** Label of the node. */
  label: string;
  /** Whether the node is disabled. */
  disabled: boolean;
  /** The raw option data the node was built from. */
  raw: CascaderOptionData<T>;
  /**
   * Child nodes. `null` means the children have not been loaded yet
   * (lazy loading has been triggered but not resolved, or the node is marked loadable).
   */
  children: CascaderNode<T>[] | null;
  /** Whether the node is a leaf (no children). */
  isLeaf: boolean;
  /** Depth of the node, root nodes are `0`. */
  level: number;
  /** Values of the ancestors plus the node itself, root first. */
  pathValues: T[];
  /** Labels of the ancestors plus the node itself, root first. */
  pathLabels: string[];
  /** Whether the node is currently loading its children. */
  loading: boolean;
  /** Whether the children of the node have been loaded. */
  loaded: boolean;
  /** Parent node, `null` for root nodes. */
  parent: CascaderNode<T> | null;
  /** Whether the node is checked. */
  checked: boolean;
  /** Whether the node is in an indeterminate checked state. */
  indeterminate: boolean;
}

/** Loose value shape used internally for the Cascader model value. */
export type CascaderModelValue = DefinedValue | DefinedValue[] | DefinedValue[][] | undefined;

type SingleCascaderValue<T extends DefinedValue, P extends boolean> = P extends true ? T[] : T;
type MultipleCascaderValue<T extends DefinedValue, P extends boolean> = P extends true ? T[][] : T[];

/**
 * The value type of the Cascader component.
 *
 * - `M = false`: single selection. `P = false` -> `T`, `P = true` -> `T[]` (one path).
 * - `M = true`: multiple selection. `P = false` -> `T[]`, `P = true` -> `T[][]` (multiple paths).
 */
export type CascaderValue<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> = M extends true ? MultipleCascaderValue<T, P> : SingleCascaderValue<T, P>;

// CascaderRoot
/**
 * Properties for the CascaderRoot component.
 */
export interface CascaderRootProps<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> extends FormFieldCommonProps {
  /** The controlled value of the selected node(s). Can be bound with `v-model`. */
  modelValue?: CascaderValue<T, M, P>;
  /** The default value of the selected node(s). */
  defaultValue?: CascaderValue<T, M, P>;
  /** When `true`, multiple nodes can be selected. */
  multiple?: M;
  /**
   * When `true`, the model value is the full path array(s) instead of the node value(s).
   *
   * @defaultValue false
   */
  pathMode?: P;
  /** Options of the cascader. */
  options?: CascaderOptionData<T>[];
  /** Field keys used to extract the option fields. */
  fieldKeys?: CascaderFieldKeys;
  /** The controlled open state of the Cascader. Can be bound as `v-model:open`. */
  open?: boolean;
  /** The open state of the cascader when it is initially rendered. */
  defaultOpen?: boolean;
  /** When `true`, prevents the user from interacting with the Cascader. */
  disabled?: boolean;
  /** When `true`, the value can be cleared by the clear button. */
  clearable?: boolean;
  /**
   * The trigger to expand the children of a node.
   *
   * @defaultValue 'click'
   */
  expandTrigger?: 'click' | 'hover';
  /**
   * When `false`, only leaf nodes can be selected (single) or the parent-children check states
   * are linked (multiple). When `true`, any node can be selected independently.
   *
   * @defaultValue false
   */
  checkStrictly?: boolean;
  /**
   * The strategy used to collect and display checked nodes in multiple mode.
   *
   * - `child`: collect the leaves of the checked region.
   * - `parent`: collect the topmost checked nodes (fold fully-checked subtrees into parents).
   *
   * @defaultValue 'child'
   */
  showCheckedStrategy?: 'child' | 'parent';
  /** The separator used to join the path labels. @defaultValue ' / ' */
  separator?: string;
  /** When `true`, the trigger becomes a search input and the panel shows flat filtered results. */
  filterable?: boolean;
  /**
   * Custom filter function used in local filtering mode. The default performs a
   * case-insensitive `includes` match against every label of the path.
   */
  filter?: (pattern: string, option: CascaderOptionData<T>, path: string[]) => boolean;
  /** When `true`, the panel loads its options from `onSearch` instead of filtering locally. */
  remote?: boolean;
  /** Async search function used in remote mode. Returns the flat options for the keyword. */
  onSearch?: (pattern: string) => Promise<CascaderOptionData<T>[]>;
  /** Debounce delay in milliseconds for filtering and remote search. @defaultValue 300 */
  searchDelay?: number;
  /** When `true`, children of a node are loaded asynchronously via `onLoad`. */
  lazy?: boolean;
  /** Async function used to load the children of a node when `lazy` is `true`. */
  onLoad?: (option: CascaderNode<T>) => Promise<CascaderOptionData<T>[]>;
  /** When `true`, only the visible rows of each column are rendered. */
  virtualScroll?: boolean;
  /** The fixed height of a row used by virtual scrolling. @defaultValue 34 */
  itemSize?: number;
  /** The height of the panel used by virtual scrolling. @defaultValue 204 */
  height?: number;
  /** The reading direction of the component. */
  dir?: Direction;
  /** The content shown when no node is selected. */
  placeholder?: string;
}

/**
 * Events for the CascaderRoot component.
 */
export type CascaderRootEmits<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> = {
  /** Event handler called when the value of the cascader changes. Can be bound as `v-model`. */
  'update:modelValue': [value: CascaderValue<T, M, P>];
  /** Event handler called when the open state of the cascader changes. Can be bound as `v-model:open`. */
  'update:open': [value: boolean];
  /** Event handler called when the value changes, with the selected nodes. */
  change: [value: CascaderValue<T, M, P> | undefined, nodes: CascaderNode<T>[]];
  /** Event handler called when the selection is cleared. */
  clear: [];
  /** Event handler called when the children of a node have been loaded (lazy mode). */
  loaded: [node: CascaderNode<T>];
};

// CascaderTrigger
/**
 * Properties for the CascaderTrigger component.
 */
export interface CascaderTriggerProps extends PopperAnchorProps {
  /** When `true`, prevents the user from interacting with the trigger. */
  disabled?: boolean;
}

// CascaderValue
/**
 * Properties for the CascaderValue component.
 */
export interface CascaderValueProps extends BaseProps {
  /** The content shown when no node is selected. */
  placeholder?: string;
}

// CascaderSearchInput
/**
 * Properties for the CascaderSearchInput component.
 */
export interface CascaderSearchInputProps extends BaseProps {}

// CascaderContent
/**
 * Properties for the CascaderContent component.
 */
export interface CascaderContentProps extends PopperPositioningPositionerProps, DismissableLayerProps, ForceMountProps {
  /** Properties forwarded to every menu part. */
  menuProps?: CascaderMenuProps;
  /** Properties forwarded to the empty part. */
  emptyProps?: CascaderEmptyProps;
}

/**
 * Events for the CascaderContent component.
 */
export type CascaderContentEmits = {
  /** Emitted when close auto focus occurs. */
  closeAutoFocus: [event: Event];
  /** Event handler called when the escape key is down. Can be prevented. */
  escapeKeyDown: [event: KeyboardEvent];
  /** Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. */
  pointerDownOutside: [event: PointerDownOutsideEvent];
  /** Emitted when the content is placed. */
  placed: [];
};

// CascaderMenu
/**
 * Properties for the CascaderMenu component.
 */
export interface CascaderMenuProps extends BaseProps {
  /** The depth of the menu column. */
  level?: number;
  /** Properties forwarded to every option part. */
  optionProps?: Partial<CascaderOptionProps<DefinedValue>>;
}

// CascaderOption
/**
 * Type information for the Cascader select event.
 */
export type CascaderSelectEvent<T extends DefinedValue = DefinedValue> = CustomEvent<{
  /** Original event. */
  originalEvent: PointerEvent | KeyboardEvent;
  /** The node being selected. */
  node: CascaderNode<T>;
}>;

/**
 * Type information for the Cascader expand event.
 */
export type CascaderExpandEvent<T extends DefinedValue = DefinedValue> = CustomEvent<{
  /** Original event. */
  originalEvent: PointerEvent | KeyboardEvent;
  /** The node being expanded. */
  node: CascaderNode<T>;
}>;

/**
 * Properties for the CascaderOption component.
 */
export interface CascaderOptionProps<T extends DefinedValue = DefinedValue> extends Omit<
  PrimitiveWithBaseProps,
  'onSelect'
> {
  /** The node rendered by the option. */
  node: CascaderNode<T>;
  /** The position of the node inside its column. */
  index?: number;
  /** The depth of the column the option belongs to. */
  level?: number;
}

/**
 * Events for the CascaderOption component.
 */
export type CascaderOptionEmits<T extends DefinedValue = DefinedValue> = {
  /** Event handler called when the node is selected. Can be prevented by calling `event.preventDefault`. */
  select: [event: CascaderSelectEvent<T>];
  /** Event handler called when the node is expanded. Can be prevented by calling `event.preventDefault`. */
  expand: [event: CascaderExpandEvent<T>];
};

// CascaderEmpty
/**
 * Properties for the CascaderEmpty component.
 */
export interface CascaderEmptyProps extends BaseProps {}

// CascaderTags
/**
 * Properties for the CascaderTags component.
 */
export interface CascaderTagsProps extends BaseProps {}

/**
 * Slots for the CascaderTags component.
 */
export type CascaderTagsSlots<T extends DefinedValue = DefinedValue> = {
  /** Custom content for a single tag in multiple mode. */
  tag?: (props: CascaderCompactTagSlotProps<T>) => any;
  /** Custom content shown when there is no selection. */
  value?: () => any;
};

// CascaderClear
/**
 * Properties for the CascaderClear component.
 */
export interface CascaderClearProps extends BaseProps {
  /** The accessible label of the clear button. @defaultValue '清除' */
  ariaLabel?: string;
}

// CascaderCompact
/**
 * Properties for the CascaderCompact component.
 */
export interface CascaderCompactProps<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> extends CascaderRootProps<T, M, P> {
  /** When `true`, the arrow icon is rendered. @defaultValue true */
  showArrow?: boolean;
  /** The placement of the content. */
  placement?: CascaderContentProps['placement'];
  /** Properties forwarded to the trigger part. */
  triggerProps?: CascaderTriggerProps;
  /** Properties forwarded to the value part. */
  valueProps?: CascaderValueProps;
  /** Properties forwarded to the search input part. */
  searchInputProps?: CascaderSearchInputProps;
  /** Properties forwarded to the portal part. */
  portalProps?: PortalProps;
  /** Properties forwarded to the content part. */
  contentProps?: CascaderContentProps;
  /** Properties forwarded to every menu part. */
  menuProps?: CascaderMenuProps;
  /** Properties forwarded to every option part. */
  optionProps?: Partial<CascaderOptionProps<T>>;
  /** Properties forwarded to the empty part. */
  emptyProps?: CascaderEmptyProps;
  /** The text shown in the empty state. @defaultValue The locale message */
  emptyLabel?: string;
  /** The accessible label of the clear button. @defaultValue The locale message */
  clearLabel?: string;
  /** Properties forwarded to the arrow part. */
  arrowProps?: CascaderArrowProps;
}

/**
 * Events for the CascaderCompact component.
 */
export type CascaderCompactEmits<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> = CascaderRootEmits<T, M, P> & CascaderContentEmits;

/**
 * Slot properties for the CascaderCompact trigger value.
 */
export interface CascaderCompactTriggerValueSlotProps<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> {
  /** Current model value. */
  modelValue: CascaderValue<T, M, P>;
  /** Labels of the selected nodes. */
  selectedLabels: string[];
  /** Text shown in the trigger (selected path or placeholder). */
  slotText: string;
}

/**
 * Slot properties for the CascaderCompact option.
 */
export interface CascaderCompactOptionSlotProps<T extends DefinedValue = DefinedValue> {
  /** The node being rendered. */
  node: CascaderNode<T>;
  /** Whether the node is checked. */
  checked: boolean;
  /** Whether the node is in an indeterminate state. */
  indeterminate: boolean;
  /** Whether the node is the currently selected node (single-select). */
  selected: boolean;
  /** Whether the node is currently highlighted. */
  highlighted: boolean;
  /** Whether a descendant of the node is currently selected (breadcrumb emphasis). */
  childSelected: boolean;
  /** Whether the node is currently loading its children. */
  loading: boolean;
  /** Expands the children column of the node without toggling its selection. */
  expand: () => void;
}

/**
 * Slot properties for the CascaderCompact tag.
 */
export interface CascaderCompactTagSlotProps<T extends DefinedValue = DefinedValue> {
  /** The node of the tag. */
  node: CascaderNode<T>;
  /** Removes the tag from the selection. */
  remove: (node: CascaderNode<T>) => void;
}

/**
 * Slots for the CascaderCompact component.
 */
export type CascaderCompactSlots<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> = {
  /** Custom content for the trigger icon (arrow). */
  'trigger-icon'?: () => any;
  /** Custom content for the trigger value. */
  'trigger-value'?: (props: CascaderCompactTriggerValueSlotProps<T, M, P>) => any;
  /** Custom content for the search input. */
  'search-input'?: () => any;
  /** Custom content for a single option. */
  option?: (props: CascaderCompactOptionSlotProps<T>) => any;
  /** Custom content for a tag in multiple mode. */
  tag?: (props: CascaderCompactTagSlotProps<T>) => any;
  /** Custom content for the empty state. */
  empty?: () => any;
};

// Theme Context
/**
 * Available UI slots for the Cascader component.
 */
export type CascaderUiSlot =
  | 'trigger'
  | 'triggerIcon'
  | 'value'
  | 'tag'
  | 'clear'
  | 'searchInput'
  | 'positioner'
  | 'popup'
  | 'panel'
  | 'menu'
  | 'option'
  | 'optionText'
  | 'optionCheck'
  | 'optionArrow'
  | 'empty'
  | 'arrow';

/**
 * UI class overrides for the Cascader component.
 */
export type CascaderUi = UiClass<CascaderUiSlot>;

/**
 * Parameters used to create the CascaderRoot context.
 */
export interface CascaderRootContextParams extends ToContext<
  CascaderRootProps<DefinedValue, boolean, boolean>,
  | 'dir'
  | 'disabled'
  | 'clearable'
  | 'expandTrigger'
  | 'checkStrictly'
  | 'multiple'
  | 'pathMode'
  | 'showCheckedStrategy'
  | 'separator'
  | 'filterable'
  | 'remote'
  | 'lazy'
  | 'searchDelay'
  | 'virtualScroll'
  | 'itemSize'
  | 'height'
  | 'placeholder'
> {
  /** Merged field keys with defaults. */
  fieldKeys: ComputedRef<CascaderFieldKeys>;
  /** Custom filter function. */
  filter: ((pattern: string, option: CascaderOptionData<DefinedValue>, path: string[]) => boolean) | undefined;
  /** Async load function used by lazy mode. */
  onLoad: ((option: CascaderNode<DefinedValue>) => Promise<CascaderOptionData<DefinedValue>[]>) | undefined;
  /** Async search function used by remote mode. */
  onSearch: ((pattern: string) => Promise<CascaderOptionData<DefinedValue>[]>) | undefined;
  /** The open state of the cascader. */
  open: ShallowRef<boolean | undefined>;
  /** The disclosure state derived from `open`. */
  dataState: ComputedRef<'open' | 'closed'>;
  /** Handler used to update the open state. */
  onOpenChange: (value: boolean) => void;
  /** Current model value (loose internal shape). */
  modelValue: ShallowRef<CascaderModelValue | undefined>;
  /** The trigger element. */
  triggerElement: ShallowRef<HTMLElement | undefined>;
  /** The content (panel) element. */
  contentElement: ShallowRef<HTMLElement | undefined>;
  /** Id of the content element, linked to the trigger via `aria-controls`. */
  contentId: ComputedRef<string>;
  /** Returns the id of an option element, used by `aria-activedescendant`. */
  getOptionId: (node: CascaderNode<DefinedValue>) => string;
  /** Reports the trigger element. */
  onTriggerElementChange: (node: HTMLElement | undefined) => void;
  /** Reports the content element. */
  onContentElementChange: (node: HTMLElement | undefined) => void;
  /** Root level nodes. */
  rootNodes: ComputedRef<CascaderNode<DefinedValue>[]>;
  /** The linked columns of the panel. */
  menus: ComputedRef<CascaderNode<DefinedValue>[][]>;
  /** The currently highlighted node (keyboard / hover). */
  highlighted: ShallowRef<CascaderNode<DefinedValue> | null>;
  /** Id used as `aria-activedescendant` of the highlighted node. */
  highlightedId: ComputedRef<string | null>;
  /** The nodes collected per `showCheckedStrategy`. */
  selectedNodes: ComputedRef<CascaderNode<DefinedValue>[]>;
  /** Labels of the selected nodes used for display. */
  selectedLabels: ComputedRef<string[]>;
  /** Whether the panel is in search mode. */
  isSearchMode: ComputedRef<boolean>;
  /** The current search pattern. */
  searchPattern: ShallowRef<string>;
  /** Flat search results. */
  searchResults: ComputedRef<CascaderNode<DefinedValue>[]>;
  /** Whether the remote search is loading. */
  searchLoading: ShallowRef<boolean>;
  /** Set of uids of the nodes currently loading. */
  loadingKeys: ComputedRef<Set<string>>;
  /** Expands a node (truncates the following columns and pushes the children column). */
  expandNode: (node: CascaderNode<DefinedValue>, originalEvent?: Event) => void;
  /** Handles a select interaction on a node. */
  onOptionSelect: (node: CascaderNode<DefinedValue>, originalEvent: PointerEvent | KeyboardEvent) => void;
  /** Handles a hover interaction on a node. */
  onOptionHover: (node: CascaderNode<DefinedValue>) => void;
  /** Sets the highlighted node. */
  setHighlighted: (node: CascaderNode<DefinedValue> | null) => void;
  /** Whether a node is checked. */
  isChecked: (node: CascaderNode<DefinedValue>) => boolean;
  /** Whether a node is in an indeterminate state. */
  isIndeterminate: (node: CascaderNode<DefinedValue>) => boolean;
  /** Whether a node is the currently selected node (single-select). */
  isSelected: (node: CascaderNode<DefinedValue>) => boolean;
  /** Toggles the checked state of a node. */
  toggleCheck: (node: CascaderNode<DefinedValue>) => void;
  /** Removes a checked node (or its whole checked subtree) from the selection. */
  removeNode: (node: CascaderNode<DefinedValue>) => void;
  /** Clears the current selection. */
  clearValue: () => void;
  /** Handles the keyboard navigation. */
  handleKeydown: (event: KeyboardEvent) => void;
}
