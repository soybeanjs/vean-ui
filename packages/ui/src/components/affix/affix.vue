<script setup lang="ts">
import { computed } from 'vue';
import { AffixCompact, provideAffixUi } from '@vean/aria/affix';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { affixVariants } from '@/styles/affix';
import type { AffixProps, AffixEmits } from './types';

defineOptions({
  name: 'SAffix'
});

const props = defineProps<AffixProps>();

const emit = defineEmits<AffixEmits>();

const forwardedProps = useOmitProps(props, ['class', 'ui']);

const listeners = useForwardListeners(emit);

const ui = computed(() => affixVariants(undefined, props.ui, { content: props.class }));

provideAffixUi(ui);
</script>

<template>
  <AffixCompact v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <slot v-bind="slotProps" />
  </AffixCompact>
</template>
