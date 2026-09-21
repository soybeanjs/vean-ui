<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleMessages } from '@vean/aria';
import { useControllableState } from '@vean/aria/composables';
import { tagVariants } from '@/styles/tag';
import Icon from '../icon/icon.vue';
import type { TagProps, TagEmits } from './types';

defineOptions({
  name: 'STag'
});

const props = withDefaults(defineProps<TagProps>(), {
  open: undefined
});

const emit = defineEmits<TagEmits>();

const messages = useLocaleMessages();

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  true
);

const close = () => {
  open.value = false;
};

const closeLabel = computed(() =>
  props.content
    ? messages.value.tag.remove.replace('{label}', props.content)
    : messages.value.tag.remove.replace(' {label}', '')
);

const cls = computed(() =>
  tagVariants(
    {
      color: props.color,
      size: props.size,
      variant: props.variant,
      shape: props.shape
    },
    props.class
  )
);
</script>

<template>
  <div v-if="open" data-vean-tag :class="cls">
    <slot name="leading" />
    <slot>{{ content }}</slot>
    <slot name="trailing" />
    <slot v-if="closable" name="close" :close="close">
      <button
        type="button"
        class="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-inherit"
        :aria-label="closeLabel"
        @click="close"
      >
        <Icon icon="lucide:x" />
      </button>
    </slot>
  </div>
</template>
