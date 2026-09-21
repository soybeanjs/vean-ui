<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { usePaginationRootContext, usePaginationUi } from './context';
import type { PaginationButtonProps } from './types';

defineOptions({
  name: 'PaginationNext'
});

const props = defineProps<PaginationButtonProps>();

const { page, onPageChange, pageCount, disabled } = usePaginationRootContext('PaginationNext');

const cls = usePaginationUi('next');
const messages = useLocaleMessages();

const isDisabled = computed(() => disabled.value || page.value === pageCount.value);

const onClick = () => {
  onPageChange(page.value + 1);
};
</script>

<template>
  <Button
    v-bind="props"
    data-vean-pagination-next
    data-vean-pagination-action
    :class="cls"
    :disabled="isDisabled"
    :aria-label="messages.pagination.nextPage"
    @click="onClick"
  >
    <slot>{{ messages.pagination.nextPage }}</slot>
  </Button>
</template>
