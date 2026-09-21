import type { ComputedRef, ShallowRef } from 'vue';
import type { BaseProps, UiClass } from '../../types';

/**
 * Type information for AffixTarget.
 */
export type AffixTarget = string | Window | HTMLElement;

/**
 * State values for AffixState.
 */
export type AffixState = 'fixed' | 'static';

/**
 * Properties for the AffixRoot component.
 */
export interface AffixRootProps extends Omit<BaseProps, 'onChange'> {
  /**
   * The offset from the top of the target container when the element becomes affixed.
   *
   * @defaultValue 0
   */
  offsetTop?: number;
  /**
   * The offset from the bottom of the target container when the element becomes affixed.
   */
  offsetBottom?: number;
  /**
   * The element that Affix listens to for scroll position updates.
   *
   * @defaultValue window
   */
  target?: AffixTarget | null;
}

/**
 * Events for the AffixRoot component.
 */
export type AffixRootEmits = {
  /**
   * Emitted when change occurs.
   */
  change: [affixed: boolean];
};

/**
 * Properties for the AffixPlaceholder component.
 */
export interface AffixPlaceholderProps extends BaseProps {}

/**
 * Properties for the AffixContent component.
 */
export interface AffixContentProps extends BaseProps {}

/**
 * Properties for the AffixCompact component.
 */
export interface AffixCompactProps extends AffixRootProps {
  /**
   * Properties forwarded to the placeholder element.
   */
  placeholderProps?: AffixPlaceholderProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: AffixContentProps;
}

/**
 * Events for the AffixCompact component.
 */
export type AffixCompactEmits = AffixRootEmits;

/**
 * Context for the AffixRoot component.
 */
export interface AffixRootContext {
  /**
   * Whether affixed.
   */
  affixed: ShallowRef<boolean>;
  /**
   * Affix style used by the component context.
   */
  affixStyle: ShallowRef<Record<string, string> | undefined>;
  /**
   * Placeholder style used by the component context.
   */
  placeholderStyle: ShallowRef<Record<string, string> | undefined>;
  /**
   * Data state used by the component context.
   */
  dataState: ComputedRef<AffixState>;
  /**
   * Update position used by the component context.
   */
  updatePosition: () => void;
}

/**
 * Available UI slots for the Affix component.
 */
export type AffixUiSlot = 'root' | 'placeholder' | 'content';

/**
 * UI class overrides for the Affix component.
 */
export type AffixUi = UiClass<AffixUiSlot>;
