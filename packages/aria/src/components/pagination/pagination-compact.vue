<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import PaginationEllipsis from './pagination-ellipsis.vue';
import PaginationFirst from './pagination-first.vue';
import PaginationLast from './pagination-last.vue';
import PaginationListItem from './pagination-list-item.vue';
import PaginationList from './pagination-list.vue';
import PaginationNext from './pagination-next.vue';
import PaginationPrev from './pagination-prev.vue';
import PaginationRoot from './pagination-root.vue';
import type { PaginationCompactProps, PaginationCompactEmits, PaginationCompactSlots } from './types';

defineOptions({
  name: 'PaginationCompact'
});

const props = withDefaults(defineProps<PaginationCompactProps>(), {
  showFirstOrLast: true
});

const emit = defineEmits<PaginationCompactEmits>();

defineSlots<PaginationCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'showFirstOrLast',
  'listProps',
  'listItemProps',
  'ellipsisProps',
  'firstProps',
  'prevProps',
  'nextProps',
  'lastProps'
]);

const listeners = useForwardListeners(emit);
</script>

<template>
  <PaginationRoot v-bind="forwardedProps" v-on="listeners">
    <slot name="leading" />
    <PaginationList v-slot="{ items }" v-bind="listProps">
      <PaginationFirst v-if="showFirstOrLast" v-bind="firstProps">
        <slot name="first">
          <Icon icon="lucide:chevrons-left" />
        </slot>
      </PaginationFirst>
      <PaginationPrev v-bind="prevProps">
        <slot name="prev">
          <Icon icon="lucide:chevron-left" />
        </slot>
      </PaginationPrev>
      <template v-for="(item, index) in items" :key="item.type === 'page' ? `page-${item.value}` : `ellipsis-${index}`">
        <PaginationListItem v-if="item.type === 'page'" v-bind="listItemProps" :value="item.value" />
        <PaginationEllipsis v-else-if="item.type === 'ellipsis'" v-bind="ellipsisProps">
          <slot name="ellipsis">
            <Icon icon="lucide:ellipsis" />
          </slot>
        </PaginationEllipsis>
      </template>
      <PaginationNext v-bind="nextProps">
        <slot name="next">
          <Icon icon="lucide:chevron-right" />
        </slot>
      </PaginationNext>
      <PaginationLast v-if="showFirstOrLast" v-bind="lastProps">
        <slot name="last">
          <Icon icon="lucide:chevrons-right" />
        </slot>
      </PaginationLast>
    </PaginationList>
    <slot name="trailing" />
  </PaginationRoot>
</template>
