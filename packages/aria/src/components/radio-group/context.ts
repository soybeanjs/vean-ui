import { computed, shallowRef } from 'vue';
import { getCheckedState } from '../../shared';
import { useContext, useUiContext } from '../../composables';
import type {
  RadioGroupItemContextParams,
  RadioGroupRootContext,
  RadioGroupUiSlot,
  RadioGroupCardUiSlot
} from './types';

export const [provideRadioGroupRootContext, useRadioGroupRootContext] =
  useContext<RadioGroupRootContext>('RadioGroupRoot');

export const [provideRadioGroupItemContext, useRadioGroupItemContext] = useContext(
  'RadioGroupItem',
  (params: RadioGroupItemContextParams) => {
    const dataState = computed(() => getCheckedState(params.checked.value));

    const controlId = shallowRef('');

    const initControlId = (id: string) => {
      controlId.value = id;
    };

    return {
      ...params,
      dataState,
      controlId,
      initControlId
    };
  }
);

export const [provideRadioGroupUi, useRadioGroupUi] = useUiContext<RadioGroupUiSlot>('RadioGroupUi');

export const [provideRadioGroupCardUi, useRadioGroupCardUi] = useUiContext<RadioGroupCardUiSlot>(
  'RadioGroupCardUi',
  ui => {
    provideRadioGroupUi(ui);

    return ui;
  }
);
