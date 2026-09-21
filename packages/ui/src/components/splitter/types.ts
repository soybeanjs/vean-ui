import type {
  SplitterGroupEmits as AriaSplitterGroupEmits,
  SplitterGroupProps as AriaSplitterGroupProps,
  SplitterPanelEmits as AriaSplitterPanelEmits,
  SplitterPanelProps as AriaSplitterPanelProps,
  SplitterResizeHandleEmits as AriaSplitterResizeHandleEmits,
  SplitterResizeHandleProps as AriaSplitterResizeHandleProps,
  SplitterUi
} from '@vean/aria/splitter';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the SplitterGroup component.
 */
export interface SplitterGroupProps extends AriaSplitterGroupProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<SplitterUi>;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
}

/**
 * Events for the SplitterGroup component.
 */
export type SplitterGroupEmits = AriaSplitterGroupEmits;

/**
 * Properties for the SplitterPanel component.
 */
export interface SplitterPanelProps extends AriaSplitterPanelProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
}

/**
 * Events for the SplitterPanel component.
 */
export type SplitterPanelEmits = AriaSplitterPanelEmits;

/**
 * Properties for the SplitterResizeHandle component.
 */
export interface SplitterResizeHandleProps extends AriaSplitterResizeHandleProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Whether with handle.
   */
  withHandle?: boolean;
}

/**
 * Events for the SplitterResizeHandle component.
 */
export type SplitterResizeHandleEmits = AriaSplitterResizeHandleEmits;

/**
 * Exposed methods for the SplitterPanel component.
 */
export interface SplitterPanelExposed {
  collapse: () => void;
  expand: () => void;
  resize: (size: number) => void;
  getSize: () => number | undefined;
  get isCollapsed(): boolean;
  get isExpanded(): boolean;
}
