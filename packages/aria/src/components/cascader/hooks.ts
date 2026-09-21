import { computed, onWatcherCleanup, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { getVueBooleanCasting } from '../../shared';
import type { DefinedValue } from '../../types';
import {
  buildCascaderNodes,
  createCascaderNode,
  findCascaderNodeByPath,
  findCascaderNodeByValue,
  flattenCascaderNodes,
  getCascaderAncestorPath,
  isLazyCascaderNode,
  mergeCascaderFieldKeys
} from './shared';
import type { CascaderFieldKeys, CascaderModelValue, CascaderNode, CascaderOptionData } from './types';

export interface UseCascaderDataOptions<T extends DefinedValue = DefinedValue> {
  /** Raw options of the cascader. */
  options: MaybeRefOrGetter<CascaderOptionData<T>[] | undefined>;
  /** Field keys used to extract the option fields. */
  fieldKeys: MaybeRefOrGetter<CascaderFieldKeys | undefined>;
  /** Whether multiple nodes can be selected. */
  multiple: MaybeRefOrGetter<boolean | undefined>;
  /** Whether the model value is the full path array(s). */
  pathMode: MaybeRefOrGetter<boolean | undefined>;
  /** Whether any node can be selected independently. */
  checkStrictly: MaybeRefOrGetter<boolean | undefined>;
  /** The strategy used to collect and display checked nodes. */
  showCheckedStrategy: MaybeRefOrGetter<'child' | 'parent' | undefined>;
  /** The trigger used to expand the children of a node. */
  expandTrigger: MaybeRefOrGetter<'click' | 'hover' | undefined>;
  /** The separator used to join path labels. */
  separator: MaybeRefOrGetter<string | undefined>;
  /** Whether children are loaded asynchronously. */
  lazy: MaybeRefOrGetter<boolean | undefined>;
  /** Whether the trigger filters the options locally. */
  filterable: MaybeRefOrGetter<boolean | undefined>;
  /** Whether the panel loads its options from `onSearch`. */
  remote: MaybeRefOrGetter<boolean | undefined>;
  /** Debounce delay for filtering and remote search. */
  searchDelay: MaybeRefOrGetter<number | undefined>;
  /** Custom filter function used in local filtering mode. */
  filter?: (pattern: string, option: CascaderOptionData<T>, path: string[]) => boolean;
  /** Async function used to load the children of a node. */
  onLoad?: (option: CascaderNode<T>) => Promise<CascaderOptionData<T>[]>;
  /** Async function used by remote search. */
  onSearch?: (pattern: string) => Promise<CascaderOptionData<T>[]>;
  /** Emits the loaded event after the children of a node have been loaded. */
  onLoaded?: (node: CascaderNode<T>) => void;
  /** Current model value. */
  modelValue: ShallowRef<CascaderModelValue | undefined>;
  /** Emits the model value. */
  onModelValueChange: (value: CascaderModelValue) => void;
  /** Emits the change event with the selected nodes. */
  onChange?: (value: CascaderModelValue | undefined, nodes: CascaderNode<T>[]) => void;
  /** Whether the panel is currently open; used to close it after a single selection. */
  open: MaybeRefOrGetter<boolean | undefined>;
  /** Closes the panel once a single selection completes. */
  onOpenChange: (value: boolean) => void;
  /** Id prefix used to generate aria ids. */
  idPrefix: string;
}

export function useCascaderData<T extends DefinedValue = DefinedValue>(options: UseCascaderDataOptions<T>) {
  const {
    options: optionsRef,
    filter,
    onLoad,
    onSearch,
    onLoaded,
    modelValue,
    onModelValueChange,
    onChange,
    idPrefix
  } = options;

  const fieldKeysRef = computed(() => mergeCascaderFieldKeys(toValue(options.fieldKeys)));
  const rawOptions = computed(() => toValue(optionsRef));
  // `multiple` and `pathMode` are generic boolean props (`M`/`P`); Vue cannot infer a
  // runtime Boolean type from generics, so a bare attribute becomes `''` instead of
  // `true`. `getVueBooleanCasting` normalizes both shapes.
  const isMultiple = computed(() => getVueBooleanCasting(toValue(options.multiple)));
  const isPathMode = computed(() => getVueBooleanCasting(toValue(options.pathMode)));
  const isCheckStrictly = computed(() => Boolean(toValue(options.checkStrictly)));
  const showCheckedStrategyRef = computed(() => toValue(options.showCheckedStrategy) ?? 'child');
  const expandTriggerRef = computed(() => toValue(options.expandTrigger) ?? 'click');
  const separatorRef = computed(() => toValue(options.separator) ?? ' / ');
  const isLazy = computed(() => Boolean(toValue(options.lazy)));
  const isFilterable = computed(() => Boolean(toValue(options.filterable)));
  const isRemote = computed(() => Boolean(toValue(options.remote)));
  const searchDelayRef = computed(() => toValue(options.searchDelay) ?? 300);

  // ---------- Tree ----------

  const rootNodes = computed(() => buildCascaderNodes(rawOptions.value, fieldKeysRef.value));

  const flatNodes = computed(() => flattenCascaderNodes(rootNodes.value));

  const expandingPath = shallowRef<CascaderNode<T>[]>([]);

  /** The linked columns of the panel: menu[0] is the root level, menu[n] the children of expandingPath[n-1]. */
  const menus = computed(() => {
    const list: CascaderNode<T>[][] = [rootNodes.value];
    for (const node of expandingPath.value) {
      // `children` is `null` for lazy nodes (not yet loaded) and `[]` for leaf
      // nodes whose `children` field was absent. Only push non-empty columns to
      // avoid rendering a phantom empty column after selecting a leaf.
      if (node.children && node.children.length > 0) {
        list.push(node.children);
      } else {
        break;
      }
    }
    return list;
  });

  // ---------- Lazy loading ----------

  const loadingKeys = computed(() => new Set(flatNodes.value.filter(node => node.loading).map(node => node.uid)));

  async function loadChildren(node: CascaderNode<T>) {
    if (!onLoad) return;
    if (node.loading || node.loaded) return;

    node.loading = true;
    try {
      const children = await onLoad(node);
      node.children = (children ?? []).map((child, index) =>
        createCascaderNode(child, fieldKeysRef.value, node, index)
      );
      node.loaded = true;
      node.isLeaf = node.children.length === 0;
      onLoaded?.(node);
    } finally {
      node.loading = false;
    }
  }

  // ---------- Selection ----------

  const singleSelectedNode = shallowRef<CascaderNode<T> | null>(null);

  function setCheckedDeep(node: CascaderNode<T>, checked: boolean) {
    node.checked = checked;
    node.indeterminate = false;
    const children = node.children;
    if (children) {
      for (const child of children) {
        setCheckedDeep(child, checked);
      }
    }
  }

  function recomputeAncestors(node: CascaderNode<T>) {
    let current = node.parent;
    while (current) {
      const children = current.children;
      if (children === null) {
        // Unknown subtree (not loaded yet): keep an indeterminate state.
        current.checked = false;
        current.indeterminate = true;
        current = current.parent;
        continue;
      }

      const checkedCount = children.filter(child => child.checked).length;
      const hasIndeterminate = children.some(child => child.indeterminate);
      if (checkedCount === children.length) {
        current.checked = true;
        current.indeterminate = false;
      } else if (checkedCount > 0 || hasIndeterminate) {
        current.checked = false;
        current.indeterminate = true;
      } else {
        current.checked = false;
        current.indeterminate = false;
      }
      current = current.parent;
    }
  }

  /** Collects the checked nodes of the tree per `showCheckedStrategy`. */
  function collectCheckedNodes(nodes: CascaderNode<T>[]): CascaderNode<T>[] {
    const strategy = showCheckedStrategyRef.value;
    const result: CascaderNode<T>[] = [];

    const walk = (list: CascaderNode<T>[]) => {
      for (const node of list) {
        if (node.checked) {
          if (strategy === 'parent') {
            // In checkStrictly mode every checked node is an independent selection,
            // so the parent fold must not suppress it. In linked mode a checked
            // parent covers its whole subtree, so its children fold into it.
            if (isCheckStrictly.value || !node.parent || !node.parent.checked) result.push(node);
          } else {
            const children = node.children ?? [];
            if (!children.some(child => child.checked)) result.push(node);
          }
        }
        if (node.children) walk(node.children);
      }
    };

    walk(nodes);
    return result;
  }

  const selectedNodes = computed(() => {
    if (isMultiple.value) {
      return collectCheckedNodes(rootNodes.value);
    }
    return singleSelectedNode.value ? [singleSelectedNode.value] : [];
  });

  const selectedLabels = computed(() => {
    const nodes = selectedNodes.value;
    if (isMultiple.value) {
      return nodes.map(node => node.label);
    }
    const node = nodes[0];
    return node ? [node.pathLabels.join(separatorRef.value)] : [];
  });

  const checkedKeys = computed(() => new Set(flatNodes.value.filter(node => node.checked).map(node => node.uid)));
  const indeterminateKeys = computed(
    () => new Set(flatNodes.value.filter(node => node.indeterminate).map(node => node.uid))
  );

  function emitValue(nodes: CascaderNode<T>[]) {
    if (isMultiple.value) {
      const value: CascaderModelValue = isPathMode.value
        ? nodes.map(node => node.pathValues)
        : nodes.map(node => node.value);
      onModelValueChange(value);
      onChange?.(value, nodes);
      return;
    }

    const node = nodes[0];
    const value: CascaderModelValue = node ? (isPathMode.value ? node.pathValues : node.value) : undefined;
    onModelValueChange(value);
    onChange?.(value, nodes);
  }

  async function toggleCheck(node: CascaderNode<T>) {
    if (node.disabled) return;

    if (!isCheckStrictly.value && node.children === null) {
      await loadChildren(node);
    }

    if (isCheckStrictly.value) {
      node.checked = !node.checked;
      node.indeterminate = false;
    } else {
      setCheckedDeep(node, !node.checked);
      recomputeAncestors(node);
    }

    emitValue(collectCheckedNodes(rootNodes.value));
  }

  function onOptionSelect(node: CascaderNode<T>, _originalEvent: PointerEvent | KeyboardEvent) {
    if (node.disabled) return;

    if (isMultiple.value) {
      void toggleCheck(node);
      if (!node.isLeaf) {
        expandNode(node);
      }
      return;
    }

    // A single selection completes the interaction, so the panel closes. Both
    // the pointer path and the keyboard Enter path share this rule.
    const shouldClose = isCheckStrictly.value || node.isLeaf;

    if (isCheckStrictly.value || node.isLeaf) {
      singleSelectedNode.value = node;
      expandingPath.value = getCascaderAncestorPath(node);
      highlighted.value = node;
      emitValue([node]);
    } else {
      expandNode(node);
    }

    if (shouldClose && toValue(options.open)) {
      options.onOpenChange(false);
    }
  }

  function onOptionHover(node: CascaderNode<T>) {
    highlighted.value = node;
    if (expandTriggerRef.value === 'hover' && !node.isLeaf) {
      expandNode(node);
    }
  }

  function expandNode(node: CascaderNode<T>, _originalEvent?: Event) {
    if (node.disabled) return;

    expandingPath.value = [...expandingPath.value.slice(0, node.level), node];

    if (isLazyCascaderNode(node)) {
      void loadChildren(node);
    }
  }

  function clearValue() {
    for (const node of flatNodes.value) {
      node.checked = false;
      node.indeterminate = false;
    }
    singleSelectedNode.value = null;
    expandingPath.value = [];
    highlighted.value = null;
    onModelValueChange(isMultiple.value ? [] : undefined);
  }

  /** Removes a checked node (or its whole checked subtree) from the selection. */
  function removeNode(node: CascaderNode<T>) {
    if (!node.checked && !node.indeterminate) return;

    setCheckedDeep(node, false);
    recomputeAncestors(node);
    emitValue(collectCheckedNodes(rootNodes.value));
  }

  function isChecked(node: CascaderNode<T>) {
    return node.checked;
  }

  function isIndeterminate(node: CascaderNode<T>) {
    return node.indeterminate;
  }

  function isSelected(node: CascaderNode<T>) {
    if (isMultiple.value) return node.checked;
    return singleSelectedNode.value?.uid === node.uid;
  }

  // ---------- Sync from model value ----------

  function resetCheckStates() {
    for (const node of flatNodes.value) {
      node.checked = false;
      node.indeterminate = false;
    }
  }

  function resolveModelValueNodes(value: CascaderModelValue | undefined): CascaderNode<T>[] {
    if (value === undefined || value === null) return [];

    const items = isMultiple.value ? (value as unknown[]) : [value];
    const resolved: CascaderNode<T>[] = [];

    for (const item of items) {
      const node = isPathMode.value
        ? findCascaderNodeByPath(rootNodes.value, item as T[])
        : findCascaderNodeByValue(rootNodes.value, item as T);
      if (node) resolved.push(node);
    }

    return resolved;
  }

  function syncFromModelValue() {
    const value = modelValue.value;
    resetCheckStates();

    if (value === undefined || value === null) {
      singleSelectedNode.value = null;
      return;
    }

    const resolved = resolveModelValueNodes(value);

    if (isMultiple.value) {
      if (isCheckStrictly.value) {
        for (const node of resolved) {
          node.checked = true;
          node.indeterminate = false;
        }
      } else {
        for (const node of resolved) {
          setCheckedDeep(node, true);
        }
        for (const node of resolved) {
          recomputeAncestors(node);
        }
      }
      return;
    }

    const node = resolved[0];
    singleSelectedNode.value = node ?? null;
    if (node) {
      expandingPath.value = getCascaderAncestorPath(node);
    }
  }

  watch(
    [rawOptions, fieldKeysRef],
    () => {
      singleSelectedNode.value = null;
      expandingPath.value = [];
      syncFromModelValue();
    },
    { flush: 'post' }
  );

  watch(modelValue, () => syncFromModelValue(), { flush: 'post' });

  // ---------- Search ----------

  const searchPattern = shallowRef('');
  const remoteResults = shallowRef<CascaderNode<T>[]>([]);
  const searchLoading = shallowRef(false);

  const isSearchMode = computed(() => Boolean(searchPattern.value) && (isFilterable.value || isRemote.value));

  const searchResults = computed(() => {
    const pattern = searchPattern.value;
    if (!pattern) return [];

    if (isRemote.value) {
      return remoteResults.value;
    }

    if (isFilterable.value) {
      const defaultFilter = (value: string, _option: CascaderOptionData<T>, path: string[]) =>
        path.some(label => String(label).toLowerCase().includes(value.toLowerCase()));
      const filterFn = filter ?? defaultFilter;
      return flatNodes.value.filter(node => !node.disabled && filterFn(pattern, node.raw, node.pathLabels));
    }

    return [];
  });

  watch(
    searchPattern,
    pattern => {
      if (!isRemote.value || !onSearch) return;

      if (!pattern) {
        remoteResults.value = [];
        searchLoading.value = false;
        return;
      }

      searchLoading.value = true;
      const timer = setTimeout(async () => {
        try {
          const result = await onSearch(pattern);
          const nodes = (result ?? []).map((option, index) =>
            createCascaderNode(option, fieldKeysRef.value, null, index)
          );
          remoteResults.value = flattenCascaderNodes(nodes);
        } finally {
          searchLoading.value = false;
        }
      }, searchDelayRef.value);

      onWatcherCleanup(() => clearTimeout(timer));
    },
    { flush: 'post' }
  );

  // ---------- Highlight & keyboard ----------

  const highlighted = shallowRef<CascaderNode<T> | null>(null);

  const highlightedId = computed(() => (highlighted.value ? `${idPrefix}-option-${highlighted.value.uid}` : null));

  function setHighlighted(node: CascaderNode<T> | null) {
    highlighted.value = node;
  }

  function getActiveColumn(): CascaderNode<T>[] {
    if (isSearchMode.value) return searchResults.value;
    const node = highlighted.value;
    const level = node ? node.level : menus.value.length - 1;
    return menus.value[level] ?? [];
  }

  function moveHighlight(direction: 'up' | 'down' | 'home' | 'end') {
    const column = getActiveColumn();
    const enabled = column.filter(node => !node.disabled);
    if (enabled.length === 0) return;

    const current = highlighted.value;
    let targetIndex: number;

    if (direction === 'home') {
      targetIndex = 0;
    } else if (direction === 'end') {
      targetIndex = enabled.length - 1;
    } else {
      const currentIndex = current ? enabled.findIndex(node => node.uid === current.uid) : -1;
      if (currentIndex === -1) {
        targetIndex = direction === 'down' ? 0 : enabled.length - 1;
      } else {
        targetIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;
        if (targetIndex >= enabled.length) targetIndex = 0;
        if (targetIndex < 0) targetIndex = enabled.length - 1;
      }
    }

    highlighted.value = enabled[targetIndex];
  }

  function moveColumn(direction: 'next' | 'prev') {
    const node = highlighted.value;
    if (!node) return;

    if (direction === 'next') {
      if (!node.isLeaf) {
        expandNode(node);
        const children = node.children;
        if (children && children.length > 0) {
          highlighted.value = children.find(child => !child.disabled) ?? children[0]!;
        } else if (isLazyCascaderNode(node)) {
          // Children are loading, keep the highlight on the node itself.
          highlighted.value = node;
        }
      }
      return;
    }

    if (!node.parent) return;
    highlighted.value = node.parent;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    if (isSearchMode.value) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveHighlight(event.key === 'ArrowDown' ? 'down' : 'up');
      } else if (event.key === 'Enter') {
        const node = highlighted.value;
        if (node) {
          event.preventDefault();
          onOptionSelect(node, event);
        }
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveHighlight('down');
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveHighlight('up');
        break;
      case 'Home':
        event.preventDefault();
        moveHighlight('home');
        break;
      case 'End':
        event.preventDefault();
        moveHighlight('end');
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveColumn('next');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveColumn('prev');
        break;
      case 'Enter': {
        const node = highlighted.value;
        if (node) {
          event.preventDefault();
          onOptionSelect(node, event);
        }
        break;
      }
    }
  }

  return {
    rootNodes,
    flatNodes,
    expandingPath,
    menus,
    isMultiple,
    isPathMode,
    isCheckStrictly,
    showCheckedStrategyRef,
    separatorRef,
    isLazy,
    isFilterable,
    isRemote,
    loadingKeys,
    loadChildren,
    selectedNodes,
    selectedLabels,
    checkedKeys,
    indeterminateKeys,
    onOptionSelect,
    onOptionHover,
    expandNode,
    clearValue,
    toggleCheck,
    removeNode,
    isChecked,
    isIndeterminate,
    isSelected,
    searchPattern,
    isSearchMode,
    searchResults,
    searchLoading,
    highlighted,
    highlightedId,
    setHighlighted,
    handleKeydown
  };
}
