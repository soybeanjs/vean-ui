<script setup lang="ts">
import { useSlots } from 'vue';
import { useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import { useAlertUi } from './context';
import AlertClose from './alert-close.vue';
import AlertContent from './alert-content.vue';
import AlertDescription from './alert-description.vue';
import AlertRoot from './alert-root.vue';
import AlertTitle from './alert-title.vue';
import type { AlertCompactProps, AlertCompactEmits, AlertCompactSlots } from './types';

defineOptions({
  name: 'AlertCompact'
});

const props = withDefaults(defineProps<AlertCompactProps>(), {
  open: undefined
});

const emit = defineEmits<AlertCompactEmits>();

defineSlots<AlertCompactSlots>();

const slots = useSlots();

const forwardedProps = useOmitProps(props, [
  'title',
  'description',
  'icon',
  'closable',
  'contentProps',
  'titleProps',
  'descriptionProps',
  'closeProps'
]);

const ui = useAlertUi();
</script>

<template>
  <AlertRoot v-bind="forwardedProps" @update:open="emit('update:open', $event)">
    <slot name="leading">
      <Icon v-if="icon" :icon="icon" :class="ui.icon" />
    </slot>
    <AlertContent v-bind="contentProps">
      <AlertTitle v-if="slots.title || title" v-bind="titleProps">
        <slot name="title">{{ title }}</slot>
      </AlertTitle>
      <AlertDescription v-if="slots.description || description" v-bind="descriptionProps">
        <slot name="description">{{ description }}</slot>
      </AlertDescription>
      <slot />
    </AlertContent>
    <slot name="trailing" />
    <AlertClose v-if="closable" v-bind="closeProps" @close="emit('close', $event)">
      <slot name="close">
        <Icon icon="lucide:x" />
      </slot>
    </AlertClose>
  </AlertRoot>
</template>
