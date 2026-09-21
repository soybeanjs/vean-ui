<script setup lang="ts">
import { useId } from 'vue';
import { useOmitProps } from '../../composables';
import { useTagsInputItemContext, useTagsInputUi } from './context';
import type { TagsInputItemTextProps } from './types';

defineOptions({
  name: 'TagsInputItemText'
});

const props = defineProps<TagsInputItemTextProps>();

const cls = useTagsInputUi('itemText');

const forwardedProps = useOmitProps(props, ['as', 'asChild']);

const { displayedValue, textId } = useTagsInputItemContext('TagsInputItemText');

const generatedTextId = `vean-tags-input-item-text-${useId()}`;

if (!textId.value) {
  textId.value = generatedTextId;
}
</script>

<template>
  <span v-bind="forwardedProps" :id="textId" data-vean-tags-input-item-text :class="cls">
    <slot>{{ displayedValue }}</slot>
  </span>
</template>
