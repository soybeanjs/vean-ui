<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { useListUi } from './context';
import type { ListItemProps, ListItemSlots } from './types';

defineOptions({
  name: 'SListItem'
});

const props = defineProps<ListItemProps>();

const slots = defineSlots<ListItemSlots>();

const forwardedProps = useOmitProps(props, [
  'class',
  'title',
  'description',
  'contentProps',
  'titleProps',
  'descriptionProps'
]);

const itemUi = useListUi('item');
const contentUi = useListUi('content');
const titleUi = useListUi('title');
const descriptionUi = useListUi('description');

const itemClass = computed(() => [itemUi.value, props.class]);
</script>

<template>
  <li v-bind="forwardedProps" data-vean-list-item :class="itemClass">
    <slot name="leading" />
    <div v-bind="contentProps" data-vean-list-content :class="contentUi">
      <h3 v-if="slots.title || title" v-bind="titleProps" data-vean-list-title :class="titleUi">
        <slot name="title">{{ title }}</slot>
      </h3>
      <p
        v-if="slots.description || description"
        v-bind="descriptionProps"
        data-vean-list-description
        :class="descriptionUi"
      >
        <slot name="description">{{ description }}</slot>
      </p>
      <slot />
    </div>
    <slot name="trailing" />
  </li>
</template>
