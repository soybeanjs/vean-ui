<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { usePageTabsUi, usePageTabsItemContext } from './context';
import type { PageTabsPinProps } from './types';

defineOptions({
  name: 'PageTabsPin'
});

const props = defineProps<PageTabsPinProps>();

const attrs = useAttrs();

const cls = usePageTabsUi('pin');

const { pinned, onPin } = usePageTabsItemContext('PageTabsPin');

const messages = useLocaleMessages();

const ariaLabel = computed(
  () =>
    (attrs['aria-label'] as string) ??
    (pinned.value ? messages.value.pageTabs.unpinTab : messages.value.pageTabs.pinTab)
);
</script>

<template>
  <Button
    v-if="pinned"
    v-bind="props"
    data-vean-page-tabs-pin
    :aria-label="ariaLabel"
    :class="cls"
    tabindex="-1"
    @click.stop="onPin"
  >
    <slot />
  </Button>
</template>
