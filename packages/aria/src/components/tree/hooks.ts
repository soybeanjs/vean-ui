import { computed, shallowRef, toValue } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { findValuesBetween } from '../../shared';
import type { CollectionItemData } from '../../composables/use-collection';
import type { FocusIntent, MaybeArray } from '../../types';
import type { TreeSelectBehavior } from './types';

export function useSelectionBehavior(
  modelValue: ShallowRef<MaybeArray<string> | undefined>,
  _multiple: MaybeRefOrGetter<boolean | undefined>,
  _selectionBehavior: MaybeRefOrGetter<TreeSelectBehavior | undefined>
) {
  const firstValue = shallowRef('');
  const multiple = computed(() => toValue(_multiple));
  const selectionBehavior = computed(() => toValue(_selectionBehavior));

  const onSelectItem = (value: string) => {
    if (multiple.value && Array.isArray(modelValue.value)) {
      if (selectionBehavior.value === 'replace') {
        modelValue.value = [value];
        firstValue.value = value;
      } else {
        const index = modelValue.value.findIndex(v => v === value);
        if (index !== -1) {
          modelValue.value = modelValue.value.filter(v => v !== value);
        } else {
          modelValue.value = [...modelValue.value, value];
        }
      }
    } else if (selectionBehavior.value === 'replace') {
      modelValue.value = value;
    } else if (!Array.isArray(modelValue.value) && modelValue.value === value) {
      modelValue.value = undefined;
    } else {
      modelValue.value = value;
    }

    return modelValue.value;
  };

  const handleMultipleReplace = (
    intent: FocusIntent,
    element: HTMLElement | null,
    expanded: string[],
    getItems?: () => CollectionItemData[] | undefined
  ) => {
    if (!firstValue.value || !multiple.value || !Array.isArray(modelValue.value)) return;

    const collection = getItems?.() ?? [];
    const lastValue = collection.find(item => item.element === element)?.data?.value as string;
    if (!lastValue) return;

    const intentMap: Record<FocusIntent, string[]> = {
      prev: findValuesBetween(expanded, firstValue.value, lastValue),
      next: findValuesBetween(expanded, firstValue.value, lastValue),
      first: findValuesBetween(expanded, firstValue.value, expanded?.[0]).filter(Boolean) as string[],
      last: findValuesBetween(expanded, firstValue.value, expanded?.[expanded.length - 1]).filter(Boolean) as string[]
    };

    modelValue.value = intentMap[intent];
  };

  return {
    firstValue,
    onSelectItem,
    handleMultipleReplace
  };
}
