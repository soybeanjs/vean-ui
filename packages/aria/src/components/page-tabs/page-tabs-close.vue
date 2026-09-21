<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { usePageTabsUi, usePageTabsItemContext } from './context';
import type { PageTabsCloseProps } from './types';

defineOptions({
  name: 'PageTabsClose'
});

const props = defineProps<PageTabsCloseProps>();

const attrs = useAttrs();

const cls = usePageTabsUi('close');

const { closable, onClose } = usePageTabsItemContext('PageTabsClose');

const messages = useLocaleMessages();

const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? messages.value.pageTabs.closeTab);
</script>

<template>
  <Button
    v-if="closable"
    v-bind="props"
    data-vean-page-tabs-close
    :class="cls"
    :aria-label="ariaLabel"
    tabindex="-1"
    @click.stop="onClose"
  >
    <slot />
  </Button>
</template>
