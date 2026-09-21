<script setup lang="ts">
import { computed, inject, resolveComponent, useAttrs } from 'vue';
import { CONFIG_PROVIDER_CONTEXT_KEY } from '../../constants/attr';
import type { ConfigProviderContext } from '../config-provider/types';
import { Primitive } from '../primitive';
import type { LinkProps } from './types';

defineOptions({
  name: 'Link',
  inheritAttrs: false
});

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'a',
  external: undefined,
  prefetch: undefined,
  noPrefetch: undefined,
  noRel: undefined,
  viewTransition: undefined,
  replace: undefined,
  disabled: undefined,
  rel: 'noopener noreferrer'
});

type Slots = {
  default: (args: { isHref: boolean; isActive?: boolean; isExactActive?: boolean }) => any;
};

defineSlots<Slots>();

const attrs = useAttrs();

const config = inject<ConfigProviderContext>(CONFIG_PROVIDER_CONTEXT_KEY, {});

const resolvedRouterLink = resolveComponent('RouterLink');
const fallbackLink = typeof resolvedRouterLink === 'string' ? null : resolvedRouterLink;

// An injected `linkComponent` (via ConfigProvider) wins over the globally
// registered `RouterLink`, so the library can target Nuxt / custom link components.
const RouterLink = computed(() => config.linkComponent ?? fallbackLink);

const isHref = computed(() => {
  if (props.external || props.disabled) {
    return true;
  }

  if (typeof props.to === 'string' && props.to.startsWith('http')) {
    return true;
  }

  if (!props.to) {
    return true;
  }

  return false;
});

const renderA = computed(() => isHref.value || !RouterLink.value);

const target = computed(() => {
  if (props.target) {
    return props.target;
  }
  return isHref.value ? '_blank' : '_self';
});

const forwardedProps = computed(() => {
  const { as: _as, asChild: _asChild, href: _href, to: _to, ...rest } = props;

  const href = (typeof props.to === 'string' && props.to) || props.href;

  const result: Record<string, any> = {};

  if (!isHref.value) {
    result.to = props.to;
  }

  if (isHref.value && href) {
    result.href = href;
  }

  Object.assign(result, {
    ...rest,
    target: target.value,
    'data-disabled': props.disabled ? '' : undefined,
    'aria-disabled': props.disabled ? 'true' : undefined,
    role: props.disabled ? 'link' : undefined,
    tabindex: props.disabled ? '-1' : props.tabindex,
    ...attrs
  });

  return result;
});

const handleClick = (event: Event) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
  }
};
</script>

<template>
  <Primitive v-if="renderA" v-bind="forwardedProps" :as="as" :as-child="asChild" data-vean-link @click="handleClick">
    <slot :is-href="true" />
  </Primitive>
  <component :is="RouterLink" v-else v-slot="slotProps" v-bind="forwardedProps" data-vean-link @click="handleClick">
    <slot :is-href="false" :is-active="slotProps?.isActive" :is-exact-active="slotProps?.isExactActive" />
  </component>
</template>
