import type { MaybeArray } from '../../types';
import type { ComboboxGroupOptionData, ComboboxOptionData, ComboboxSingleOptionData } from './types';

export function isGroupOption(item: ComboboxOptionData): item is ComboboxGroupOptionData {
  return 'items' in item;
}

export function getFlatOptions(items: ComboboxOptionData[]): ComboboxSingleOptionData[] {
  return items.flatMap(item => (isGroupOption(item) ? item.items : item));
}

export function getSelectedLabels(modelValue: MaybeArray<string> | undefined, items: ComboboxOptionData[]): string[] {
  const values = Array.isArray(modelValue) ? modelValue : modelValue ? [modelValue] : [];
  const labels = new Map<string, string>();

  getFlatOptions(items).forEach(item => {
    labels.set(item.value, item.label);
  });

  return values.map(value => labels.get(value) ?? value);
}

export function getDisplayValue(modelValue: MaybeArray<string> | undefined, items: ComboboxOptionData[]): string {
  if (!modelValue || Array.isArray(modelValue)) {
    return '';
  }

  return getSelectedLabels(modelValue, items)[0] ?? modelValue;
}
