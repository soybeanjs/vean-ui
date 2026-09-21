<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps, useRovingFocusGroupItem } from '../../composables';
import Icon from '../_icon/icon.vue';
import Link from '../link/link.vue';
import { useToolbarUi } from './context';
import type { ToolbarLinkProps } from './types';

defineOptions({
  name: 'ToolbarLink'
});

const props = withDefaults(defineProps<ToolbarLinkProps>(), {
  showIcon: true
});

const ui = useToolbarUi();

const forwardedProps = useOmitProps(props, ['class']);

const focusable = computed(() => !props.disabled && props.tabindex !== '-1' && props.tabindex !== -1);

const { setItemElement, itemProps } = useRovingFocusGroupItem({ focusable });

const linkBindings = computed(() => ({ ...forwardedProps.value, ...itemProps.value }));

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== ' ' || props.disabled) {
    return;
  }

  event.preventDefault();
  (event.currentTarget as HTMLElement | null)?.click();
};
</script>

<template>
  <Link
    v-slot="slotProps"
    :ref="setItemElement"
    v-bind="linkBindings"
    data-vean-toolbar-link
    :class="ui.link"
    @keydown="onKeyDown"
  >
    <slot />
    <Icon v-if="props.showIcon && slotProps.isHref" icon="lucide:arrow-up-right" :class="ui.linkIcon" />
  </Link>
</template>
