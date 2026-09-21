<script setup lang="ts">
import { useOmitProps } from '@vean/aria/composables';
import { SplitterResizeHandle } from '@vean/aria/splitter';
import type { SplitterResizeHandleProps, SplitterResizeHandleEmits } from './types';

defineOptions({
  name: 'SSplitterResizeHandle'
});

const props = defineProps<SplitterResizeHandleProps>();

const emit = defineEmits<SplitterResizeHandleEmits>();

const forwardedProps = useOmitProps(props, ['class', 'withHandle']);
</script>

<template>
  <SplitterResizeHandle v-bind="forwardedProps" :class="props.class" @dragging="emit('dragging', $event)">
    <slot v-if="$slots.default" />
    <div
      v-else-if="withHandle"
      class="bg-background z-10 flex h-4 w-3 items-center justify-center rounded-xs border border-border"
      aria-hidden="true"
    >
      <div class="flex flex-col items-center gap-0.5">
        <span class="h-0.75 w-0.75 rounded-full bg-muted-foreground/70" />
        <span class="h-0.75 w-0.75 rounded-full bg-muted-foreground/70" />
        <span class="h-0.75 w-0.75 rounded-full bg-muted-foreground/70" />
      </div>
    </div>
  </SplitterResizeHandle>
</template>
