import type { Component, VNode } from 'vue';

/**
 * Type information for IconValue.
 */
export type IconValue = VNode | Component | string | null | undefined;

/**
 * Properties for the Icon component.
 */
export interface IconProps {
  /**
   * Icon rendered by the component.
   */
  icon: IconValue;
}
