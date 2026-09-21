<script setup lang="ts">
import { ref, watch } from 'vue';
import { VisuallyHidden } from '../visually-hidden';
import { useSelectRootContext } from './context';
import type { SelectBubbleSelectProps } from './types';

defineOptions({
  name: 'SelectBubbleSelect'
});

const props = defineProps<SelectBubbleSelectProps>();

const { onModelValueChange } = useSelectRootContext('SelectBubbleSelect');

const selectElement = ref<HTMLElement>();

/**
 * Form autofill will trigger an `input` event on the `select` element.
 * We listen to that event and update our internal state to support it.
 */
const onInput = (event: Event) => {
  onModelValueChange((event.target as HTMLSelectElement).value);
};

// This would bubble "change" event to form, with the target as Select element.
watch(
  () => props.value,
  (cur, prev) => {
    if (!selectElement.value) return;
    if (cur === prev) return;

    const selectProto = window.HTMLSelectElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(selectProto, 'value') as PropertyDescriptor;
    const setValue = descriptor.set;
    if (!setValue) return;

    const event = new Event('change', { bubbles: true });
    setValue.call(selectElement.value, cur);
    selectElement.value.dispatchEvent(event);
  }
);

/**
 * We purposefully use a `select` here to support form autofill as much as possible.
 *
 * We purposefully do not add the `value` attribute here to allow the value to be set programmatically and bubble to any
 * parent form `onChange` event.
 *
 * We use `VisuallyHidden` rather than `display: "none"` because Safari autofill won't work otherwise.
 */
</script>

<template>
  <VisuallyHidden as-child>
    <select ref="selectElement" v-bind="props" data-vean-select-bubble-select @input="onInput">
      <slot />
    </select>
  </VisuallyHidden>
</template>
