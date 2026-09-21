<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, useAttrs, watch, watchEffect } from 'vue';
import { defaultDocument, defaultWindow, useEventListener, usePrevious } from '@vueuse/core';
import { omit, toContext } from '../../shared';
import { useControllableState } from '../../composables';
import {
  createInputOtpSlots,
  getClampedOtpValue,
  isInputOtpValueValid,
  resolveInputOtpPattern,
  resolveInputOtpSelection,
  syncTimeouts
} from './shared';
import { provideInputOtpRootContext, useInputOtpUi } from './context';
import type { InputOtpRootProps, InputOtpRootSlotProps, InputOtpRootEmits } from './types';
import { usePasswordManagerBadge } from './use-password-manager-badge';

defineOptions({
  name: 'InputOtpRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<InputOtpRootProps>(), {
  modelValue: undefined,
  defaultValue: '',
  autocomplete: 'one-time-code',
  inputmode: 'numeric',
  pushPasswordManagerStrategy: 'increase-width'
});

const emit = defineEmits<InputOtpRootEmits>();

const attrs = useAttrs();

const rootCls = useInputOtpUi('root');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue
);

const previousValue = usePrevious(modelValue);
const currentValue = computed(() => modelValue.value ?? '');
const contextProps = toContext(props, [
  'autocomplete',
  'autofocus',
  'disabled',
  'inputmode',
  'maxlength',
  'minlength',
  'name',
  'readonly',
  'required'
]);

function resolveAttrString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

const resolvedId = computed(() => {
  return resolveAttrString(props.id) ?? resolveAttrString(attrs.id);
});
const resolvedPlaceholder = computed(() => {
  return resolveAttrString(props.placeholder) ?? resolveAttrString(attrs.placeholder);
});
const resolvedAccessibleLabel = computed(() => {
  // Vue camelizes the declared kebab-case prop into the props object, so read
  // both the camelCase prop and the raw attribute to cover every convention.
  const candidate = props.ariaLabel ?? attrs.ariaLabel ?? attrs['aria-label'];

  return resolveAttrString(candidate) ?? 'One-time password';
});
const pattern = computed(() => resolveInputOtpPattern(props.pattern));
const inputAttrs = computed(() => omit(attrs, ['class', 'style', 'id', 'placeholder', 'aria-label']));
const patternSource = computed(() => pattern.value?.source);
const isHovering = shallowRef(false);
const isFocused = shallowRef(false);
const mirrorSelectionStart = shallowRef<number | null>(null);
const mirrorSelectionEnd = shallowRef<number | null>(null);
const containerElement = shallowRef<HTMLDivElement | null>(null);
const inputElement = shallowRef<HTMLInputElement | null>(null);
const isIos = defaultWindow?.CSS?.supports?.('-webkit-touch-callout', 'none') ?? false;

let previousSelection: [
  number | null | undefined,
  number | null | undefined,
  'none' | 'forward' | 'backward' | null | undefined
] = [null, null, null];

const rootClass = computed(() => [rootCls.value, attrs.class]);

const { willPushPWMBadge } = usePasswordManagerBadge({
  containerElement,
  inputElement,
  pushPasswordManagerStrategy: () => props.pushPasswordManagerStrategy,
  isFocused
});

const slotProps = computed<InputOtpRootSlotProps>(() => ({
  slots: createInputOtpSlots({
    value: currentValue.value,
    maxlength: props.maxlength,
    placeholder: resolvedPlaceholder.value,
    isFocused: isFocused.value,
    selectionStart: mirrorSelectionStart.value,
    selectionEnd: mirrorSelectionEnd.value
  }),
  isFocused: isFocused.value,
  isHovering: !props.disabled && isHovering.value
}));

const focus = () => {
  inputElement.value?.focus();
};

const blur = () => {
  inputElement.value?.blur();
};

const select = () => {
  inputElement.value?.select();
};

const onDocumentSelectionChange = () => {
  const input = inputElement.value;

  if (!input) {
    return;
  }

  if (defaultDocument?.activeElement !== input) {
    mirrorSelectionStart.value = null;
    mirrorSelectionEnd.value = null;
    return;
  }

  const nextSelection = resolveInputOtpSelection({
    selectionStart: input.selectionStart,
    selectionEnd: input.selectionEnd,
    selectionDirection: input.selectionDirection,
    maxlength: props.maxlength,
    value: input.value,
    previousSelection
  });

  if (
    nextSelection.start !== null &&
    nextSelection.end !== null &&
    nextSelection.start !== nextSelection.end &&
    nextSelection.start >= 0 &&
    nextSelection.end <= props.maxlength
  ) {
    input.setSelectionRange(nextSelection.start, nextSelection.end, nextSelection.direction ?? undefined);
  }

  mirrorSelectionStart.value = nextSelection.start;
  mirrorSelectionEnd.value = nextSelection.end;
  previousSelection = [nextSelection.start, nextSelection.end, nextSelection.direction];
};

const onBeforeInput = (event: InputEvent) => {
  if (event.inputType !== 'insertText' || event.data === null) {
    return;
  }

  const target = event.currentTarget as HTMLInputElement;
  const selectionStart = target.selectionStart ?? 0;
  const selectionEnd = target.selectionEnd ?? 0;
  const isReplacing = selectionStart !== selectionEnd;
  const uncappedValue = isReplacing
    ? `${target.value.slice(0, selectionStart)}${event.data}${target.value.slice(selectionEnd)}`
    : `${target.value.slice(0, selectionStart)}${event.data}${target.value.slice(selectionStart)}`;
  const nextValue = getClampedOtpValue(uncappedValue, props.maxlength);

  if (!isInputOtpValueValid(nextValue, pattern.value)) {
    event.preventDefault();
  }
};

const onInput = (event: Event) => {
  const target = event.currentTarget as HTMLInputElement;

  if (props.disabled || props.readonly) {
    target.value = currentValue.value;
    return;
  }

  const nextValue = getClampedOtpValue(target.value, props.maxlength);

  if (!isInputOtpValueValid(nextValue, pattern.value)) {
    target.value = currentValue.value;
    event.preventDefault();
    return;
  }

  const didDelete = typeof previousValue.value === 'string' && nextValue.length < previousValue.value.length;

  if (didDelete) {
    defaultDocument?.dispatchEvent(new Event('selectionchange'));
  }

  modelValue.value = nextValue;
  emit('input', nextValue);
};

const onNativeChange = (event: Event) => {
  emit('change', event);
};

const onNativeSelect = (event: Event) => {
  emit('select', event);
};

const onMouseOver = (event: MouseEvent) => {
  isHovering.value = true;
  emit('mouseover', event);
};

const onMouseLeave = (event: MouseEvent) => {
  isHovering.value = false;
  emit('mouseleave', event);
};

const onFocus = (event: FocusEvent) => {
  const input = inputElement.value;

  if (!input) {
    return;
  }

  const start = Math.max(Math.min(input.value.length, props.maxlength - 1), 0);
  const end = input.value.length;

  input.setSelectionRange(start, end);
  mirrorSelectionStart.value = start;
  mirrorSelectionEnd.value = end;
  isFocused.value = true;
  emit('focus', event);
};

const onBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

const onPaste = (event: ClipboardEvent) => {
  const input = inputElement.value;

  if (!input) {
    return;
  }

  if (!props.pasteTransformer && (!isIos || !event.clipboardData)) {
    emit('paste', event);
    return;
  }

  const clipboardText = event.clipboardData?.getData('text/plain');
  const content = props.pasteTransformer ? props.pasteTransformer(clipboardText) : clipboardText;

  event.preventDefault();

  const selectionStart = input.selectionStart ?? 0;
  const selectionEnd = input.selectionEnd ?? 0;
  const isReplacing = selectionStart !== selectionEnd;
  const uncappedValue = isReplacing
    ? `${currentValue.value.slice(0, selectionStart)}${content ?? ''}${currentValue.value.slice(selectionEnd)}`
    : `${currentValue.value.slice(0, selectionStart)}${content ?? ''}${currentValue.value.slice(selectionStart)}`;
  const nextValue = getClampedOtpValue(uncappedValue, props.maxlength);

  if (!isInputOtpValueValid(nextValue, pattern.value)) {
    emit('paste', event);
    return;
  }

  modelValue.value = nextValue;
  emit('input', nextValue);

  const start = Math.max(Math.min(nextValue.length, props.maxlength - 1), 0);
  const end = nextValue.length;

  input.setSelectionRange(start, end);
  mirrorSelectionStart.value = start;
  mirrorSelectionEnd.value = end;
  emit('paste', event);
};

provideInputOtpRootContext({
  ...contextProps,
  inputAttrs,
  willPushPWMBadge,
  mirrorSelectionStart,
  mirrorSelectionEnd,
  modelValue: currentValue,
  pattern: patternSource,
  resolvedAccessibleLabel,
  resolvedId,
  resolvedPlaceholder,
  slots: computed(() => slotProps.value.slots),
  isFocused,
  isHovering,
  inputElement,
  focus,
  blur,
  select,
  onBeforeInput,
  onNativeChange,
  onNativeSelect,
  onMouseOver,
  onMouseLeave,
  onPaste,
  onInput,
  onFocus,
  onBlur
});

let stopSelectionChangeListener: (() => void) | undefined;

onMounted(() => {
  const input = inputElement.value;

  if (!input) {
    return;
  }

  previousSelection = [input.selectionStart, input.selectionEnd, input.selectionDirection];
  stopSelectionChangeListener = useEventListener(defaultDocument, 'selectionchange', onDocumentSelectionChange, {
    capture: true
  });

  onDocumentSelectionChange();

  if (defaultDocument?.activeElement === input) {
    isFocused.value = true;
  }
});

onBeforeUnmount(() => {
  stopSelectionChangeListener?.();
});

watch(
  () => modelValue.value,
  (_, __, onCleanup) => {
    const timers = syncTimeouts(() => {
      const input = inputElement.value;

      if (!input) {
        return;
      }

      if (input.selectionStart !== null && input.selectionEnd !== null) {
        mirrorSelectionStart.value = input.selectionStart;
        mirrorSelectionEnd.value = input.selectionEnd;
        previousSelection = [input.selectionStart, input.selectionEnd, input.selectionDirection];
      }
    });

    onCleanup(() => {
      const window = defaultWindow;

      if (!window) {
        return;
      }

      timers.forEach(timer => window.clearTimeout(timer));
    });
  },
  { immediate: true }
);

watchEffect(() => {
  if (
    previousValue.value !== undefined &&
    currentValue.value !== previousValue.value &&
    previousValue.value.length < props.maxlength &&
    currentValue.value.length === props.maxlength
  ) {
    emit('complete', currentValue.value);
  }
});

const exposed = {
  focus,
  blur,
  select,
  get $el() {
    return inputElement.value;
  }
};

defineExpose(exposed);
</script>

<template>
  <div
    ref="containerElement"
    data-vean-input-otp-root
    data-input-otp-container
    :data-disabled="disabled ? '' : undefined"
    :data-focused="isFocused ? '' : undefined"
    :data-hovering="!disabled && isHovering ? '' : undefined"
    :data-complete="currentValue.length === maxlength ? '' : undefined"
    :class="rootClass"
    :style="attrs.style"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
