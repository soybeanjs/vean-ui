<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { LayoutCompact, provideLayoutUi } from '@vean/aria/layout';
import { keysOf } from '@vean/aria/shared';
import { layoutVariants } from '@/styles/layout';
import { themeSizeMap, themeSizeRatio } from '@/theme';
import type { LayoutProps, LayoutEmits, LayoutSlots } from './types';

defineOptions({
  name: 'SLayout'
});

const props = withDefaults(defineProps<LayoutProps>(), {
  open: undefined,
  // Unset on purpose: the headless root then follows the viewport.
  isMobile: undefined,
  // Unset on purpose: an absent boolean prop is cast to `false` downstream, which
  // would turn the drawer into a controlled state that never opens.
  mobileOpen: undefined,
  size: 'md',
  defaultOpen: true,
  sidebarVisible: true,
  headerVisible: true,
  tabVisible: true,
  footerVisible: true,
  fixedTop: true
});

const emit = defineEmits<LayoutEmits>();

const slots = defineSlots<LayoutSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'pxToRem']);

const slotNames = computed(() => keysOf(slots).filter(name => name !== 'sidebar'));

const pxToRem = (px: number) => {
  if (props.pxToRem) {
    return props.pxToRem(px);
  }

  return (px * themeSizeRatio[props.size]) / themeSizeMap.md;
};

const ui = computed(() =>
  layoutVariants(
    {
      size: props.size,
      variant: props.variant,
      side: props.side,
      collapsible: props.collapsible,
      fullContent: props.fullContent
    },
    props.ui,
    { root: props.class }
  )
);

provideLayoutUi(ui);
</script>

<template>
  <LayoutCompact
    v-bind="forwardedProps"
    :px-to-rem="pxToRem"
    @update:open="emit('update:open', $event)"
    @update:mobile-open="emit('update:mobileOpen', $event)"
  >
    <template #sidebar="slotProps">
      <slot name="sidebar" v-bind="slotProps" />
    </template>
    <template v-for="name in slotNames" #[name]>
      <slot :name="name" />
    </template>
  </LayoutCompact>
</template>
