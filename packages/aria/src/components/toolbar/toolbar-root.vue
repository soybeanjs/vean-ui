<script setup lang="ts">
import { computed } from 'vue';
import { toContext } from '../../shared';
import { useRovingFocusGroup } from '../../composables';
import { Primitive } from '../primitive';
import { provideToolbarRootContext, useToolbarUi } from './context';
import type { ToolbarRootProps } from './types';

defineOptions({
  name: 'ToolbarRoot'
});

const props = withDefaults(defineProps<ToolbarRootProps>(), {
  orientation: 'horizontal'
});

const cls = useToolbarUi('root');

const { setContainerElement, groupProps } = useRovingFocusGroup({
  ...toContext(props, ['orientation', 'dir', 'loop']),
  currentTabStopId: computed(() => undefined),
  defaultCurrentTabStopId: computed(() => undefined),
  preventScrollOnEntryFocus: computed(() => false)
});

provideToolbarRootContext(toContext(props, ['orientation', 'dir']));
</script>

<template>
  <Primitive
    v-bind="groupProps"
    :ref="setContainerElement"
    :as="as"
    :as-child="asChild"
    data-vean-toolbar-root
    :class="cls"
    role="toolbar"
    :aria-orientation="orientation"
    :data-orientation="orientation"
  >
    <slot />
  </Primitive>
</template>
