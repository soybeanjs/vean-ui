<script setup lang="ts" generic="T extends PageTabsOptionData = PageTabsOptionData">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { PageTabsCompact, providePageTabsUi } from '@vean/aria/page-tabs';
import type { PageTabsOptionData } from '@vean/aria/page-tabs';
import { keysOf } from '@vean/aria/shared';
import { pageTabsVariants } from '@/styles/page-tabs';
import { provideMenuUi } from '../menu/context';
import type { PageTabsProps, PageTabsEmits, PageTabsSlots } from './types';

defineOptions({
  name: 'SPageTabs'
});

const props = withDefaults(defineProps<PageTabsProps<T>>(), {
  size: 'md',
  variant: 'chrome',
  loop: true
});

const emit = defineEmits<PageTabsEmits<T>>();

const slots = defineSlots<PageTabsSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'variant', 'ui', 'onClick', 'onContextmenu']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(name => name !== 'indicator'));

const ui = computed(() =>
  pageTabsVariants(
    {
      size: props.size,
      variant: props.variant
    },
    props.ui,
    { root: props.class }
  )
);

provideMenuUi(() => ({
  size: props.size
}));
providePageTabsUi(ui);
</script>

<template>
  <PageTabsCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <!-- @vue-expect-error ignore slot type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
    <template #indicator>
      <template v-if="variant === 'chrome'">
        <svg viewBox="0 0 8 8" :class="ui.chromeBgLeft">
          <path d="M 0 8 A 8 8 0 0 0 8 0 L 8 8 Z" />
        </svg>
        <svg viewBox="0 0 8 8" :class="ui.chromeBgRight">
          <path d="M 0 0 A 8 8 0 0 0 8 8 L 0 8 Z" />
        </svg>
      </template>

      <div v-if="variant === 'slider'" :class="ui.sliderIndicator"></div>
    </template>
  </PageTabsCompact>
</template>
