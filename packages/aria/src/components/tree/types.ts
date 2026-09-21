import type { ComputedRef, ShallowRef } from 'vue';
import type { EventHook } from '@vueuse/core';
import type { CollectionItemData } from '../../composables/use-collection';
import type { Direction, FocusIntent, MaybeArray, ToContext, TreeSelectEvent, TreeToggleEvent } from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';
import type { VirtualizerItemProps, VirtualizerRootProps } from '../virtualizer/types';

/**
 * Type information for TreeItemBaseData.
 */
export interface TreeItemBaseData {
  /** Value given to this item */
  value: string;
  /** When `true`, prevents the user from interacting with the item. */
  disabled?: boolean;
}

/**
 * Type information for TreeItemData.
 */
export type TreeItemData<T extends TreeItemBaseData = TreeItemBaseData> = T & {
  /** List of children items */
  children?: TreeItemData<T>[];
};

/**
 * Type information for TreeSelectBehavior.
 */
export type TreeSelectBehavior = 'toggle' | 'replace';

/**
 * Type information for TreeToggleBehavior.
 */
export type TreeToggleBehavior = 'single' | 'multiple';

type IsMultiple<U extends MaybeArray<string> | undefined, M extends boolean> = U extends string
  ? false
  : M extends true
    ? true
    : false;

/**
 * Properties for the TreeRoot component.
 */
export interface TreeRootProps<
  T extends TreeItemData = TreeItemData,
  U extends MaybeArray<string> | undefined = MaybeArray<string> | undefined,
  M extends boolean = boolean
> extends Omit<PrimitiveWithBaseProps, 'onSelect' | 'onToggle'> {
  /** The controlled value of the tree. Can be bound-with with `v-model`. */
  modelValue?: U;
  /** The value of the tree when initially rendered. Use when you do not need to control the state of the tree */
  defaultValue?: U;
  /** Determines whether a "single" or "multiple" items can be selected at a time. */
  multiple?: IsMultiple<U, M>;
  /** List of items */
  items?: T[];
  /** The controlled value of the expanded item. Can be bound-with with `v-model`. */
  expanded?: string[];
  /** The value of the expanded tree when initially rendered. */
  defaultExpanded?: string[];
  /** How multiple selection should behave in the collection. */
  selectionBehavior?: TreeSelectBehavior;
  /**
   * Determines whether a "single" or "multiple" items can be toggled at a time.
   *
   * @defaultValue 'multiple'
   * */
  toggleBehavior?: TreeToggleBehavior;
  /** The reading direction. */
  dir?: Direction;
  /**
   * When `true`, keyboard navigation will loop from last item to first, and vice versa.
   *
   * @defaultValue true
   */
  loop?: boolean;
  /** When `true`, prevents the user from interacting with tree */
  disabled?: boolean;
  /** When `true`, selecting parent will select the descendants. */
  propagateSelect?: boolean;
  /** When `true`, selecting children will update the parent state. */
  bubbleSelect?: boolean;
  /** When `true`, parent can be selected. */
  allowParentSelect?: boolean;
}

/**
 * Events for the TreeRoot component.
 */
export type TreeRootEmits<M extends boolean | undefined> = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: M extends true ? string[] : string];
  /**
   * Emitted when the expanded state changes.
   */
  'update:expanded': [value: string[]];
};

/**
 * Marker object spliced into the tree motion render list at the position where
 * the animated subtree block should mount. UI layers replace it with the
 * motion block; it never renders as a regular tree item.
 */
export interface TreeMotionSentinel {
  readonly __soybeanTreeMotionSentinel__: true;
}

/**
 * Direction of the current tree expand/collapse motion.
 */
export type TreeMotionType = 'show' | 'hide';

/**
 * A single entry of the tree motion render list: either a regular flattened
 * item or the motion sentinel that UI layers replace with the animated
 * subtree block.
 */
export type TreeMotionListItem<T extends TreeItemData> = FlattenedItem<T> | TreeMotionSentinel;

/**
 * State of the running expand/collapse motion of a tree. `null` when idle.
 */
export interface TreeMotionState<T extends TreeItemData = TreeItemData> {
  /**
   * Value of the expanded/collapsed parent item whose subtree is animating.
   */
  key: string;
  /**
   * Whether the motion expands (`show`) or collapses (`hide`) the subtree.
   */
  type: TreeMotionType;
  /**
   * Render list: the flattened items of the transition snapshot with the
   * motion sentinel spliced in at the animated subtree position.
   */
  items: Array<TreeMotionListItem<T>>;
  /**
   * Descendant items rendered inside the animated subtree block.
   */
  blockItems: FlattenedItem<T>[];
  /**
   * Ends the current motion and restores the plain flattened render list.
   * Call it from the motion block transition finish hooks.
   */
  end: () => void;
}

/**
 * Type information for FlattenedItem.
 */
export type FlattenedItem<T extends TreeItemData> = {
  /**
   * Id.
   */
  _id: string;
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Value associated with the current item.
   */
  value: string;
  /**
   * Data.
   */
  data: T;
  /**
   * Level.
   */
  level: number;
  /**
   * Whether the component has children.
   */
  hasChildren: boolean;
  /**
   * Parent.
   */
  parent?: T;
  /**
   * Bind.
   */
  bind: {
    data: T;
    level: number;
    'aria-setsize'?: number;
    'aria-posinset'?: number;
  };
};

/**
 * Properties for the TreeItem component.
 */
export interface TreeItemProps extends Omit<PrimitiveWithBaseProps, 'onSelect' | 'onToggle'> {
  /**
   * Value associated with the current item.
   */
  value: string;
  /**
   * Level.
   */
  level: number;
  /** When `true`, prevents the user from selecting or toggling the item. */
  disabled?: boolean;
  /** When `true`, prevents the user from selecting the item. */
  disabledSelect?: boolean;
  /** When `true`, prevents the user from toggling the item. */
  disabledToggle?: boolean;
}

/**
 * Events for the TreeItem component.
 */
export type TreeItemEmits = {
  /** Event handler called when selecting item. */
  select: [event: TreeSelectEvent<string>];
  /** Event handler called when toggling item. */
  toggle: [event: TreeToggleEvent<string>];
};

/**
 * Properties for the TreeVirtualizerRoot component.
 */
export interface TreeVirtualizerRootProps<
  T extends TreeItemData = TreeItemData,
  U extends MaybeArray<string> | undefined = MaybeArray<string> | undefined,
  M extends boolean = boolean
>
  extends TreeRootProps<T, U, M>, Omit<VirtualizerRootProps<FlattenedItem<T>>, 'dir' | 'items'> {}

/**
 * Events for the TreeVirtualizerRoot component.
 */
export type TreeVirtualizerRootEmits<M extends boolean | undefined> = TreeRootEmits<M>;

/**
 * Properties for the TreeVirtualizerItem component.
 */
export interface TreeVirtualizerItemProps extends TreeItemProps, VirtualizerItemProps {}

/**
 * Events for the TreeVirtualizerItem component.
 */
export type TreeVirtualizerItemEmits = TreeItemEmits;

/**
 * Parameters used to create the TreeRoot context.
 */
export interface TreeRootContextParams extends ToContext<
  TreeRootProps,
  'items' | 'dir' | 'multiple' | 'disabled' | 'selectionBehavior' | 'propagateSelect' | 'bubbleSelect'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<MaybeArray<string> | undefined>;
  /**
   * Expanded used by the component context.
   */
  expanded: ShallowRef<string[]>;
  /**
   * Selected keys used by the component context.
   */
  selectedKeys: ComputedRef<string[]>;
  /**
   * Callback invoked when the select event fires.
   */
  onSelect: (value: string) => void;
  /**
   * Callback invoked when the toggle event fires.
   */
  onToggle: (value: string) => void;
  /**
   * Expanded items used by the component context.
   */
  expandedItems: ComputedRef<FlattenedItem<TreeItemData>[]>;
  /**
   * Whether virtualization is enabled.
   */
  isVirtual: ShallowRef<boolean>;
  /**
   * Virtual keydown hook used by the component context.
   */
  virtualKeydownHook: EventHook<KeyboardEvent>;
  /**
   * Get items used by the component context.
   */
  getItems?: () => CollectionItemData[] | undefined;
  /**
   * Handle multiple replace used by the component context.
   */
  handleMultipleReplace: (
    intent: FocusIntent,
    element: HTMLElement | null,
    expanded: string[],
    getItems?: () => CollectionItemData[] | undefined
  ) => void;
}
