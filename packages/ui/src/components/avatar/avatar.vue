<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { AvatarCompact, provideAvatarUi } from '@vean/aria/avatar';
import { useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { avatarVariants } from '@/styles/avatar';
import type { AvatarProps, AvatarEmits } from './types';

defineOptions({
  name: 'SAvatar'
});

const props = defineProps<AvatarProps>();

const emit = defineEmits<AvatarEmits>();

const slots = useSlots();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => avatarVariants({ size: props.size }, props.ui, { root: props.class }));

provideAvatarUi(ui);
</script>

<template>
  <AvatarCompact v-bind="forwardedProps" @loading-status-change="emit('loadingStatusChange', $event)">
    <template v-for="slotName in slotNames" #[slotName]>
      <slot :name="slotName" />
    </template>
  </AvatarCompact>
</template>
