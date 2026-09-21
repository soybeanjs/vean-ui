<script setup lang="ts">
import { computed } from 'vue';
import { isFormControl } from '../../shared';
import { useForwardElement } from '../../composables';
import Button from '../button/button.vue';
import ColorSwatchCompact from '../color-swatch/color-swatch-compact.vue';
import { VisuallyHiddenInput } from '../visually-hidden';
import { useColorPickerRootContext, useColorPickerUi } from './context';
import type { ColorPickerTriggerProps } from './types';

defineOptions({
  name: 'ColorPickerTrigger'
});

const props = defineProps<ColorPickerTriggerProps>();

const [triggerElement, setTriggerElement] = useForwardElement();

const { color, hexValue, formattedValue, displayFormat, name, disabled, required } =
  useColorPickerRootContext('ColorPickerTrigger');

const ui = useColorPickerUi();

const formControl = computed(() => isFormControl(triggerElement.value));

const isDisabled = computed(() => disabled.value || props.disabled);
</script>

<template>
  <Button
    v-bind="props"
    :ref="setTriggerElement"
    data-vean-color-picker-trigger
    :class="ui.trigger"
    :disabled="isDisabled"
  >
    <slot :color="color" :hex-value="hexValue" :formatted-value="formattedValue" :display-format="displayFormat">
      <ColorSwatchCompact :color="hexValue" :class="ui.triggerSwatch" />
      <span :class="ui.triggerValue">{{ formattedValue }}</span>
    </slot>

    <VisuallyHiddenInput
      v-if="formControl && name"
      type="text"
      :value="formattedValue"
      :name="name"
      :disabled="isDisabled"
      :required="required"
    />
  </Button>
</template>
