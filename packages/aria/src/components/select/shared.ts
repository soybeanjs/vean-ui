import { isNullish } from '../../shared';
import type { DefinedValue, MaybeArray } from '../../types';
import type { SelectGroupOptionData, SelectOptionData } from './types';

export const selectCssVars = {
  popupTransformOrigin: '--vean-select-popup-transform-origin',
  popupAvailableWidth: '--vean-select-popup-available-width',
  popupAvailableHeight: '--vean-select-popup-available-height',
  triggerWidth: '--vean-select-trigger-width',
  triggerHeight: '--vean-select-trigger-height'
};

export const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown'];
export const SELECTION_KEYS = [' ', 'Enter'];
export const CONTENT_MARGIN = 10;

export const SELECT_EVENT = 'select.select';

export function shouldShowPlaceholder(value?: MaybeArray<DefinedValue> | undefined): boolean {
  return isNullish(value) || value === '' || (Array.isArray(value) && value.length === 0);
}

export function isGroupOption<T extends DefinedValue = DefinedValue>(
  item: SelectOptionData<T>
): item is SelectGroupOptionData<T> {
  return 'items' in item;
}
