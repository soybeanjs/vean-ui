<script setup lang="ts">
import { computed } from 'vue';
import { ProgressProvider, provideProgressProviderUi } from '@vean/aria/progress';
import type { ProgressProviderProps } from '@vean/aria/progress';
import { progressProviderVariants } from '@/styles/progress';

defineOptions({
  name: 'SProgressProvider'
});

const props = defineProps<ProgressProviderProps>();

const ui = computed(() => progressProviderVariants());

provideProgressProviderUi(ui);
</script>

<template>
  <ProgressProvider v-bind="props" />
</template>
