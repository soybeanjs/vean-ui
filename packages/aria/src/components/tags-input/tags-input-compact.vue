<script setup lang="ts">
import { useOmitProps, useForwardListeners } from '../../composables';
import TagsInputClear from './tags-input-clear.vue';
import TagsInputControl from './tags-input-control.vue';
import TagsInputItemDelete from './tags-input-item-delete.vue';
import TagsInputItemText from './tags-input-item-text.vue';
import TagsInputItem from './tags-input-item.vue';
import TagsInputRoot from './tags-input-root.vue';
import type { TagsInputCompactProps, TagsInputCompactEmits, TagsInputCompactSlots } from './types';

defineOptions({
  name: 'TagsInputCompact'
});

const props = withDefaults(defineProps<TagsInputCompactProps>(), {
  clearable: true
});

const emit = defineEmits<TagsInputCompactEmits>();

defineSlots<TagsInputCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'clearable',
  'controlProps',
  'clearProps',
  'itemProps',
  'itemTextProps',
  'itemDeleteProps'
]);

const listeners = useForwardListeners(emit);
</script>

<template>
  <TagsInputRoot v-slot="{ modelValue, clear }" v-bind="forwardedProps" v-on="listeners">
    <template v-for="(value, index) in modelValue" :key="`${index}-${value}`">
      <TagsInputItem v-slot="{ onDelete, displayedValue }" v-bind="itemProps" :value="value">
        <slot
          name="item"
          :value="value"
          :index="index"
          :displayed-value="displayedValue"
          :on-delete="onDelete"
          :on-clear="clear"
        >
          <TagsInputItemText v-bind="itemTextProps" />
          <TagsInputItemDelete v-bind="itemDeleteProps" />
        </slot>
      </TagsInputItem>
    </template>
    <TagsInputControl v-bind="controlProps" />
    <TagsInputClear v-if="clearable" v-bind="clearProps" />
  </TagsInputRoot>
</template>
