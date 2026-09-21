import { computed, shallowRef } from 'vue';
import { getCheckedState, isIndeterminate } from '../../shared';
import { useContext, useUiContext } from '../../composables';
import type {
  CheckboxGroupRootContextParams,
  CheckboxRootContextParams,
  CheckboxUiSlot,
  CheckboxCardUiSlot
} from './types';

export const [provideCheckboxGroupRootContext, useCheckboxGroupRootContext] = useContext(
  'CheckboxGroupRoot',
  (params: CheckboxGroupRootContextParams) => params
);

export const [provideCheckboxRootContext, useCheckboxRootContext] = useContext(
  'CheckboxRoot',
  (params: CheckboxRootContextParams) => {
    const { modelValue, state } = params;

    const ariaChecked = computed(() => {
      if (isIndeterminate(state.value)) {
        return 'mixed';
      }
      return state.value;
    });

    const dataDisabled = computed(() => (params.disabled.value ? '' : undefined));
    const dataState = computed(() => getCheckedState(state.value));

    const controlId = shallowRef('');

    const initControlId = (id: string) => {
      controlId.value = id;
    };

    return {
      ...params,
      modelValue,
      state,
      ariaChecked,
      dataDisabled,
      dataState,
      controlId,
      initControlId
    };
  }
);

export const [provideCheckboxUi, useCheckboxUi] = useUiContext<CheckboxUiSlot>('CheckboxUi');

export const [provideCheckboxCardUi, useCheckboxCardUi] = useUiContext<CheckboxCardUiSlot>('CheckboxCardUi', ui => {
  provideCheckboxUi(ui);

  return ui;
});
