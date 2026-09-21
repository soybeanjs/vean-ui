<script setup lang="ts">
import { useOmitProps, usePickProps } from '@vean/aria/composables';
import Link from '../link/link.vue';
import Button from './button.vue';
import type { ButtonLinkProps } from './types';

defineOptions({
  name: 'SButtonLink'
});

const props = withDefaults(defineProps<ButtonLinkProps>(), {
  variant: 'link',
  external: undefined,
  prefetch: undefined,
  noPrefetch: undefined,
  noRel: undefined,
  viewTransition: undefined,
  replace: undefined,
  disabled: undefined
});

const propKeys = ['class', 'color', 'size', 'variant', 'shape', 'shadow', 'fitContent'] as const;

const buttonProps = usePickProps(props, [...propKeys]);

const linkProps = useOmitProps(props, [...propKeys]);
</script>

<template>
  <Button v-bind="buttonProps" :disabled="disabled" as-child>
    <Link v-slot="slotProps" v-bind="linkProps">
      <slot v-bind="slotProps" />
    </Link>
  </Button>
</template>
