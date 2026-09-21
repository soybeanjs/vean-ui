import { computed, mergeProps } from 'vue';
import { filterHiddenTreeNodes } from '../../shared';
import type { FocusOutsideEvent, PointerDownOutsideEvent } from '../../types';
import type { LinkProps, LinkExtraProps } from '../link/types';
import type { MenuOptionData } from '../menu';
import type { TreeNavOptionData, TreeNavRootContextParams } from './types';

/**
 * Whether the item exposes at least one visible child, so a branch whose
 * children are all hidden renders as a plain leaf (aligned with TreeMenu).
 */
export const hasChildren = (item: TreeNavOptionData): boolean => Boolean(item.children?.some(child => !child.hidden));

export const isLinkItem = (item: TreeNavOptionData): boolean => Boolean(item.to || item.href);

/**
 * Root element attribute of the navigation bar. Shared with DropdownMenu so
 * its focus-restore logic can detect TreeNav keyboard switching.
 */
export const TREE_NAV_DATA_ATTRIBUTE = 'data-vean-tree-nav';

/**
 * Stable roving tab-stop id of the trailing "more" trigger.
 */
export const TREE_NAV_MORE_VALUE = '__vean-tree-nav-more__';

/**
 * Menubar semantics: focus and pointer-down inside the TreeNav bar are
 * menu-switching interactions (arrow-key roaming, trigger toggling), not
 * outside dismissals — the root orchestrates popup closing itself.
 */
function guardTreeNavPopupDismiss(event: FocusOutsideEvent | PointerDownOutsideEvent) {
  const target = event.target as HTMLElement | null;

  if (target?.closest?.(`[${TREE_NAV_DATA_ATTRIBUTE}]`)) {
    event.preventDefault();
  }
}

/**
 * Recursively remove options flagged as `hidden`, aligned with TreeMenu.
 */
export function filterHiddenTreeNavOptions(items?: TreeNavOptionData[]): TreeNavOptionData[] {
  return filterHiddenTreeNodes(items);
}

/**
 * Build the props forwarded to the link element of a top-level link entry.
 *
 * Shared `linkProps` overrides are applied first; the entry fields and the
 * effective disabled state always win over them.
 */
export function buildTreeNavLinkProps(
  item: TreeNavOptionData,
  linkProps?: LinkExtraProps,
  disabled?: boolean
): LinkProps {
  return {
    ...linkProps,
    disabled: disabled || linkProps?.disabled,
    to: item.to,
    href: item.href,
    target: item.target,
    external: item.external
  };
}

/**
 * Adapter for popup select events.
 *
 * Popup internals only see the shared menu-item protocol (`MenuOptionData`),
 * while every runtime item originates from this component's string-valued
 * `TreeNavOptionData` tree, so narrowing at this boundary is safe.
 */
export function createTreeNavPopupSelectHandler(onSelect: (item: TreeNavOptionData, event: Event) => void) {
  return (item: MenuOptionData, event: Event) => onSelect(item as TreeNavOptionData, event);
}

/**
 * Assemble all props of a branch popup (popup config + options config) from
 * flattened root-context entries.
 *
 * `getValue` reports the stable trigger value of the popup so the root can
 * keep it under controlled open state and switch popups on arrow keys
 * (menubar-style keyboard model).
 */
export function createTreeNavBranchPopupBind(ctx: TreeNavRootContextParams, getValue: () => string) {
  const {
    openValue,
    onBranchOpenChange,
    onPopupArrowNavigation,
    selected,
    dir,
    trigger,
    delayDuration,
    skipDelayDuration,
    placement,
    showArrow,
    portalProps,
    popupProps,
    triggerProps,
    arrowProps,
    itemProps,
    linkProps,
    groupLabelProps,
    shortcutProps,
    separatorProps,
    subTriggerProps,
    subContentProps
  } = ctx;

  return computed(() => ({
    dir: dir.value,
    trigger: trigger.value,
    delayDuration: delayDuration.value,
    skipDelayDuration: skipDelayDuration.value,
    placement: placement.value,
    showArrow: showArrow.value,
    portalProps: portalProps.value,
    popupProps: mergeProps(
      { ...popupProps.value },
      {
        onKeydown: (event: KeyboardEvent) => onPopupArrowNavigation(getValue(), event)
      }
    ),
    triggerProps: triggerProps.value,
    arrowProps: arrowProps.value,
    contentProps: {
      // Menubar semantics: focus resting on triggers after arrow-key switching
      // must not dismiss the open popup (see `guardTreeNavPopupDismiss`).
      onFocusOutside: guardTreeNavPopupDismiss,
      onPointerDownOutside: guardTreeNavPopupDismiss
    },
    selectedValue: selected.value,
    itemProps: itemProps.value,
    linkProps: linkProps.value,
    groupLabelProps: groupLabelProps.value,
    shortcutProps: shortcutProps.value,
    separatorProps: separatorProps.value,
    subTriggerProps: subTriggerProps.value,
    subContentProps: mergeProps(
      { ...subContentProps.value },
      {
        // Sub popups are portaled to body, so their key events never bubble
        // back to the branch popup surface — bind the handler here as well.
        onKeydown: (event: KeyboardEvent) => onPopupArrowNavigation(getValue(), event)
      }
    ),
    open: openValue.value === getValue(),
    'onUpdate:open': (isOpen: boolean) => onBranchOpenChange(getValue(), isOpen)
  }));
}
