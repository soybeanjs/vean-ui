<script setup lang="ts">
import { useAffixRootContext, useAffixUi } from './context';
import type { AffixPlaceholderProps } from './types';

defineOptions({
  name: 'AffixPlaceholder'
});

defineProps<AffixPlaceholderProps>();

const cls = useAffixUi('placeholder');

const { affixed, placeholderStyle } = useAffixRootContext('AffixPlaceholder');
</script>

<template>
  <div
    v-if="affixed"
    data-vean-affix-placeholder
    :class="cls"
    aria-hidden="true"
    role="presentation"
    :style="placeholderStyle"
  />
</template>
