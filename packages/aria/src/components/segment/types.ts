import type { AcceptableValue, UiClass } from '../../types';
import type {
  TabsIndicatorProps,
  TabsListProps,
  TabsOptionData as SegmentOptionData,
  TabsRootEmits,
  TabsRootProps,
  TabsTriggerProps,
  TabsUiSlot
} from '../tabs/types';

/**
 * Properties for the SegmentRoot component.
 */
export interface SegmentRootProps<T extends AcceptableValue = AcceptableValue> extends TabsRootProps<T> {}

/**
 * Events for the SegmentRoot component.
 */
export type SegmentRootEmits<T = AcceptableValue> = TabsRootEmits<T>;

/**
 * Properties for the SegmentList component.
 */
export interface SegmentListProps extends TabsListProps {}

/**
 * Properties for the SegmentTrigger component.
 */
export interface SegmentTriggerProps extends TabsTriggerProps {}

/**
 * Properties for the SegmentIndicator component.
 */
export interface SegmentIndicatorProps extends TabsIndicatorProps {}

/**
 * Properties for the SegmentCompact component.
 */
export interface SegmentCompactProps<T extends SegmentOptionData> extends SegmentRootProps<T['value'] | null> {
  /**
   * Items rendered by the component.
   */
  items: T[];
  /**
   * Whether to enable indicator.
   */
  enableIndicator?: boolean;
  /**
   * Properties forwarded to the list element.
   */
  listProps?: SegmentListProps;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: SegmentTriggerProps;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: SegmentIndicatorProps;
}

/**
 * Events for the SegmentCompact component.
 */
export type SegmentCompactEmits<T extends AcceptableValue = AcceptableValue> = SegmentRootEmits<T>;

/**
 * Slots for the SegmentCompact component.
 */
export type SegmentCompactSlots<T extends SegmentOptionData = SegmentOptionData> = {
  /**
   * Custom content for the item slot.
   */
  item?: (props: T & { selected: boolean }) => any;
  /**
   * Custom content for the indicator slot.
   */
  indicator?: () => any;
};

/**
 * Available UI slots for the Segment component.
 */
export type SegmentUiSlot = Exclude<TabsUiSlot, 'content'>;

/**
 * UI class overrides for the Segment component.
 */
export type SegmentUi = UiClass<SegmentUiSlot>;

export type { SegmentOptionData };
