<script setup lang="ts" generic="T extends BreadcrumbOptionData = BreadcrumbOptionData">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import { getEllipsisRange } from './shared';
import BreadcrumbEllipsis from './breadcrumb-ellipsis.vue';
import BreadcrumbItem from './breadcrumb-item.vue';
import BreadcrumbLink from './breadcrumb-link.vue';
import BreadcrumbList from './breadcrumb-list.vue';
import BreadcrumbPage from './breadcrumb-page.vue';
import BreadcrumbRoot from './breadcrumb-root.vue';
import BreadcrumbSeparator from './breadcrumb-separator.vue';
import type {
  BreadcrumbCompactProps,
  BreadcrumbCompactEmits,
  BreadcrumbCompactSlots,
  BreadcrumbOptionData
} from './types';

defineOptions({
  name: 'BreadcrumbCompact'
});

const props = defineProps<BreadcrumbCompactProps<T>>();

const emit = defineEmits<BreadcrumbCompactEmits<T>>();

defineSlots<BreadcrumbCompactSlots<T>>();

const forwardedRootProps = useOmitProps(props, [
  'items',
  'ellipsis',
  'listProps',
  'itemProps',
  'linkProps',
  'pageProps',
  'separatorProps',
  'ellipsisProps'
]);

const ellipsisRange = computed(() => getEllipsisRange(props.items, props.ellipsis));

const startIndex = computed(() => ellipsisRange.value?.[0]);

const visibleItems = computed(() => {
  if (!ellipsisRange.value) {
    return props.items;
  }

  const [start, end] = ellipsisRange.value;

  return [...props.items.slice(0, start), ...props.items.slice(end)];
});

const ellipsisItems = computed(() => {
  if (!ellipsisRange.value) {
    return [];
  }

  const [start, end] = ellipsisRange.value;

  return props.items.slice(start, end);
});

const handleItemClick = (item: T) => {
  if (item.disabled) {
    return;
  }

  emit('click', item);
};
</script>

<template>
  <BreadcrumbRoot v-bind="forwardedRootProps">
    <BreadcrumbList v-bind="listProps">
      <template v-for="(item, index) in visibleItems" :key="item.value || index">
        <template v-if="startIndex && index === startIndex">
          <slot name="ellipsis" :ellipsis-items="ellipsisItems">
            <BreadcrumbEllipsis v-bind="ellipsisProps">
              <slot name="ellipsis-icon">
                <Icon icon="lucide:ellipsis" />
              </slot>
            </BreadcrumbEllipsis>
          </slot>
          <BreadcrumbSeparator v-bind="separatorProps">
            <slot name="separator">
              <Icon icon="lucide:chevron-right" />
            </slot>
          </BreadcrumbSeparator>
        </template>
        <BreadcrumbItem v-bind="itemProps" @click="handleItemClick(item)">
          <slot name="item-leading" :item="item" :index="index">
            <Icon v-if="item.icon" :icon="item.icon" />
          </slot>
          <slot :item="item" :index="index">
            <BreadcrumbLink
              v-if="item.to || item.href"
              v-bind="linkProps"
              :disabled="item.disabled"
              :to="item.to"
              :href="item.href"
              :target="item.target"
              :external="item.external"
            >
              <slot name="item-link" :item="item" :index="index">{{ item.label }}</slot>
            </BreadcrumbLink>
            <BreadcrumbPage v-else v-bind="pageProps">
              <slot name="item-label" :item="item" :index="index">{{ item.label }}</slot>
            </BreadcrumbPage>
          </slot>
          <slot name="item-trailing" :item="item" :index="index" />
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < visibleItems.length - 1" v-bind="separatorProps">
          <slot name="separator">
            <Icon icon="lucide:chevron-right" />
          </slot>
        </BreadcrumbSeparator>
      </template>
    </BreadcrumbList>
  </BreadcrumbRoot>
</template>
