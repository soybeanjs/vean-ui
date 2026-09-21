import type { TooltipProviderProps } from './types';

/**
 * Document-level broadcast fired whenever a tooltip opens. Independent tooltip
 * roots don't share a Vue ancestor beyond `document`, so the event is how an
 * opening tooltip tells every other open tooltip to close. The payload carries
 * the opener's popup id so listeners can ignore their own broadcast.
 */
export const TOOLTIP_OPEN = 'tooltip.open';

export interface TooltipOpenEventDetail {
  sourceId: string;
}

export const tooltipCssVars = {
  transformOrigin: '--vean-tooltip-transform-origin',
  availableWidth: '--vean-tooltip-available-width',
  availableHeight: '--vean-tooltip-available-height',
  anchorWidth: '--vean-tooltip-anchor-width',
  anchorHeight: '--vean-tooltip-anchor-height'
};

export const createDefaultTooltipConfig = (config?: Partial<TooltipProviderProps> | null) => {
  return {
    delayDuration: 150,
    skipDelayDuration: 300,
    disableHoverableContent: false,
    disableClosingTrigger: false,
    disabled: false,
    ignoreNonKeyboardFocus: false,
    ...config
  };
};

/** All provider-context config fields; optional entries (e.g. `positionerProps`) must stay explicit for context keys. */
export const PROVIDER_CONFIG_KEYS = [
  'delayDuration',
  'skipDelayDuration',
  'disableHoverableContent',
  'disableClosingTrigger',
  'disabled',
  'ignoreNonKeyboardFocus',
  'positionerProps'
] as const;

/** Provider fields a root resolves over its backing provider; `skipDelayDuration` is owned by the provider's delay group. */
export const ROOT_RESOLVE_KEYS = [
  'delayDuration',
  'disableHoverableContent',
  'disableClosingTrigger',
  'disabled',
  'ignoreNonKeyboardFocus',
  'positionerProps'
] as const;

/** Keeps only explicitly provided entries so an `undefined` prop never overrides a base config. */
export const pickDefinedConfig = (config?: Partial<TooltipProviderProps> | null) => {
  return Object.fromEntries(Object.entries(config ?? {}).filter(([, value]) => value !== undefined));
};
