<script setup lang="ts">
import { useOmitProps } from '../../composables';
import AffixContent from './affix-content.vue';
import AffixPlaceholder from './affix-placeholder.vue';
import AffixRoot from './affix-root.vue';
import type { AffixCompactProps, AffixCompactEmits } from './types';

defineOptions({
  name: 'AffixCompact'
});

const props = defineProps<AffixCompactProps>();

const emit = defineEmits<AffixCompactEmits>();

const forwardedProps = useOmitProps(props, ['placeholderProps', 'contentProps']);

const handleChange = (affixed: boolean) => {
  emit('change', affixed);
};
</script>

<template>
  <AffixRoot v-bind="forwardedProps" @change="handleChange">
    <AffixPlaceholder v-bind="placeholderProps" />
    <AffixContent v-slot="slotProps" v-bind="contentProps">
      <slot v-bind="slotProps" />
    </AffixContent>
  </AffixRoot>
</template>
