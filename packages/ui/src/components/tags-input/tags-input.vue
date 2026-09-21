<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { TagsInputCompact, provideTagsInputUi } from '@vean/aria/tags-input';
import { tagsInputVariants } from '@/styles/tags-input';
import type { TagsInputProps, TagsInputEmits, TagsInputSlots } from './types';

defineOptions({
  name: 'STagsInput'
});

const props = defineProps<TagsInputProps>();

const emit = defineEmits<TagsInputEmits>();

const slots = defineSlots<TagsInputSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const ui = computed(() => tagsInputVariants({ size: props.size }, props.ui, { root: props.class }));

provideTagsInputUi(ui);
</script>

<template>
  <TagsInputCompact v-bind="forwardedProps" v-on="listeners">
    <template v-if="slots.item" #item="slotProps">
      <slot name="item" v-bind="slotProps" />
    </template>
  </TagsInputCompact>
</template>
