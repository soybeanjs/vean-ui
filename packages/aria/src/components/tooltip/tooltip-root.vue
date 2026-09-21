<script setup lang="ts">
import { computed, inject, useId } from 'vue';
import { CONFIG_PROVIDER_CONTEXT_KEY } from '../../constants/attr';
import { fromContext, pick, toContext } from '../../shared';
import { PopperRoot } from '../popper';
import type { PopperOpenChangeReason } from '../popper/types';
import { PROVIDER_CONFIG_KEYS, ROOT_RESOLVE_KEYS, createDefaultTooltipConfig, pickDefinedConfig } from './shared';
import { provideTooltipProviderContext, provideTooltipRootContext, useTooltipProviderContext } from './context';
import type { TooltipProviderProps, TooltipRootProps, TooltipRootEmits } from './types';

defineOptions({
  name: 'TooltipRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<TooltipRootProps>(), {
  defaultOpen: false,
  open: undefined
});

const emit = defineEmits<TooltipRootEmits>();

// Without an ancestor `TooltipProvider`, fall back to a local config-only provider backed by
// the global config; the per-root hover machine inside Popper then owns the skip-delay state.
const globalConfig = inject<{ tooltip?: Partial<TooltipProviderProps> }>(CONFIG_PROVIDER_CONTEXT_KEY);
const globalTooltipConfig = computed(() => createDefaultTooltipConfig(globalConfig?.tooltip));
const inheritedProvider = useTooltipProviderContext();
const provider =
  inheritedProvider ?? provideTooltipProviderContext(toContext(globalTooltipConfig, [...PROVIDER_CONFIG_KEYS]));

// Resolution chain: prop → provider (ancestor `TooltipProvider` or global config) → defaults.
// `skipDelayDuration` is owned by the provider's popper delay group, not resolved per root.
const resolved = computed(() => ({
  ...fromContext(provider, [...ROOT_RESOLVE_KEYS]),
  ...pickDefinedConfig(pick(props, [...ROOT_RESOLVE_KEYS]))
}));

provideTooltipRootContext({
  ...toContext(resolved, [...ROOT_RESOLVE_KEYS]),
  popupId: `vean-tooltip-popup-${useId()}`,
  provider
});

function onUpdateOpen(value: boolean, reason?: PopperOpenChangeReason) {
  emit('update:open', value, reason);
}
</script>

<template>
  <PopperRoot
    :dir="dir"
    :modal="false"
    :disabled="props.disabled ?? provider.disabled.value"
    :open="props.open"
    :default-open="defaultOpen"
    @update:open="onUpdateOpen"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopperRoot>
</template>
