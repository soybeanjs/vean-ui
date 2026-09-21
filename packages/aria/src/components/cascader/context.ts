import { computed, shallowRef, toValue, useId, watch } from 'vue';
import type { ComputedRef, ShallowRef } from 'vue';
import { getDisclosureState } from '../../shared';
import { useDirection } from '../config-provider/context';
import { providePopperUi } from '../popper/context';
import { useContext, useUiContext } from '../../composables';
import type { DefinedValue, Direction } from '../../types';
import { getCascaderAncestorPath, mergeCascaderFieldKeys } from './shared';
import { useCascaderData } from './hooks';
import type {
  CascaderFieldKeys,
  CascaderModelValue,
  CascaderNode,
  CascaderOptionData,
  CascaderRootContextParams,
  CascaderUiSlot
} from './types';

/**
 * Parameters used to create the CascaderRoot context.
 */
export interface CascaderRootProviderParams {
  dir: ComputedRef<Direction | undefined>;
  disabled: ComputedRef<boolean | undefined>;
  clearable: ComputedRef<boolean | undefined>;
  expandTrigger: ComputedRef<'click' | 'hover' | undefined>;
  checkStrictly: ComputedRef<boolean | undefined>;
  multiple: ComputedRef<boolean | undefined>;
  pathMode: ComputedRef<boolean | undefined>;
  showCheckedStrategy: ComputedRef<'child' | 'parent' | undefined>;
  separator: ComputedRef<string | undefined>;
  filterable: ComputedRef<boolean | undefined>;
  remote: ComputedRef<boolean | undefined>;
  lazy: ComputedRef<boolean | undefined>;
  searchDelay: ComputedRef<number | undefined>;
  virtualScroll: ComputedRef<boolean | undefined>;
  itemSize: ComputedRef<number | undefined>;
  height: ComputedRef<number | undefined>;
  placeholder: ComputedRef<string | undefined>;
  fieldKeys: ComputedRef<CascaderFieldKeys | undefined>;
  options: ComputedRef<CascaderOptionData<DefinedValue>[] | undefined>;
  filter: ((pattern: string, option: CascaderOptionData<DefinedValue>, path: string[]) => boolean) | undefined;
  onLoad: ((option: CascaderNode<DefinedValue>) => Promise<CascaderOptionData<DefinedValue>[]>) | undefined;
  onSearch: ((pattern: string) => Promise<CascaderOptionData<DefinedValue>[]>) | undefined;
  onLoaded: ((node: CascaderNode<DefinedValue>) => void) | undefined;
  open: ShallowRef<boolean | undefined>;
  onOpenChange: (value: boolean) => void;
  modelValue: ShallowRef<CascaderModelValue | undefined>;
  onModelValueChange: (value: CascaderModelValue) => void;
  onChange: (value: CascaderModelValue | undefined, nodes: CascaderNode<DefinedValue>[]) => void;
  onClear: () => void;
}

export const [provideCascaderRootContext, useCascaderRootContext] = useContext(
  'CascaderRoot',
  (params: CascaderRootProviderParams) => {
    const dataState = computed(() => getDisclosureState(Boolean(params.open.value)));

    const dir = useDirection(params.dir);

    const baseId = `vean-cascader-${useId()}`;

    const contentId = computed(() => `${baseId}-content`);

    const getOptionId = (node: CascaderNode<DefinedValue>) => `${baseId}-option-${node.uid}`;

    const triggerElement = shallowRef<HTMLElement>();
    const contentElement = shallowRef<HTMLElement>();

    const onTriggerElementChange = (node: HTMLElement | undefined) => {
      triggerElement.value = node;
    };

    const onContentElementChange = (node: HTMLElement | undefined) => {
      contentElement.value = node;
    };

    const data = useCascaderData<DefinedValue>({
      options: params.options,
      fieldKeys: params.fieldKeys,
      multiple: params.multiple,
      pathMode: params.pathMode,
      checkStrictly: params.checkStrictly,
      showCheckedStrategy: params.showCheckedStrategy,
      expandTrigger: params.expandTrigger,
      separator: params.separator,
      lazy: params.lazy,
      searchDelay: params.searchDelay,
      filterable: params.filterable,
      remote: params.remote,
      filter: params.filter,
      onLoad: params.onLoad,
      onSearch: params.onSearch,
      onLoaded: params.onLoaded,
      modelValue: params.modelValue,
      onModelValueChange: params.onModelValueChange,
      onChange: params.onChange,
      open: params.open,
      onOpenChange: params.onOpenChange,
      idPrefix: baseId
    });

    const clearValue = () => {
      data.clearValue();
      params.onClear();
    };

    // Reset transient panel state when the panel closes so reopening starts fresh.
    watch(params.open, openValue => {
      if (openValue) {
        // On open, focus the selected node so keyboard navigation starts there.
        const selected = data.selectedNodes.value;
        if (selected.length > 0) {
          const node = selected[0]!;
          data.highlighted.value = node;
          // Restore the linked columns to the selected path. The close handler
          // below clears the expansion of filterable cascaders, so without this
          // the panel would reopen collapsed on every session after the first.
          data.expandingPath.value = getCascaderAncestorPath(node);
        }
      } else {
        data.searchPattern.value = '';
        data.highlighted.value = null;
        // For filterable cascaders, reset the expansion so reopening shows a clean
        // single-column tree instead of stale multi-column state from a prior session.
        if (toValue(params.filterable)) {
          data.expandingPath.value = [];
        }
      }
    });

    const context: CascaderRootContextParams = {
      ...params,
      fieldKeys: computed(() => mergeCascaderFieldKeys(params.fieldKeys?.value)),
      dataState,
      dir,
      contentId,
      getOptionId,
      triggerElement,
      contentElement,
      onTriggerElementChange,
      onContentElementChange,
      rootNodes: data.rootNodes,
      menus: data.menus,
      highlighted: data.highlighted,
      highlightedId: data.highlightedId,
      selectedNodes: data.selectedNodes,
      selectedLabels: data.selectedLabels,
      isSearchMode: data.isSearchMode,
      searchPattern: data.searchPattern,
      searchResults: data.searchResults,
      searchLoading: data.searchLoading,
      loadingKeys: data.loadingKeys,
      expandNode: data.expandNode,
      onOptionSelect: data.onOptionSelect,
      onOptionHover: data.onOptionHover,
      setHighlighted: data.setHighlighted,
      isChecked: data.isChecked,
      isIndeterminate: data.isIndeterminate,
      isSelected: data.isSelected,
      toggleCheck: data.toggleCheck,
      removeNode: data.removeNode,
      clearValue,
      handleKeydown: data.handleKeydown
    };

    return context;
  }
);

export const [provideCascaderUi, useCascaderUi] = useUiContext<CascaderUiSlot>('CascaderUi', ui => {
  providePopperUi(ui);

  return ui;
});
