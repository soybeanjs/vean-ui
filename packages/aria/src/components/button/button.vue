<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import type { ButtonProps, ButtonEmits } from './types';

defineOptions({
  name: 'Button'
});

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button'
});

const emit = defineEmits<ButtonEmits>();

const disabled = computed(() => (props.as === 'button' ? props.disabled : undefined));

const forwardedProps = useOmitProps(props, ['disabled', 'type'], () => (disabled.value ? { tabindex: '-1' } : {}));

const dataDisabled = computed(() => (props.disabled ? '' : undefined));

const dataNormal = computed(() => (props.disabled ? undefined : ''));

const ariaDisabled = computed(() => (props.disabled ? true : undefined));

const buttonType = computed(() => {
  if (props.as !== 'button') return undefined;

  return props.type ?? 'button';
});

const onClick = (event: PointerEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();

    return;
  }

  emit('click', event);
};
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    data-vean-button
    :disabled="disabled"
    :aria-disabled="ariaDisabled"
    :data-disabled="dataDisabled"
    :data-normal="dataNormal"
    :type="buttonType"
    @click="onClick"
  >
    <slot />
  </Primitive>
</template>
