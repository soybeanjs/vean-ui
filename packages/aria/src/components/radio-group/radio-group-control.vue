<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useAttrs, watchEffect } from 'vue';
import { getAriaLabel, handleAndDispatchCustomEvent, isFormControl } from '../../shared';
import { useForwardElement, useRovingFocusGroupItem } from '../../composables';
import type { NavigationKey, VNodeRef } from '../../types';
import Button from '../button/button.vue';
import { useRadioGroupItemContext, useRadioGroupRootContext, useRadioGroupUi } from './context';
import type { RadioGroupControlProps, RadioSelectEvent } from './types';

defineOptions({
  name: 'RadioGroupControl'
});

const props = defineProps<RadioGroupControlProps>();

const attrs = useAttrs();

const cls = useRadioGroupUi('control');

const [controlElement, setControlElement] = useForwardElement();
const rootContext = useRadioGroupRootContext('RadioGroupControl');
const { value, disabled, name, required, checked, dataState, onSelect, initControlId } =
  useRadioGroupItemContext('RadioGroupControl');

const { setItemElement, itemProps } = useRovingFocusGroupItem({
  focusable: computed(() => !disabled.value),
  active: checked
});

const formControl = computed(() => isFormControl(controlElement.value));
const ariaLabel = computed(() => getAriaLabel(controlElement.value, props.id, attrs['aria-label'] as string));

/** Arrow key constants for keyboard navigation */
const ARROW_KEYS: NavigationKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
/** Event name constant for radio selection */
const RADIO_SELECT = 'radio.select';

let isArrowKeyPressed = false;

function onKeyDown(event: KeyboardEvent) {
  if (ARROW_KEYS.includes(event.key as NavigationKey)) {
    isArrowKeyPressed = true;
  }
}

function onKeyUp() {
  isArrowKeyPressed = false;
}

function onClick(event: MouseEvent | KeyboardEvent) {
  const eventDetail = { originalEvent: event, value: value.value };

  handleAndDispatchCustomEvent(
    RADIO_SELECT,
    (selectEvent: RadioSelectEvent) => {
      onSelect(selectEvent);

      if (selectEvent?.defaultPrevented) return;

      rootContext.modelValue.value = value.value;

      if (formControl.value) {
        // if radio is in a form, stop propagation from the button so that we only propagate
        // one click event (from the input). We propagate changes from an input so that native
        // form validation works and form events reflect radio updates.
        event.stopPropagation();
      }
    },
    eventDetail
  );
}

function onFocus() {
  setTimeout(() => {
    /**
     * Our `RovingFocusGroup` will focus the radio when navigating with arrow keys and we need to 'check' it in that
     * case. We click it to 'check' it (instead of updating `context.value`) so that the radio change event fires.
     */
    if (isArrowKeyPressed) {
      controlElement.value?.click();
    }
  }, 0);
}

watchEffect(() => {
  if (props.id) {
    initControlId(props.id);
  }
});

function setControlRef(nodeRef: VNodeRef) {
  setControlElement(nodeRef);
  setItemElement(nodeRef);
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
});
</script>

<template>
  <Button
    :ref="setControlRef"
    v-bind="{ ...props, ...itemProps }"
    data-vean-radio-group-control
    :class="cls"
    role="radio"
    :disabled="disabled"
    :aria-checked="checked"
    :aria-label="ariaLabel"
    :data-state="dataState"
    :value="String(value)"
    :required="required"
    :name="name"
    @click.stop="onClick"
    @keydown.enter.prevent="onClick"
    @focus="onFocus"
  >
    <slot :checked="checked" :required="required" :disabled="disabled" />
  </Button>
</template>
