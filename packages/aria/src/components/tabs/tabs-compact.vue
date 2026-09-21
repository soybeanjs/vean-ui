<script setup lang="ts" generic="T extends TabsOptionData = TabsOptionData">
import { useOmitProps } from '../../composables';
import type { AcceptableValue } from '../../types';
import { useTabsUi } from './context';
import TabsContent from './tabs-content.vue';
import TabsIndicator from './tabs-indicator.vue';
import TabsList from './tabs-list.vue';
import TabsRoot from './tabs-root.vue';
import TabsTrigger from './tabs-trigger.vue';
import type { TabsCompactProps, TabsCompactEmits, TabsCompactSlots, TabsOptionData } from './types';

defineOptions({
  name: 'TabsCompact'
});

const props = withDefaults(defineProps<TabsCompactProps<T>>(), {
  modelValue: undefined,
  unmountOnHide: true,
  loop: true,
  enableIndicator: true
});

const emit = defineEmits<TabsCompactEmits<T['value']>>();

defineSlots<TabsCompactSlots<T>>();

const forwardedProps = useOmitProps(props, [
  'items',
  'enableIndicator',
  'listProps',
  'triggerProps',
  'contentProps',
  'indicatorProps'
]);

const ui = useTabsUi();

const onUpdateModelValue = (value: AcceptableValue) => {
  emit('update:modelValue', value as T['value']);
};
</script>

<template>
  <TabsRoot v-bind="forwardedProps" @update:model-value="onUpdateModelValue">
    <TabsList v-bind="listProps">
      <TabsTrigger
        v-for="item in items"
        :key="item.value"
        v-bind="triggerProps"
        v-slot="slotProps"
        :value="item.value"
        :disabled="item.disabled"
      >
        <slot name="trigger" v-bind="{ ...item, ...slotProps }">{{ item.label }}</slot>
      </TabsTrigger>
      <TabsIndicator v-if="enableIndicator" v-bind="indicatorProps">
        <slot name="indicator">
          <div :class="ui.indicatorContent" />
        </slot>
      </TabsIndicator>
    </TabsList>
    <TabsContent v-for="item in items" :key="item.value" v-bind="contentProps" v-slot="slotProps" :value="item.value">
      <slot name="content" v-bind="{ ...item, ...slotProps }" />
    </TabsContent>
  </TabsRoot>
</template>
