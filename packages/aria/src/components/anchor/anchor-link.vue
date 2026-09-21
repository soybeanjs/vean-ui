<script setup lang="ts">
import { computed, watch, onWatcherCleanup } from 'vue';
import { Primitive } from '../primitive';
import { useAnchorRootContext, useAnchorUi } from './context';
import type { AnchorLinkProps } from './types';

defineOptions({
  name: 'AnchorLink'
});

const props = withDefaults(defineProps<AnchorLinkProps>(), {
  as: 'a'
});

const cls = useAnchorUi('link');

const { activeHref, onLinkClick, registerLink, scrollTo, unregisterLink } = useAnchorRootContext('AnchorLink');

const active = computed(() => activeHref.value === props.href);
const dataDisabled = computed(() => (props.disabled ? '' : undefined));
const dataState = computed(() => (active.value ? 'active' : 'inactive'));

const onClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  onLinkClick(event, { href: props.href });

  if (!props.href.startsWith('#') || event.defaultPrevented) {
    return;
  }

  event.preventDefault();
  scrollTo(props.href);
};

watch(
  () => props.href,
  href => {
    registerLink(href);

    onWatcherCleanup(() => {
      unregisterLink(href);
    });
  },
  {
    immediate: true
  }
);
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-anchor-link
    :class="cls"
    :href="href"
    :target="target"
    :aria-current="active ? 'location' : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-disabled="dataDisabled"
    :data-state="dataState"
    :tabindex="disabled ? -1 : undefined"
    @click="onClick"
  >
    <slot />
  </Primitive>
</template>
