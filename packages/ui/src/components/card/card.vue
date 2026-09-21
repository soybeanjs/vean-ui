<script setup lang="ts">
import { computed } from 'vue';
import { CollapsibleContent, CollapsibleRoot, provideCollapsibleUi } from '@vean/aria/collapsible';
import { useOmitProps } from '@vean/aria/composables';
import { cardVariants } from '@/styles/card';
import type { CardProps, CardEmits, CardSlots } from './types';

defineOptions({
  name: 'SCard'
});

const props = withDefaults(defineProps<CardProps>(), {
  defaultOpen: true,
  open: undefined,
  scrollable: true
});

const emit = defineEmits<CardEmits>();

const slots = defineSlots<CardSlots>();

const forwardedProps = useOmitProps(props, [
  'class',
  'size',
  'ui',
  'scrollable',
  'split',
  'title',
  'description',
  'headerProps',
  'contentProps',
  'footerProps',
  'titleRootProps',
  'titleProps',
  'descriptionProps'
]);

const ui = computed(() =>
  cardVariants(
    {
      size: props.size,
      scrollable: props.scrollable,
      split: props.split
    },
    props.ui,
    { root: props.class }
  )
);

// The card has no Aria family of its own: the chrome nodes below are UI-owned, while the
// collapsible behavior comes from the admitted `collapsible` primitives. Handing the recipe to
// `provideCollapsibleUi` lets `CollapsibleRoot` / `CollapsibleContent` / `CollapsibleTrigger`
// resolve their own `root` / `content` / `trigger` classes from the card recipe.
provideCollapsibleUi(ui);

const showHeader = computed(() =>
  Boolean(slots.header || slots.title || slots.description || slots.extra || props.title || props.description)
);

const showFooter = computed(() => Boolean(slots.footer));
</script>

<template>
  <CollapsibleRoot
    v-bind="forwardedProps"
    data-vean-card-root
    :data-header-visible="showHeader"
    :data-footer-visible="showFooter"
    @update:open="emit('update:open', $event)"
  >
    <div v-if="showHeader" v-bind="headerProps" data-vean-card-header :class="ui.header">
      <slot name="header">
        <div v-bind="titleRootProps" data-vean-card-title-root :class="ui.titleRoot">
          <slot name="title-leading" />
          <h3 v-bind="titleProps" data-vean-card-title :class="ui.title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <slot name="title-trailing" />
        </div>
        <slot name="extra" />
        <p
          v-if="slots.description || description"
          v-bind="descriptionProps"
          data-vean-card-description
          :class="ui.description"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </slot>
    </div>
    <!-- `tabindex="-1"` keeps the scrollable body programmatically focusable; `contentProps` may override it. -->
    <CollapsibleContent
      tabindex="-1"
      v-bind="contentProps"
      data-vean-card-content
      :data-header-visible="showHeader"
      :data-footer-visible="showFooter"
    >
      <slot />
    </CollapsibleContent>
    <div v-if="showFooter" v-bind="footerProps" data-vean-card-footer :class="ui.footer">
      <slot name="footer" />
    </div>
  </CollapsibleRoot>
</template>
