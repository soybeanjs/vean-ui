<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { usePaginationRootContext, usePaginationUi } from './context';
import type { PaginationButtonProps } from './types';

defineOptions({
  name: 'PaginationPrev'
});

const props = defineProps<PaginationButtonProps>();

const { page, onPageChange, disabled } = usePaginationRootContext('PaginationPrev');

const cls = usePaginationUi('prev');
const messages = useLocaleMessages();

const isDisabled = computed(() => disabled.value || page.value === 1);

const onClick = () => {
  onPageChange(page.value - 1);
};
</script>

<template>
  <Button
    v-bind="props"
    data-vean-pagination-prev
    data-vean-pagination-action
    :class="cls"
    :disabled="isDisabled"
    :aria-label="messages.pagination.prevPage"
    @click="onClick"
  >
    <slot>{{ messages.pagination.prevPage }}</slot>
  </Button>
</template>
