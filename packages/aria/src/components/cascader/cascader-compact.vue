<script
  setup
  lang="ts"
  generic="T extends DefinedValue = DefinedValue, M extends boolean = false, P extends boolean = false"
>
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import type { DefinedValue } from '../../types';
import Icon from '../_icon/icon.vue';
import { PopperArrow } from '../popper';
import { Portal } from '../portal';
import { useCascaderUi } from './context';
import CascaderClear from './cascader-clear.vue';
import CascaderContent from './cascader-content.vue';
import CascaderEmpty from './cascader-empty.vue';
import CascaderRoot from './cascader-root.vue';
import CascaderSearchInput from './cascader-search-input.vue';
import CascaderTags from './cascader-tags.vue';
import CascaderTrigger from './cascader-trigger.vue';
import CascaderValue from './cascader-value.vue';
import type {
  CascaderCompactProps,
  CascaderCompactOptionSlotProps,
  CascaderCompactTagSlotProps,
  CascaderCompactTriggerValueSlotProps,
  CascaderCompactEmits,
  CascaderCompactSlots,
  CascaderModelValue,
  CascaderNode,
  CascaderValue as CascaderValueType
} from './types';

defineOptions({
  name: 'CascaderCompact'
});

const props = withDefaults(defineProps<CascaderCompactProps<T, M, P>>(), {
  open: undefined,
  clearable: true,
  showArrow: true,
  placeholder: '',
  emptyLabel: undefined
});

const emit = defineEmits<CascaderCompactEmits<T, M, P>>();

defineSlots<CascaderCompactSlots<T, M, P>>();

const forwardedProps = useOmitProps(props, [
  'showArrow',
  'triggerProps',
  'valueProps',
  'searchInputProps',
  'portalProps',
  'contentProps',
  'placement',
  'menuProps',
  'optionProps',
  'emptyProps',
  'emptyLabel',
  'clearLabel',
  'arrowProps'
]);

const triggerIconCls = useCascaderUi('triggerIcon');
const optionTextCls = useCascaderUi('optionText');
const optionCheckCls = useCascaderUi('optionCheck');
const optionArrowCls = useCascaderUi('optionArrow');

const isFilterable = computed(() => Boolean(props.filterable));
const isClearable = computed(() => Boolean(props.clearable));

const messages = useLocaleMessages();

/** Fallback text of the empty state, overridable via `emptyLabel`. */
const emptyLabel = computed(() => props.emptyLabel ?? messages.value.cascader.noResults);

/** Aria-label of a tag remove button, e.g. "Remove 杭州". */
const getRemoveTagLabel = (label: string) => messages.value.cascader.removeTag.replace('{label}', label);

const valueProps = computed(() => ({
  ...props.valueProps,
  placeholder: props.valueProps?.placeholder ?? props.placeholder
}));

const contentProps = computed(() => ({
  ...props.contentProps,
  placement: props.placement ?? props.contentProps?.placement
}));

const menuProps = computed(() => ({
  ...props.menuProps,
  optionProps: { ...props.menuProps?.optionProps, ...props.optionProps }
}));

const getTriggerValueSlotProps = (slotProps: {
  modelValue: CascaderModelValue;
  selectedLabels: string[];
  slotText: string;
}) => slotProps as CascaderCompactTriggerValueSlotProps<T, M, P>;

const getOptionSlotProps = (slotProps: CascaderCompactOptionSlotProps<DefinedValue>) =>
  slotProps as CascaderCompactOptionSlotProps<T>;

const getTagSlotProps = (slotProps: CascaderCompactTagSlotProps<DefinedValue>) => ({
  node: slotProps.node as CascaderNode<T>,
  remove: slotProps.remove as (node: CascaderNode<T>) => void
});

const handleModelValueChange = (value: CascaderModelValue) => {
  emit('update:modelValue', value as CascaderValueType<T, M, P>);
};

const handleChange = (value: CascaderModelValue | undefined, nodes: CascaderNode<DefinedValue>[]) => {
  emit('change', value as CascaderValueType<T, M, P> | undefined, nodes as CascaderNode<T>[]);
};
</script>

<template>
  <CascaderRoot
    v-bind="forwardedProps"
    @update:model-value="handleModelValueChange"
    @update:open="emit('update:open', $event)"
    @change="handleChange"
    @clear="emit('clear')"
    @loaded="emit('loaded', $event)"
  >
    <CascaderTrigger v-bind="triggerProps">
      <template v-if="isFilterable">
        <slot name="search-input">
          <CascaderSearchInput v-bind="searchInputProps" />
        </slot>
      </template>
      <CascaderTags v-else>
        <template #tag="slotProps">
          <slot name="tag" v-bind="getTagSlotProps(slotProps)">
            <span>{{ slotProps.node.label }}</span>
            <button
              type="button"
              tabindex="-1"
              :aria-label="getRemoveTagLabel(slotProps.node.label)"
              @click="slotProps.remove(slotProps.node)"
            >
              <Icon icon="lucide:x" />
            </button>
          </slot>
        </template>
        <template #value>
          <CascaderValue v-slot="slotProps" v-bind="valueProps">
            <slot name="trigger-value" v-bind="getTriggerValueSlotProps(slotProps)" />
          </CascaderValue>
        </template>
      </CascaderTags>
      <CascaderClear v-if="isClearable" :aria-label="clearLabel" />
      <span data-vean-cascader-trigger-icon :class="triggerIconCls">
        <slot name="trigger-icon">
          <Icon icon="lucide:chevrons-up-down" />
        </slot>
      </span>
    </CascaderTrigger>
    <Portal v-bind="portalProps">
      <CascaderContent
        v-bind="contentProps"
        :menu-props="menuProps"
        :empty-props="emptyProps"
        @close-auto-focus="emit('closeAutoFocus', $event)"
        @escape-key-down="emit('escapeKeyDown', $event)"
        @pointer-down-outside="emit('pointerDownOutside', $event)"
      >
        <template #option="slotProps">
          <slot name="option" v-bind="getOptionSlotProps(slotProps)">
            <span data-vean-cascader-option-text :class="optionTextCls">{{ slotProps.node.label }}</span>
            <span
              v-if="slotProps.checked || slotProps.indeterminate || slotProps.selected"
              data-vean-cascader-option-check
              :class="optionCheckCls"
            >
              <Icon icon="lucide:check" />
            </span>
            <span
              v-if="!slotProps.node.isLeaf"
              data-vean-cascader-option-arrow
              :class="optionArrowCls"
              @click.stop="slotProps.expand"
            >
              <Icon v-if="slotProps.loading" icon="lucide:loader-circle" class="animate-spin" />
              <Icon v-else icon="lucide:chevron-right" />
            </span>
          </slot>
        </template>
        <template #empty>
          <slot name="empty">
            <CascaderEmpty v-bind="emptyProps">{{ emptyLabel }}</CascaderEmpty>
          </slot>
        </template>
        <PopperArrow v-if="showArrow" v-bind="arrowProps" />
      </CascaderContent>
    </Portal>
  </CascaderRoot>
</template>
