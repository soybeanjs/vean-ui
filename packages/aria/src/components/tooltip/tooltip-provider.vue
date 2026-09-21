<script setup lang="ts">
import { computed, inject } from 'vue';
import { CONFIG_PROVIDER_CONTEXT_KEY } from '../../constants/attr';
import { fromContext, toContext } from '../../shared';
import { providePopperDelayGroup } from '../popper';
import { PROVIDER_CONFIG_KEYS, createDefaultTooltipConfig, pickDefinedConfig } from './shared';
import { provideTooltipProviderContext, useTooltipProviderContext } from './context';
import type { TooltipProviderProps } from './types';

defineOptions({
  name: 'TooltipProvider',
  inheritAttrs: false
});

const props = defineProps<TooltipProviderProps>();

const globalConfig = inject<{ tooltip?: Partial<TooltipProviderProps> }>(CONFIG_PROVIDER_CONTEXT_KEY);
const parent = useTooltipProviderContext();

// Resolution chain: prop → ancestor provider → ConfigProvider global → defaults. A missing
// ancestor snapshots to an empty object whose keys are filled from the next layer.
const config = computed(() => ({
  ...createDefaultTooltipConfig(globalConfig?.tooltip),
  ...pickDefinedConfig(fromContext(parent)),
  ...pickDefinedConfig(props)
}));

provideTooltipProviderContext(toContext(config, [...PROVIDER_CONFIG_KEYS]));

// Sibling tooltips share one skip-delay window (the FloatingDelayGroup pattern); the
// per-root hover machines inside Popper read this group instead of their own state.
providePopperDelayGroup({
  skipDelayDuration: computed(() => config.value.skipDelayDuration)
});
</script>

<template>
  <slot />
</template>
