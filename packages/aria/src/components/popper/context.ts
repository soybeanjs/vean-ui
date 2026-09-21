import { computed, onScopeDispose, shallowReactive, shallowRef, useId, watch } from 'vue';
import type { ComputedRef, ShallowRef } from 'vue';
import { getDisclosureState } from '../../shared';
import { useContext, useUiContext } from '../../composables';
import type { Direction } from '../../types';
import type {
  PopperDelayGroupContext,
  PopperDelayGroupParams,
  PopperOpenChangeReason,
  PopperPositionerContextParams,
  PopperReferenceElement,
  PopperRootContext,
  PopperTriggerConfiguration,
  PopperTriggerType,
  PopperUiSlot
} from './types';

interface PopperRootContextParams {
  open: ShallowRef<boolean>;
  reason: ShallowRef<PopperOpenChangeReason>;
  dir: ComputedRef<Direction>;
  modal: ComputedRef<boolean | undefined>;
  disabled: ComputedRef<boolean>;
  parent: PopperRootContext | undefined;
  onOpenChange: (value: boolean, reason: PopperOpenChangeReason) => void;
}

const defaultTriggerConfiguration: PopperTriggerConfiguration = {
  type: 'click',
  openDelay: 0,
  focusOpenDelay: 0,
  closeDelay: 0,
  skipDelayDuration: 300,
  pressOpenDelay: 700,
  openOnFocus: false,
  disabled: false
};

export const [providePopperRootContext, usePopperRootContext] = useContext(
  'PopperRoot',
  (params: PopperRootContextParams): PopperRootContext => {
    // Shared delay group (FloatingDelayGroup pattern). Nested roots never join — opening a
    // submenu or an inner popup must not reset the sibling delay window of the outer group.
    const delayGroup = params.parent === undefined ? (usePopperDelayGroup() ?? undefined) : undefined;

    const triggerConfiguration = shallowReactive({ ...defaultTriggerConfiguration });
    const triggerType = shallowRef<PopperTriggerType>('click');

    const disabled = computed(() => params.disabled.value || triggerConfiguration.disabled);
    const modal = computed(() => params.modal.value ?? triggerType.value !== 'hover');
    const dataState = computed(() => getDisclosureState(params.open.value));

    const triggerElement = shallowRef<HTMLElement>();
    const graceTriggerElement = shallowRef<HTMLElement | undefined>();
    const positionerElement = shallowRef<HTMLElement>();
    const popupElement = shallowRef<HTMLElement>();
    const anchorElement = shallowRef<PopperReferenceElement>();
    const positionerUpdate = shallowRef<(() => void) | undefined>();
    const triggerId = shallowRef(`vean-popper-trigger-${useId()}`);
    const popupId = shallowRef(`vean-popper-popup-${useId()}`);

    const customAnchorCount = shallowRef(0);
    const hasCustomAnchor = computed(() => customAnchorCount.value > 0);

    const children = shallowRef<readonly PopperRootContext[]>([]);
    const isSub = computed(() => Boolean(params.parent));
    const nestingLevel = computed(() => (params.parent?.nestingLevel.value ?? -1) + 1);

    const isTriggerPointerInside = shallowRef(false);
    const isPopupPointerInside = shallowRef(false);
    const isPointerInTransit = shallowRef(false);
    const isPointerInTree = computed(
      () =>
        isTriggerPointerInside.value ||
        isPopupPointerInside.value ||
        isPointerInTransit.value ||
        children.value.some(child => child.isPointerInTree.value)
    );

    const isOpenDelayed = shallowRef(true);
    const wasOpenDelayed = shallowRef(false);

    let openTimer: ReturnType<typeof setTimeout> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    let skipDelayTimer: ReturnType<typeof setTimeout> | undefined;
    let hoverCloseGuard: (() => boolean) | undefined;

    function clearOpenTimer() {
      if (openTimer === undefined) return;
      clearTimeout(openTimer);
      openTimer = undefined;
    }

    function clearCloseTimer() {
      if (closeTimer === undefined) return;
      clearTimeout(closeTimer);
      closeTimer = undefined;
    }

    function clearSkipDelayTimer() {
      if (skipDelayTimer === undefined) return;
      clearTimeout(skipDelayTimer);
      skipDelayTimer = undefined;
    }

    function clearTimers() {
      clearOpenTimer();
      clearCloseTimer();
      clearSkipDelayTimer();
    }

    function closeDescendants() {
      for (const child of children.value) {
        child.onOpenChange(false, 'parent-close');
      }
    }

    function onOpenChange(value: boolean, reason: PopperOpenChangeReason = 'imperative') {
      if (value && disabled.value) return;

      if (!value) {
        clearOpenTimer();
        clearCloseTimer();
        closeDescendants();
      }

      if (params.open.value === value) return;
      params.onOpenChange(value, reason);
    }

    function onOpenToggle(reason: PopperOpenChangeReason) {
      onOpenChange(!params.open.value, reason);
    }

    function startSkipDelayTimer() {
      clearSkipDelayTimer();
      skipDelayTimer = setTimeout(() => {
        isOpenDelayed.value = true;
        skipDelayTimer = undefined;
      }, triggerConfiguration.skipDelayDuration);
    }

    function commitHoverOpen(
      reason: Extract<PopperOpenChangeReason, 'trigger-hover' | 'trigger-focus'>,
      delayed: boolean
    ) {
      clearOpenTimer();
      clearCloseTimer();
      clearSkipDelayTimer();
      // In a delay group the window state is group-owned and reset through the member-open
      // report below; the local machine is only authoritative for group-less roots.
      if (!delayGroup) isOpenDelayed.value = false;
      wasOpenDelayed.value = delayed;
      onOpenChange(true, reason);
    }

    function onHoverOpen(reason: Extract<PopperOpenChangeReason, 'trigger-hover' | 'trigger-focus'> = 'trigger-hover') {
      if (disabled.value) return;

      clearOpenTimer();
      clearCloseTimer();

      const openIsDelayed = delayGroup ? delayGroup.isOpenDelayed.value : isOpenDelayed.value;
      const delay = openIsDelayed
        ? reason === 'trigger-focus'
          ? triggerConfiguration.focusOpenDelay
          : triggerConfiguration.openDelay
        : 0;
      if (delay <= 0) {
        commitHoverOpen(reason, false);
        return;
      }

      openTimer = setTimeout(() => {
        commitHoverOpen(reason, true);
        openTimer = undefined;
      }, delay);
    }

    function onHoverClose(
      reason: Extract<PopperOpenChangeReason, 'trigger-hover' | 'trigger-focus'> = 'trigger-hover'
    ) {
      clearOpenTimer();
      clearCloseTimer();

      closeTimer = setTimeout(() => {
        closeTimer = undefined;
        if (isPointerInTree.value) return;

        // A domain layer (e.g. HoverCard text selection) may veto the delayed close; the guard
        // runs at fire time so late-changing state (selection made during the delay) is honored.
        if (hoverCloseGuard?.()) return;

        onOpenChange(false, reason);
        if (!delayGroup) startSkipDelayTimer();

        if (params.parent?.triggerType.value === 'hover') {
          params.parent.onHoverClose('trigger-hover');
        }
      }, triggerConfiguration.closeDelay);
    }

    function cancelHoverClose() {
      clearCloseTimer();
    }

    function configureTrigger(configuration: PopperTriggerConfiguration) {
      Object.assign(triggerConfiguration, configuration);
      triggerType.value = configuration.type;

      if (disabled.value) {
        onOpenChange(false, 'imperative');
      }
    }

    function onTriggerElementChange(element: HTMLElement | undefined) {
      triggerElement.value = element;
    }

    function onGraceTriggerElementChange(element: HTMLElement | undefined) {
      graceTriggerElement.value = element;
    }

    function onPositionerElementChange(element: HTMLElement | undefined) {
      positionerElement.value = element;
    }

    function onPopupElementChange(element: HTMLElement | undefined) {
      popupElement.value = element;
    }

    function onAnchorElementChange(element: PopperReferenceElement | undefined) {
      anchorElement.value = element;
    }

    function onPositionerUpdateChange(update: (() => void) | undefined) {
      positionerUpdate.value = update;
    }

    function requestPositionerUpdate() {
      positionerUpdate.value?.();
    }

    function onTriggerPointerInsideChange(value: boolean) {
      isTriggerPointerInside.value = value;
    }

    function onPopupPointerInsideChange(value: boolean) {
      isPopupPointerInside.value = value;
    }

    function registerCustomAnchor() {
      customAnchorCount.value += 1;

      return () => {
        customAnchorCount.value = Math.max(0, customAnchorCount.value - 1);
      };
    }

    function registerHoverCloseGuard(guard?: () => boolean) {
      hoverCloseGuard = guard;
    }

    function registerChild(child: PopperRootContext) {
      children.value = [...children.value, child];

      return () => {
        children.value = children.value.filter(item => item !== child);
      };
    }

    const context: PopperRootContext = {
      open: params.open,
      reason: params.reason,
      dir: params.dir,
      modal,
      disabled,
      dataState,
      triggerType,
      triggerElement,
      graceTriggerElement,
      positionerElement,
      popupElement,
      anchorElement,
      triggerId,
      popupId,
      hasCustomAnchor,
      parent: params.parent,
      children,
      isSub,
      nestingLevel,
      isPointerInTransit,
      isPointerInTree,
      isOpenDelayed,
      wasOpenDelayed,
      configureTrigger,
      onOpenChange,
      onOpenToggle,
      onHoverOpen,
      onHoverClose,
      cancelHoverClose,
      onTriggerElementChange,
      onGraceTriggerElementChange,
      onPositionerElementChange,
      onPopupElementChange,
      onAnchorElementChange,
      onPositionerUpdateChange,
      requestPositionerUpdate,
      onTriggerPointerInsideChange,
      onPopupPointerInsideChange,
      registerCustomAnchor,
      registerHoverCloseGuard,
      registerChild,
      closeDescendants,
      clearTimers
    };

    // Report open changes to the delay group from the settled open state so every open path
    // (hover, focus, imperative, controlled prop flips) resets the shared skip-delay window.
    if (delayGroup) {
      const group = delayGroup;
      watch(
        params.open,
        isOpen => {
          if (isOpen) group.onMemberOpen(context);
          else group.onMemberClose(context);
        },
        { immediate: true }
      );
      // A member unmounting while open must not keep the group window from starting.
      onScopeDispose(() => group.onMemberClose(context));
    }

    return context;
  }
);

export const [providePopperDelayGroup, usePopperDelayGroup] = useContext(
  'PopperDelayGroup',
  (params: PopperDelayGroupParams): PopperDelayGroupContext => {
    const isOpenDelayed = shallowRef(true);
    const openMembers = new Set<PopperRootContext>();

    let skipDelayTimer: ReturnType<typeof setTimeout> | undefined;

    function clearSkipDelayTimer() {
      if (skipDelayTimer === undefined) return;
      clearTimeout(skipDelayTimer);
      skipDelayTimer = undefined;
    }

    function onMemberOpen(member: PopperRootContext) {
      clearSkipDelayTimer();
      isOpenDelayed.value = false;
      openMembers.add(member);
    }

    // The skip-delay window only starts once the last open member closes; while any member
    // stays open the next sibling open must stay instant.
    function onMemberClose(member: PopperRootContext) {
      if (!openMembers.delete(member)) return;

      if (openMembers.size === 0) {
        clearSkipDelayTimer();
        skipDelayTimer = setTimeout(() => {
          isOpenDelayed.value = true;
          skipDelayTimer = undefined;
        }, params.skipDelayDuration.value);
      }
    }

    return {
      isOpenDelayed,
      onMemberOpen,
      onMemberClose
    };
  }
);

export const [providePopperUi, usePopperUi] = useUiContext<PopperUiSlot>('PopperUi');

interface PopperPositioningRootContextParams {
  dir: ComputedRef<Direction>;
  /**
   * Optional shared members: the interactive shell's `PopperRoot` dual-provides this
   * context with its own refs (same objects, so both contexts stay in sync) so shared
   * leaves (`PopperAnchor` / `PopperArrow`) work under both trees. Positioning-only
   * roots leave them unset and fresh refs are created here.
   */
  anchorElement?: ShallowRef<PopperReferenceElement | undefined>;
  onAnchorElementChange?: (element: PopperReferenceElement | undefined) => void;
  popupElement?: ShallowRef<HTMLElement | undefined>;
  onPopupElementChange?: (element: HTMLElement | undefined) => void;
  /** Custom-anchor registration; no-op for positioning-only trees (they have no trigger). */
  registerCustomAnchor?: () => () => void;
}

export const [providePopperPositioningRootContext, usePopperPositioningRootContext] = useContext(
  'PopperPositioningRoot',
  (params: PopperPositioningRootContextParams) => {
    const popupElement = params.popupElement ?? shallowRef<HTMLElement>();
    const onPopupElementChange =
      params.onPopupElementChange ??
      ((element: HTMLElement | undefined) => {
        popupElement.value = element;
      });

    const anchorElement = params.anchorElement ?? shallowRef<PopperReferenceElement>();
    const onAnchorElementChange =
      params.onAnchorElementChange ??
      ((element: PopperReferenceElement | undefined) => {
        anchorElement.value = element;
      });

    return {
      ...params,
      popupElement,
      onPopupElementChange,
      anchorElement,
      onAnchorElementChange,
      registerCustomAnchor: params.registerCustomAnchor ?? (() => () => {})
    };
  }
);

export const [providePopperPositionerContext, usePopperPositionerContext] = useContext(
  'PopperPositioner',
  (params: PopperPositionerContextParams) => {
    const arrowElement = shallowRef<HTMLElement | null>(null);

    const onArrowElementChange = (element: HTMLElement | null | undefined) => {
      arrowElement.value = element ?? null;
    };

    return {
      ...params,
      arrowElement,
      onArrowElementChange
    };
  }
);
