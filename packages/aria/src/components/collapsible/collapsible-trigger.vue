<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useCollapsibleRootContext, useCollapsibleUi } from './context';
import type { CollapsibleTriggerProps } from './types';

defineOptions({
  name: 'CollapsibleTrigger'
});

const props = defineProps<CollapsibleTriggerProps>();

const { open, onOpenToggle, contentId, disabled, dataState } = useCollapsibleRootContext('CollapsibleTrigger');

const cls = useCollapsibleUi('trigger');

const forwardedProps = useOmitProps(props, ['as', 'asChild', 'disabled', 'disabledCollapsible', 'type']);

/**
 * Renders the button semantics inline instead of delegating to `Button`.
 *
 * The trigger used to be `CollapsibleTrigger → Button → Primitive`: three
 * component instances for one `<button>`. Across a 50-item accordion that chain
 * costs ~1.2 ms of the mount, the largest per-item cost left in the mount
 * benchmark. `Button` supplied `type="button"`, the
 * `disabled`/`aria-disabled`/`data-disabled`/`data-normal` markers, `tabindex="-1"`
 * while disabled, and a click guard; all of it is reproduced below.
 *
 * Every attribute the old chain emitted is preserved, including `data-vean-button`
 * and `data-normal`. Consumers style `[data-vean-button]`, so dropping the markers
 * would be a breaking DOM change smuggled into a perf fix.
 *
 * Behaviour carried over unchanged: the trigger is disabled by the collapsible
 * root's `disabled` only. A `disabled` prop on the trigger itself is ignored —
 * the old template bound `:disabled="disabled"` after `v-bind="forwardedProps"`,
 * so the explicit binding won.
 */
const rendersButton = computed(() => (props.as ?? 'button') === 'button');

const isDisabled = computed(() => Boolean(disabled.value));

/**
 * A single merged object: `v-bind` twice on one element is a compile error, and
 * spreading the two objects here keeps the merged result reactive as one unit.
 *
 * Every key is written only when it has a value. `asChild` merges these onto the
 * caller's element through `mergeProps`, which copies every key unconditionally —
 * so a `tabindex: undefined` here would delete the child's own `tabindex`, which
 * is how the roving-focus tree menu lost its single tab stop.
 */
const triggerAttributes = computed(() => {
  const attributes: Record<string, unknown> = { ...forwardedProps.value };

  if (isDisabled.value) {
    attributes['aria-disabled'] = true;
    attributes['data-disabled'] = '';

    if (rendersButton.value) {
      attributes.disabled = true;
      attributes.tabindex = '-1';
    }
  } else {
    attributes['data-normal'] = '';
  }

  if (rendersButton.value) {
    attributes.type = props.type ?? 'button';
  }

  return attributes;
});

const onTriggerClick = (event: MouseEvent) => {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();

    return;
  }

  if (props.disabledCollapsible) return;

  onOpenToggle();
};
</script>

<template>
  <Primitive
    v-bind="triggerAttributes"
    :as="as ?? 'button'"
    :as-child="asChild"
    data-vean-button
    data-vean-collapsible-trigger
    :class="cls"
    :aria-controls="contentId"
    :aria-expanded="open"
    :data-state="dataState"
    @click="onTriggerClick"
  >
    <slot :open="open" />
  </Primitive>
</template>
