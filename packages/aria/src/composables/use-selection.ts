import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { isNullish, getVueBooleanCasting } from '../shared';
import type { DefinedValue, SelectionProps } from '../types';
import { useControllableState } from './use-controllable-state';

export function useSelection<M extends boolean = false, N extends DefinedValue = string>(
  props: MaybeRefOrGetter<SelectionProps<M, N>>,
  onUpdateModelValue: (value: NonNullable<SelectionProps<M, N>['modelValue']>) => void
) {
  const propsRef = computed(() => toValue(props));

  const isMultiple = computed(() => getVueBooleanCasting(propsRef.value.multiple));

  const clearable = computed(() => getVueBooleanCasting(propsRef.value.clearable));

  const isToggle = computed(() => (propsRef.value.selectionBehavior ?? 'toggle') === 'toggle');

  const modelValue = useControllableState(
    () => propsRef.value.modelValue,
    value => {
      onUpdateModelValue(value!);
    },
    getSelectionDefaultValue(),
    true
  );

  function getSelectionDefaultValue() {
    if (!isNullish(propsRef.value.defaultValue)) {
      return propsRef.value.defaultValue;
    }

    return (isMultiple.value ? [] : undefined) as SelectionProps<M, N>['modelValue'];
  }

  const isValueSelected = (value: N) => {
    if (isMultiple.value && Array.isArray(modelValue.value)) {
      return modelValue.value.includes(value);
    }
    return modelValue.value === value;
  };

  const isEmptyModelValue = computed(() => {
    if (isMultiple.value && Array.isArray(modelValue.value)) {
      return modelValue.value?.length === 0;
    }
    return isNullish(modelValue.value);
  });

  const onModelValueChange = (value: N) => {
    if (!isMultiple.value) {
      if (!isToggle.value) {
        modelValue.value = value as SelectionProps<M, N>['modelValue'];
        return;
      }

      const updated = modelValue.value === value ? undefined : value;

      if (updated === undefined && !clearable.value) {
        return;
      }

      modelValue.value = updated as SelectionProps<M, N>['modelValue'];
      return;
    }

    if (isToggle.value) {
      let values = [...((modelValue.value ?? []) as N[])];

      if (values.includes(value)) {
        values = values.filter(v => v !== value);
      } else {
        values = [...values, value];
      }

      modelValue.value = values as SelectionProps<M, N>['modelValue'];

      return;
    }

    modelValue.value = [value] as SelectionProps<M, N>['modelValue'];
  };

  const setModelValue = (value: N[] | N | undefined) => {
    if (isMultiple.value && Array.isArray(value)) {
      modelValue.value = value as N[] as SelectionProps<M, N>['modelValue'];
      return;
    }

    if (!isMultiple.value && !Array.isArray(value)) {
      modelValue.value = value as N as SelectionProps<M, N>['modelValue'];
    }
  };

  const resetModelValue = () => {
    modelValue.value = (isMultiple.value ? ([] as N[]) : undefined) as SelectionProps<M, N>['modelValue'];
  };

  return {
    modelValue,
    onModelValueChange,
    setModelValue,
    resetModelValue,
    isValueSelected,
    isMultiple,
    isEmptyModelValue
  };
}
