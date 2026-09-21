<script setup lang="ts" generic="T extends DefinedValue, M extends boolean = false, P extends boolean = false">
import { computed } from 'vue';
import { getVueBooleanCasting, toContext } from '../../shared';
import { useControllableState } from '../../composables';
import type { DefinedValue } from '../../types';
import { PopperPositioningRoot } from '../popper';
import { provideCascaderRootContext } from './context';
import type { CascaderRootProviderParams } from './context';
import type { CascaderModelValue, CascaderNode, CascaderRootProps, CascaderRootEmits, CascaderValue } from './types';

defineOptions({
  name: 'CascaderRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<CascaderRootProps<T, M, P>>(), {
  modelValue: undefined,
  open: undefined,
  clearable: false,
  expandTrigger: 'click',
  checkStrictly: false,
  showCheckedStrategy: 'child',
  separator: ' / ',
  filterable: false,
  remote: false,
  searchDelay: 300,
  lazy: false,
  virtualScroll: false,
  itemSize: 34,
  height: 204
});

const emit = defineEmits<CascaderRootEmits<T, M, P>>();

const modelValue = useControllableState<CascaderModelValue, true>(
  () => props.modelValue as CascaderModelValue | undefined,
  value => {
    emit('update:modelValue', value as CascaderValue<T, M, P>);
  },
  (props.defaultValue ?? (props.multiple ? ([] as CascaderModelValue) : undefined)) as CascaderModelValue,
  true
);

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen
);

const onModelValueChange = (value: CascaderModelValue) => {
  modelValue.value = value;
};

const onChange = (value: CascaderModelValue | undefined, nodes: CascaderNode<DefinedValue>[]) => {
  emit('change', value as CascaderValue<T, M, P> | undefined, nodes as CascaderNode<T>[]);
};

const onClear = () => {
  emit('clear');
};

const onLoaded = (node: CascaderNode<DefinedValue>) => {
  emit('loaded', node as CascaderNode<T>);
};

const { dir } = provideCascaderRootContext({
  ...toContext(props, [
    'dir',
    'disabled',
    'clearable',
    'expandTrigger',
    'checkStrictly',
    'showCheckedStrategy',
    'separator',
    'filterable',
    'remote',
    'lazy',
    'searchDelay',
    'virtualScroll',
    'itemSize',
    'height',
    'placeholder'
  ]),
  fieldKeys: computed(() => props.fieldKeys),
  options: computed(() => props.options),
  // `multiple` and `pathMode` are generic boolean props (`M`/`P`); Vue cannot infer a
  // runtime Boolean type from generics, so a bare attribute becomes `''` instead of
  // `true`. Normalize here so every context consumer sees a proper boolean.
  multiple: computed(() => getVueBooleanCasting(props.multiple)),
  pathMode: computed(() => getVueBooleanCasting(props.pathMode)),
  filter: props.filter as CascaderRootProviderParams['filter'],
  onLoad: props.onLoad ? option => props.onLoad!(option as CascaderNode<T>) : undefined,
  onSearch: props.onSearch as CascaderRootProviderParams['onSearch'],
  onLoaded,
  open,
  onOpenChange: value => {
    open.value = value;
  },
  modelValue,
  onModelValueChange,
  onChange,
  onClear
});
</script>

<template>
  <PopperPositioningRoot :dir="dir">
    <slot :model-value="modelValue" :open="Boolean(open)" />
  </PopperPositioningRoot>
</template>
