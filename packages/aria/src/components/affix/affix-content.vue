<script setup lang="ts">
import { useAffixRootContext, useAffixUi } from './context';
import type { AffixContentProps } from './types';

defineOptions({
  name: 'AffixContent'
});

defineProps<AffixContentProps>();

const cls = useAffixUi('content');
const { affixed, affixStyle, dataState, setContentElement } = useAffixRootContext('AffixContent');
</script>

<template>
  <div :ref="setContentElement" data-vean-affix-content :class="cls" :data-state="dataState" :style="affixStyle">
    <slot :affixed="affixed" />
  </div>
</template>
