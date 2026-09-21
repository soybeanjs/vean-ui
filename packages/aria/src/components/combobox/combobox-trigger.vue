<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useExposedElement } from '../../composables';
import { Primitive } from '../primitive';
import { useComboboxRootContext, useComboboxUi } from './context';
import type { ComboboxTriggerProps } from './types';

defineOptions({
  name: 'ComboboxTrigger'
});

const props = withDefaults(defineProps<ComboboxTriggerProps>(), {
  as: 'button'
});

const {
  open,
  disabled: rootDisabled,
  contentId,
  initContentId,
  onOpenChange,
  onTriggerElementChange
} = useComboboxRootContext('ComboboxTrigger');

const [_, setTriggerElement] = useExposedElement(onTriggerElementChange);

const cls = useComboboxUi('trigger');
const triggerIconCls = useComboboxUi('triggerIcon');

onMounted(() => {
  initContentId();
});

const disabled = computed(() => props.disabled || rootDisabled.value || false);
const tag = computed(() => (props.as === 'button' ? 'button' : undefined));
const onClick = () => {
  if (disabled.value) {
    return;
  }

  onOpenChange(!open.value);
};
</script>

<template>
  <Primitive
    :ref="setTriggerElement"
    :as="as"
    :as-child="asChild"
    data-vean-combobox-trigger
    :class="cls"
    :type="tag"
    aria-haspopup="listbox"
    :aria-expanded="open || false"
    :aria-controls="contentId || undefined"
    :aria-disabled="disabled || undefined"
    :data-state="open ? 'open' : 'closed'"
    :data-disabled="disabled ? '' : undefined"
    :data-normal="disabled ? undefined : ''"
    :disabled="disabled"
    tabindex="-1"
    @click="onClick"
  >
    <slot :trigger-icon-class="triggerIconCls" />
  </Primitive>
</template>
