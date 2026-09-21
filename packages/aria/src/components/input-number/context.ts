import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import { reactiveComputed } from '@vueuse/core';
import { clamp, createNumberFormatter, createNumberParser, isNullish, snapValueToStep } from '../../shared';
import { useLocale } from '../config-provider/context';
import { useContext, useForwardElement, useUiContext } from '../../composables';
import { handleDecimalOperation } from './shared';
import type { InputNumberRootContextParams, InputNumberUiSlot } from './types';

export const [provideInputNumberRootContext, useInputNumberRootContext] = useContext(
  'InputNumberRoot',
  (params: InputNumberRootContextParams) => {
    const { disabled, readonly, modelValue, focusOnChange, formatOptions, min, max, step, stepSnapping } = params;

    const [inputElement, setInputElement] = useForwardElement<HTMLInputElement>();

    const locale = useLocale(params.locale);
    const numberParser = reactiveComputed(() => createNumberParser(locale.value, formatOptions.value ?? {}));
    const numberFormatter = reactiveComputed(() => createNumberFormatter(locale.value, formatOptions.value ?? {}));

    const inputMode = computed<HTMLAttributes['inputmode']>(() => {
      // The inputMode attribute influences the software keyboard that is shown on touch devices.
      // Browsers and operating systems are quite inconsistent about what keys are available, however.
      // We choose between numeric and decimal based on whether we allow negative and fractional numbers,
      // and based on testing on various devices to determine what keys are available in each inputMode.
      const hasDecimals = numberFormatter.resolvedOptions().maximumFractionDigits! > 0;

      return hasDecimals ? 'decimal' : 'numeric';
    });

    const isDecreaseDisabled = computed(() => {
      if (isNullish(modelValue.value)) return false;

      if (clampInputValue(modelValue.value) === min.value || (min.value && !Number.isNaN(modelValue.value))) {
        return handleDecimalOperation('-', modelValue.value, step.value) < Number(min.value);
      }
      return false;
    });

    const isIncreaseDisabled = computed(() => {
      if (isNullish(modelValue.value)) return false;

      if (clampInputValue(modelValue.value) === max.value || (max.value && !Number.isNaN(modelValue.value))) {
        return handleDecimalOperation('+', modelValue.value, step.value) > Number(max.value);
      }
      return false;
    });

    // Replace negative textValue formatted using currencySign: 'accounting'
    // with a textValue that can be announced using a minus sign.
    const textValueFormatter = reactiveComputed(() => createNumberFormatter(locale.value, formatOptions.value ?? {}));
    const textValue = computed(() =>
      isNullish(modelValue.value) || Number.isNaN(modelValue.value) ? '' : textValueFormatter.format(modelValue.value)
    );

    function validate(val: string) {
      return numberParser.isValidPartialNumber(val, min.value, max.value);
    }

    function clampInputValue(val: number) {
      // Clamp to min and max, round to the nearest step, and round to specified number of digits
      let clampedValue: number;
      if (step.value === undefined || Number.isNaN(step.value) || !stepSnapping.value) {
        clampedValue = clamp(val, min.value, max.value);
      } else {
        clampedValue = snapValueToStep(val, min.value, max.value, step.value);
      }

      clampedValue = numberParser.parse(numberFormatter.format(clampedValue));
      return clampedValue;
    }

    function onChangingValue(type: 'increase' | 'decrease', multiplier = 1) {
      if (focusOnChange.value) {
        inputElement.value?.focus();
      }
      if (disabled.value || readonly.value) return;

      const currentInputValue = numberParser.parse(inputElement.value?.value ?? '') as number;
      if (Number.isNaN(currentInputValue)) {
        modelValue.value = min.value ?? 0;

        return;
      }

      const incrementFlag = type === 'increase' ? 1 : -1;
      modelValue.value = clampInputValue(currentInputValue + (step.value ?? 1) * multiplier * incrementFlag);
    }

    function onIncrease(multiplier = 1) {
      onChangingValue('increase', multiplier);
    }
    function onDecrease(multiplier = 1) {
      onChangingValue('decrease', multiplier);
    }

    function onMinMaxValue(type: 'min' | 'max') {
      if (type === 'min' && min.value !== undefined) {
        modelValue.value = clampInputValue(min.value);
      } else if (type === 'max' && max.value !== undefined) {
        modelValue.value = clampInputValue(max.value);
      }
    }

    function setInputValue(val: string) {
      if (!inputElement.value) return;
      inputElement.value.value = val;
    }

    function applyInputValue(val: string) {
      const parsedValue = numberParser.parse(val);

      modelValue.value = Number.isNaN(parsedValue) ? undefined : clampInputValue(parsedValue);
      // Set to empty state if input value is empty
      if (!val.length) return setInputValue(val);

      // if it failed to parse, then reset input to formatted version of current number
      if (Number.isNaN(parsedValue)) return setInputValue(textValue.value);

      return setInputValue(textValue.value);
    }

    return {
      ...params,
      isDecreaseDisabled,
      isIncreaseDisabled,
      inputElement,
      inputMode,
      textValue,
      setInputElement,
      applyInputValue,
      validate,
      onIncrease,
      onDecrease,
      onMinMaxValue
    };
  }
);

export const [provideInputNumberUi, useInputNumberUi] = useUiContext<InputNumberUiSlot>('InputNumberUi');
