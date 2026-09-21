<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { getRatingItemState, getRatingValueFromPointer } from './shared';
import { useRatingRootContext } from './context';
import type { RatingItemProps } from './types';

defineOptions({
  name: 'RatingItem'
});

const props = defineProps<RatingItemProps>();

const context = useRatingRootContext('RatingItem');

const allowHalf = computed(() => !!context.allowHalf.value);
const disabled = computed(() => !!context.disabled.value);
const readonly = computed(() => !!context.readonly.value);
const dir = computed(() => context.dir.value ?? 'ltr');

const state = computed(() =>
  getRatingItemState(context.currentModelValue.value, context.hoverValue.value, props.index, allowHalf.value)
);

const value = computed(() => props.index + 1);

const dataDisabled = computed(() => (disabled.value ? '' : undefined));
const dataReadonly = computed(() => (readonly.value ? '' : undefined));

function getValueFromEvent(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

  return getRatingValueFromPointer(event, rect, props.index, allowHalf.value, dir.value);
}

function onPointerMove(event: PointerEvent) {
  if (disabled.value || readonly.value) return;

  context.setHover(getValueFromEvent(event));
}

function onPointerEnter() {
  if (disabled.value || readonly.value) return;

  context.setHover(props.index + 1);
}

function onClick(event: MouseEvent) {
  if (disabled.value || readonly.value) return;

  context.setValue(getValueFromEvent(event));
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-rating-item
    :data-state="state"
    :data-index="index"
    :data-disabled="dataDisabled"
    :data-readonly="dataReadonly"
    tabindex="-1"
    @pointermove="onPointerMove"
    @pointerenter="onPointerEnter"
    @click="onClick"
  >
    <slot :index="index" :value="value" :state="state" />
  </Primitive>
</template>
