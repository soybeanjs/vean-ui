import { computed } from 'vue';
import { isNullish } from '../../shared';
import { useContext, useUiContext } from '../../composables';
import type { AcceptableBooleanValue } from '../../types';
import type { SwitchRootContextParams, SwitchUiSlot } from './types';

export const [provideSwitchRootContext, useSwitchRootContext] = useContext(
  'SwitchRoot',
  (params: SwitchRootContextParams<AcceptableBooleanValue>) => {
    const { modelValue, disabled, trueValue, falseValue } = params;

    function toggleCheck() {
      if (disabled.value) return;

      if (isNullish(modelValue.value)) {
        modelValue.value = trueValue.value;
      } else {
        modelValue.value = modelValue.value === trueValue.value ? falseValue.value : trueValue.value;
      }
    }

    const dataState = computed(() => (modelValue?.value === trueValue.value ? 'checked' : 'unchecked'));

    const dataDisabled = computed(() => (disabled.value ? '' : undefined));

    return {
      ...params,
      toggleCheck,
      dataState,
      dataDisabled
    };
  }
);

export const [provideSwitchUi, useSwitchUi] = useUiContext<SwitchUiSlot>('SwitchUi');
