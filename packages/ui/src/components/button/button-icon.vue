<script setup lang="ts">
import { useOmitProps } from '@vean/aria/composables';
import Icon from '../icon/icon.vue';
import Button from './button.vue';
import type { ButtonIconProps } from './types';

defineOptions({
  name: 'SButtonIcon'
});

const props = withDefaults(defineProps<ButtonIconProps>(), {
  color: 'accent',
  variant: 'ghost',
  shape: 'square',
  fitContent: true
});

const forwardedProps = useOmitProps(props, ['icon', 'iconClass', 'iconProps']);
</script>

<template>
  <Button v-bind="forwardedProps">
    <Icon v-bind="iconProps" :icon="icon" :class="iconClass" />
  </Button>
</template>
