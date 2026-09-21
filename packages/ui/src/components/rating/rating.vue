<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { RatingItem, RatingRoot } from '@vean/aria/rating';
import type { RatingItemState } from '@vean/aria/rating';
import { ratingItemVariants, ratingVariants } from '@/styles/rating';
import { SIcon } from '../icon';
import type { RatingProps, RatingEmits } from './types';

defineOptions({
  name: 'SRating'
});

const props = defineProps<RatingProps>();

const emit = defineEmits<RatingEmits>();

defineSlots<{
  icon?: (props: { index: number; value: number; state: RatingItemState }) => any;
}>();

const listeners = useForwardListeners(emit);

const forwardedProps = useOmitProps(props, ['class', 'color', 'size', 'variant']);

const rootCls = computed(() => ratingVariants({ size: props.size }, props.class));

const itemCls = computed(() => ratingItemVariants({ size: props.size, color: props.color, variant: props.variant }));

const max = computed(() => (typeof props.max === 'number' && props.max > 0 ? Math.floor(props.max) : 5));

const items = computed(() => Array.from({ length: max.value }, (_, index) => index));
</script>

<template>
  <RatingRoot v-bind="forwardedProps" :class="rootCls" v-on="listeners">
    <RatingItem v-for="index in items" :key="index" v-slot="{ state }" :index="index" :class="itemCls">
      <slot name="icon" :index="index" :value="index + 1" :state="state">
        <SIcon icon="lucide:star" class="h-full w-full text-muted-foreground/40" />
        <span
          :data-state="state"
          class="absolute inset-0 data-[state=half]:[clip-path:inset(0_50%_0_0)] data-[state=empty]:[clip-path:inset(0_100%_0_0)]"
        >
          <SIcon icon="lucide:star" class="h-full w-full" />
        </span>
      </slot>
    </RatingItem>
  </RatingRoot>
</template>
