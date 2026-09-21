<script setup lang="ts">
import { computed, ref, useAttrs, watchEffect } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import type { Align } from '@vean/aria/types';
import Icon from '../icon/icon.vue';
import Button from './button.vue';
import type { ButtonLoadingProps } from './types';

defineOptions({
  name: 'SButtonLoading',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ButtonLoadingProps>(), {
  loadingIcon: 'svg-spinners:270-ring',
  loadingPosition: 'start' as Align
});

const attrs = useAttrs();

const internalLoading = ref(false);

const disabled = computed(() => props.disabled || internalLoading.value);

// Announce the busy state to assistive tech; the loading icon itself is decorative
// (aria-hidden) because `aria-busy` already conveys the state.
const ariaBusy = computed(() => (internalLoading.value ? true : undefined));

const onClick = async (event: MouseEvent) => {
  const clickHandlers = Array.isArray(attrs.onClick) ? attrs.onClick : [attrs.onClick];

  if (!props.autoLoading) {
    clickHandlers.forEach(handler => handler?.(event));
    return;
  }

  internalLoading.value = true;

  try {
    clickHandlers.forEach(handler => handler?.(event));
  } finally {
    if (props.loadingDuration) {
      await new Promise(resolve => {
        setTimeout(resolve, props.loadingDuration);
      });
    }
    internalLoading.value = false;
  }
};

const forwardedProps = useOmitProps(
  props,
  ['loading', 'loadingText', 'loadingDuration', 'autoLoading', 'loadingIcon', 'loadingIconProps', 'loadingPosition'],
  attrs,
  { onClick }
);

watchEffect(() => {
  internalLoading.value = props.loading;
});
</script>

<template>
  <Button v-bind="forwardedProps" class="relative" :disabled="disabled" :aria-busy="ariaBusy" @click="onClick">
    <template #leading>
      <Icon
        v-if="internalLoading && loadingPosition === 'start'"
        :icon="loadingIcon"
        :aria-hidden="true"
        v-bind="loadingIconProps"
      />
      <slot v-else name="leading" />
    </template>
    <span v-if="internalLoading && loadingPosition === 'center'" class="contents">
      <span class="absolute inset-0 z-1 flex items-center justify-center gap-1">
        <Icon :icon="loadingIcon" :aria-hidden="true" v-bind="loadingIconProps" />
        <span v-if="loadingText">{{ loadingText }}</span>
      </span>
      <span class="invisible contents">
        <slot :loading="internalLoading" />
      </span>
    </span>
    <slot v-else :loading="internalLoading" />
    <template #trailing>
      <Icon
        v-if="internalLoading && loadingPosition === 'end'"
        :icon="loadingIcon"
        :aria-hidden="true"
        v-bind="loadingIconProps"
      />
      <slot v-else name="trailing" />
    </template>
  </Button>
</template>
