<script setup lang="ts" generic="M extends boolean = false">
import { useForwardListeners, useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import ColorSwatchPickerItemIndicator from './color-swatch-picker-item-indicator.vue';
import ColorSwatchPickerItemSwatch from './color-swatch-picker-item-swatch.vue';
import ColorSwatchPickerItem from './color-swatch-picker-item.vue';
import ColorSwatchPickerRoot from './color-swatch-picker-root.vue';
import type {
  ColorSwatchPickerCompactProps,
  ColorSwatchPickerCompactEmits,
  ColorSwatchPickerCompactSlots
} from './types';

defineOptions({
  name: 'ColorSwatchPickerCompact'
});

const props = defineProps<ColorSwatchPickerCompactProps<M>>();

const emit = defineEmits<ColorSwatchPickerCompactEmits<M>>();

defineSlots<ColorSwatchPickerCompactSlots<M>>();

const forwardedProps = useOmitProps(props, ['colors', 'itemProps', 'indicatorProps', 'swatchProps']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <ColorSwatchPickerRoot v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <template v-if="colors?.length">
      <ColorSwatchPickerItem
        v-for="color in colors"
        :key="color"
        :value="color"
        v-bind="itemProps"
        @select="emit('select', $event)"
      >
        <ColorSwatchPickerItemSwatch v-bind="swatchProps">
          <slot name="swatch" :color="color" />
        </ColorSwatchPickerItemSwatch>
        <ColorSwatchPickerItemIndicator v-bind="indicatorProps">
          <slot name="indicator" :color="color">
            <Icon icon="lucide:check" />
          </slot>
        </ColorSwatchPickerItemIndicator>
      </ColorSwatchPickerItem>
    </template>
    <slot v-else v-bind="slotProps" />
  </ColorSwatchPickerRoot>
</template>
