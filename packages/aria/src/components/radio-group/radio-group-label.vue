<script setup lang="ts">
import { computed } from 'vue';
import { Label } from '../label';
import { useRadioGroupItemContext, useRadioGroupUi } from './context';
import type { RadioGroupLabelProps } from './types';

defineOptions({
  name: 'RadioGroupLabel'
});

const props = defineProps<RadioGroupLabelProps>();

const cls = useRadioGroupUi('label');

const { controlId } = useRadioGroupItemContext('RadioGroupLabel');

const id = computed(() => props.for || controlId.value);
</script>

<template>
  <Label data-vean-radio-group-label :for="id" :class="cls">
    <slot />
  </Label>
</template>
