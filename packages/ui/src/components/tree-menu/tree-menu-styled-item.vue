<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { Primitive } from '@vean/aria/primitive';
import { treeMenuVariants } from '@/styles/tree-menu';
import type { TreeMenuStyledItemProps, TreeMenuStyledItemSlots } from './types';

defineOptions({
  name: 'STreeMenuStyledItem'
});

const props = withDefaults(defineProps<TreeMenuStyledItemProps>(), {
  as: 'button',
  asChild: false,
  disabled: false
});

defineSlots<TreeMenuStyledItemSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'disabled']);

const ui = computed(() => treeMenuVariants({ size: props.size }, props.ui, { item: props.class }));

/**
 * Whether the row is a real `<button>`.
 *
 * `asChild` renders the consumer's own element, so its semantics — and its
 * behaviour — stay theirs.
 */
const isNativeButton = computed(() => !props.asChild && props.as === 'button');

/**
 * The row's native and state attributes.
 *
 * A native `button` needs an explicit type, or it submits the form it sits in, and
 * it takes the `disabled` attribute. Every other element only declares the state —
 * `aria-disabled` plus the `data-disabled` the recipe's disabled styles key on — so
 * a row that wraps its own trigger is not forced into form-control behaviour.
 */
const rowBindings = computed(() => ({
  type: isNativeButton.value ? 'button' : undefined,
  disabled: isNativeButton.value && props.disabled ? true : undefined,
  'aria-disabled': props.disabled || undefined,
  'data-disabled': props.disabled ? '' : undefined
}));

const rowProps = computed(() => ({ ...forwardedProps.value, ...rowBindings.value }));
</script>

<template>
  <div :class="ui.item" data-vean-tree-menu-styled-item>
    <Primitive v-bind="rowProps" data-vean-tree-menu-styled-item-button :class="ui.button">
      <slot />
    </Primitive>
  </div>
</template>
