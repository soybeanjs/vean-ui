import type { ComputedRef, CSSProperties, ShallowRef } from 'vue';
import type { DataOrientation, Direction, ToContext, UiClass } from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the SplitterGroup component.
 */
export interface SplitterGroupProps extends PrimitiveWithBaseProps {
  /**
   * The orientation of the splitter group.
   *
   * Either `horizontal` or `vertical`. Defaults to `horizontal`.
   */
  direction?: DataOrientation;
  /**
   * The reading direction of the splitter group.
   */
  dir?: Direction;
  /**
   * The initial layout percentages for the panels.
   */
  defaultLayout?: number[];
  /**
   * The percentage step size used for keyboard resizing.
   */
  keyboardResizeBy?: number;
}

/**
 * Events for the SplitterGroup component.
 */
export type SplitterGroupEmits = {
  /**
   * Event handler called when the group layout changes.
   */
  layout: [value: number[]];
};

/**
 * Properties for the SplitterPanel component.
 */
export interface SplitterPanelProps extends PrimitiveWithBaseProps {
  /**
   * The initial size of the panel as a percentage of the group.
   */
  defaultSize?: number;
  /**
   * Whether the panel can collapse.
   */
  collapsible?: boolean;
  /**
   * The size of the panel when collapsed.
   */
  collapsedSize?: number;
  /**
   * The maximum size of the panel.
   */
  maxSize?: number;
  /**
   * The minimum size of the panel when expanded.
   */
  minSize?: number;
  /**
   * The order of the panel within the group.
   */
  order?: number;
}

/**
 * Events for the SplitterPanel component.
 */
export type SplitterPanelEmits = {
  /**
   * Event handler called when the panel collapses.
   */
  collapse: [];
  /**
   * Event handler called when the panel expands.
   */
  expand: [];
  /**
   * Event handler called when the panel size changes.
   */
  resize: [size: number, prevSize: number | undefined];
};

/**
 * Properties for the SplitterResizeHandle component.
 */
export interface SplitterResizeHandleProps extends PrimitiveWithBaseProps {
  /**
   * Whether the resize handle is disabled.
   */
  disabled?: boolean;
  /**
   * The tabindex of the resize handle.
   */
  tabindex?: number;
}

/**
 * Events for the SplitterResizeHandle component.
 */
export type SplitterResizeHandleEmits = {
  /**
   * Event handler called when dragging state changes.
   */
  dragging: [value: boolean];
};

/**
 * Type information for SplitterPanelRecord.
 */
export interface SplitterPanelRecord {
  /**
   * Id.
   */
  id: string;
  /**
   * Registration index.
   */
  registrationIndex: number;
  /**
   * Order.
   */
  order: ComputedRef<number | undefined>;
  /**
   * Default size.
   */
  defaultSize: ComputedRef<number | undefined>;
  /**
   * Min size.
   */
  minSize: ComputedRef<number>;
  /**
   * Max size.
   */
  maxSize: ComputedRef<number>;
  /**
   * Whether the component can be collapsed.
   */
  collapsible: ComputedRef<boolean>;
  /**
   * Collapsed size.
   */
  collapsedSize: ComputedRef<number>;
  /**
   * Callback invoked when the collapse event fires.
   */
  onCollapse: () => void;
  /**
   * Callback invoked when the expand event fires.
   */
  onExpand: () => void;
  /**
   * Callback invoked when the resize event fires.
   */
  onResize: (size: number, prevSize: number | undefined) => void;
}

/**
 * Type information for SplitterPanelRegistration.
 */
export type SplitterPanelRegistration = Omit<SplitterPanelRecord, 'registrationIndex'>;

/**
 * Context for the SplitterGroup component.
 */
export interface SplitterGroupContext extends ToContext<SplitterGroupProps, 'direction' | 'dir' | 'keyboardResizeBy'> {
  /**
   * Group id used by the component context.
   */
  groupId: string;
  /**
   * Layout used by the component context.
   */
  layout: ShallowRef<number[]>;
  /**
   * Reference to the root element.
   */
  rootElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Register panel used by the component context.
   */
  registerPanel: (panel: SplitterPanelRegistration) => void;
  /**
   * Unregister panel used by the component context.
   */
  unregisterPanel: (panelId: string) => void;
  /**
   * Refresh layout used by the component context.
   */
  refreshLayout: () => void;
  /**
   * Get panel style used by the component context.
   */
  getPanelStyle: (panelId: string) => CSSProperties;
  /**
   * Get panel size used by the component context.
   */
  getPanelSize: (panelId: string) => number | undefined;
  /**
   * Whether a panel collapsed.
   */
  isPanelCollapsed: (panelId: string) => boolean;
  /**
   * Collapse panel used by the component context.
   */
  collapsePanel: (panelId: string) => void;
  /**
   * Expand panel used by the component context.
   */
  expandPanel: (panelId: string) => void;
  /**
   * Resize panel used by the component context.
   */
  resizePanel: (panelId: string, size: number) => void;
  /**
   * Resize panel pair used by the component context.
   */
  resizePanelPair: (pairIndex: number, delta: number) => void;
  /**
   * Get panel record by index used by the component context.
   */
  getPanelRecordByIndex: (index: number) => SplitterPanelRecord | undefined;
  /**
   * Get panel bounds used by the component context.
   */
  getPanelBounds: (panelId: string) => { min: number; max: number } | undefined;
  /**
   * Get group size used by the component context.
   */
  getGroupSize: () => number;
}

/**
 * Available UI slots for the Splitter component.
 */
export type SplitterUiSlot = 'root' | 'panel' | 'resizeHandle';

/**
 * UI class overrides for the Splitter component.
 */
export type SplitterUi = UiClass<SplitterUiSlot>;
