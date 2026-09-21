<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import Link from '../link/link.vue';
import { EVENT_ROOT_CONTENT_DISMISS, LINK_DISMISSED, LINK_SELECT } from './shared';
import { useCollectionItem, useNavMenuRootContext, useNavMenuUi } from './context';
import type { NavMenuLinkProps, NavMenuLinkEmits } from './types';

defineOptions({
  name: 'NavMenuLink'
});

const props = defineProps<NavMenuLinkProps>();

const emit = defineEmits<NavMenuLinkEmits>();

const { modelValue } = useNavMenuRootContext('NavMenuLink');

const ui = useNavMenuUi();

// Submenu links (rendered inside a sub list) use the `subLink` slot; root-level links use
// `link` — so a `subLink` UI override (e.g. a fixed width) applies to sub items only.
const cls = computed(() => ui.value?.[props.sub ? 'subLink' : 'link']);

const { setItemElement } = useCollectionItem();

const forwardedProps = useOmitProps(props, ['selected', 'sub']);

const onClick = async (event: MouseEvent) => {
  const linkSelectEvent = new CustomEvent(LINK_SELECT, {
    bubbles: true,
    cancelable: true,
    detail: {
      originalEvent: event
    }
  });

  emit('select', linkSelectEvent);

  if (linkSelectEvent.defaultPrevented || event.metaKey) return;

  // when the menu is closed the click targets an as-child trigger; let the trigger
  // handle opening instead of dismissing a menu that is already closed
  if (!modelValue.value) return;

  // mark the shared event so a sibling trigger listener skips re-opening after dismissal
  (event as unknown as Record<string, unknown>)[LINK_DISMISSED] = true;

  const dismissEvent = new CustomEvent(EVENT_ROOT_CONTENT_DISMISS, {
    bubbles: true,
    cancelable: true
  });
  event.target?.dispatchEvent(dismissEvent);
};
</script>

<template>
  <Link
    v-slot="slotProps"
    v-bind="forwardedProps"
    :ref="setItemElement"
    data-vean-nav-menu-link
    data-vean-collection-item
    :class="cls"
    :data-selected="Boolean(selected)"
    :aria-current="selected ? 'page' : undefined"
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Link>
</template>
