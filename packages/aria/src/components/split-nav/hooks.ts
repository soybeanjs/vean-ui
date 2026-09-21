import { computed, toValue } from 'vue';
import type { ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue';
import { isFirstLevelBackwardExpandKey, isPaneBoundaryKey, resolveSplitNavLevels } from './shared';
import { useSplitNavRootContext } from './context';
import type { SplitNavBaseOptionData, SplitNavOptionData } from './types';

/**
 * Derive the first-level list, active item, and child pane items for a SplitNav pane.
 *
 * Pass `items` to override the root tree (used when `DualVerticalMenu` is nested
 * under `horizontal-dual-vertical`).
 */
export function useSplitNavDerived<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  items?: MaybeRefOrGetter<SplitNavOptionData<T>[] | undefined>
) {
  const { items: rootItems, modelValue, openPath } = useSplitNavRootContext('useSplitNavDerived');

  const levels = computed(() =>
    resolveSplitNavLevels<T>({
      items: rootItems.value as SplitNavOptionData<T>[],
      levelItems: toValue(items) as SplitNavOptionData<T>[] | undefined,
      modelValue: modelValue.value,
      openPath: openPath.value
    })
  );

  return {
    sourceItems: computed(() => levels.value.sourceItems),
    firstLevelItems: computed(() => levels.value.firstLevelItems),
    selectionPath: computed(() => levels.value.selectionPath),
    activeItem: computed(() => levels.value.activeItem),
    childItems: computed(() => levels.value.childItems)
  };
}

/**
 * Collapsed state, expand strategy, and layout tokens for the nested TreeMenu pane.
 */
export function useSplitNavTreePane() {
  const { collapsed, collapsedWidth, expandStrategy, modelValue, onItemActivate } =
    useSplitNavRootContext('useSplitNavTreePane');

  const treePaneState = computed(() => (collapsed.value ? 'collapsed' : 'expanded'));

  const treePaneStyle = computed<CSSProperties>(() => ({
    '--vean-split-nav-tree-collapsed-width': `${(collapsedWidth.value ?? 50) / 16}rem`
  }));

  function handleTreeSelect(value: string) {
    onItemActivate(value);
  }

  function handleCollapsedChange(value: boolean) {
    collapsed.value = value;
  }

  return {
    collapsed,
    collapsedWidth,
    expandStrategy,
    modelValue,
    treePaneState,
    treePaneStyle,
    handleTreeSelect,
    handleCollapsedChange
  };
}

/**
 * Pane-level handlers that hand focus back to the rail item owning the pane.
 *
 * `onPaneKeydown` (bubble phase) catches the horizontal backward key at the
 * TreeMenu boundary: the menu consumes it for collapsing branches and only
 * lets it through once the pane's top level is reached.
 *
 * `onPaneKeydownCapture` (capture phase) catches the same key on the first
 * visible item of panes whose own roaming swallows it (horizontal TreeNav), so
 * the fallback triggers only once roaming is at its start.
 */
export function useSplitNavPaneFallback(activeItem: ComputedRef<SplitNavOptionData | undefined>) {
  const { dir, railItemElements } = useSplitNavRootContext('useSplitNavPaneFallback');

  function fallbackToOwner(event: KeyboardEvent) {
    event.preventDefault();

    const ownerValue = activeItem.value?.value;
    if (!ownerValue) return;

    railItemElements.get(ownerValue)?.focus();
  }

  function onPaneKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    if (!isFirstLevelBackwardExpandKey(event.key, 'vertical', dir.value)) return;

    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.closest('[data-vean-tree-menu-root]')) return;

    fallbackToOwner(event);
  }

  function onPaneKeydownCapture(event: KeyboardEvent) {
    const paneElement = event.currentTarget as HTMLElement;

    if (isPaneBoundaryKey(event, paneElement, key => isFirstLevelBackwardExpandKey(key, 'vertical', dir.value))) {
      fallbackToOwner(event);
    }
  }

  return {
    onPaneKeydown,
    onPaneKeydownCapture
  };
}
