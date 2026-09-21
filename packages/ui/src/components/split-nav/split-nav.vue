<script setup lang="ts" generic="T extends SplitNavBaseOptionData = SplitNavBaseOptionData">
import { computed, useAttrs } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { SplitNavRoot, provideSplitNavUi } from '@vean/aria/split-nav';
import type { SplitNavBaseOptionData } from '@vean/aria/split-nav';
import { provideTreeMenuUi } from '@vean/aria/tree-menu';
import { provideTreeNavUi } from '@vean/aria/tree-nav';
import { splitNavVariants } from '@/styles/split-nav';
import { treeMenuVariants } from '@/styles/tree-menu';
import { treeNavVariants } from '@/styles/tree-nav';
import { provideMenuUi } from '../menu/context';
import type { SplitNavProps, SplitNavEmits, SplitNavSlots } from './types';

defineOptions({
  name: 'SSplitNav',
  inheritAttrs: false
});

const props = withDefaults(defineProps<SplitNavProps<T>>(), {
  mode: 'dual-vertical',
  collapsed: undefined
});

const emit = defineEmits<SplitNavEmits<T>>();

const slots = defineSlots<SplitNavSlots<T>>();

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui'], attrs);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => splitNavVariants({ size: props.size }, props.ui, { verticalPane: props.class }));

const treeUi = computed(() => treeMenuVariants({ size: props.size }));

const treeNavUi = computed(() => treeNavVariants({ size: props.size }, { root: 'w-full' }));

provideSplitNavUi(ui);
provideTreeMenuUi(treeUi);
provideTreeNavUi(treeNavUi);
provideMenuUi(() => ({ size: props.size }));
</script>

<template>
  <SplitNavRoot v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <!-- @vue-expect-error ignore slot type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </SplitNavRoot>
</template>
