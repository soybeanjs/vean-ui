import { computed, ref, shallowRef, useId } from 'vue';
import { getDisclosureState, isPointerInGraceArea } from '../../shared';
import { providePopperUi } from '../popper/context';
import { provideSeparatorUi } from '../separator/context';
import { useContext, useUiContext } from '../../composables';
import type { AcceptableBooleanValue, DefinedValue, GraceIntent, HorizontalSide } from '../../types';
import type {
  MenuCheckboxGroupContextParams,
  MenuContentContextParams,
  MenuContextParams,
  MenuItemIndicatorContext,
  MenuOptionsCompactContext,
  MenuRadioGroupContextParams,
  MenuRootContext,
  MenuSubAttributeContext,
  MenuUiSlot
} from './types';

export const [provideMenuContext, useMenuContext] = useContext('Menu', (params: MenuContextParams) => {
  const { isRoot, open } = params;

  const onOpenChange = (v: boolean) => {
    open.value = v;
  };

  const dataState = computed(() => getDisclosureState(open.value));

  const dataPopupAttr = isRoot ? 'data-vean-menu-popup' : 'data-vean-menu-sub-popup';

  const popupElement = shallowRef<HTMLElement>();
  const onPopupElementChange = (el: HTMLElement) => {
    popupElement.value = el;
  };

  const triggerElement = shallowRef<HTMLElement>();
  const onTriggerElementChange = (el: HTMLElement) => {
    triggerElement.value = el;
  };

  const prefix = isRoot ? 'vean-menu' : 'vean-menu-sub';

  const popupId = shallowRef('');
  const generatedPopupId = `${prefix}-popup-${useId()}`;
  const initPopupId = () => {
    if (popupId.value) return;
    popupId.value = generatedPopupId;
  };

  const triggerId = shallowRef('');
  const generatedTriggerId = `${prefix}-trigger-${useId()}`;
  const initTriggerId = () => {
    if (triggerId.value) return;
    triggerId.value = generatedTriggerId;
  };

  return {
    ...params,
    onOpenChange,
    dataState,
    dataPopupAttr,
    popupElement,
    onPopupElementChange,
    triggerElement,
    onTriggerElementChange,
    popupId,
    initPopupId,
    triggerId,
    initTriggerId
  };
});

export const [provideMenuRootContext, useMenuRootContext] = useContext<MenuRootContext>('MenuRoot');

export const [provideMenuContentContext, useMenuContentContext] = useContext(
  'MenuContent',
  (params: MenuContentContextParams) => {
    const { popupElement } = params;

    const searchRef = shallowRef('');
    const currentItemId = ref<string | null>(null);
    const pointerGraceTimer = shallowRef(0);
    const pointerSide = shallowRef<HorizontalSide>('right');

    const pointerGraceIntent = ref<GraceIntent | null>(null);
    const onPointerGraceIntentChange = (intent: GraceIntent | null) => {
      pointerGraceIntent.value = intent;
    };
    const resetPointerGraceIntent = () => {
      pointerGraceIntent.value = null;
    };

    const isPointerMovingToSubmenu = (event: PointerEvent) => {
      const isMovingTowards = pointerSide.value === pointerGraceIntent.value?.side;
      const isInGraceArea = isPointerInGraceArea(event, pointerGraceIntent.value?.area);

      return isMovingTowards && isInGraceArea;
    };

    const onItemLeave = (event: PointerEvent) => {
      if (isPointerMovingToSubmenu(event)) return;
      popupElement.value?.focus();
      currentItemId.value = null;
    };

    return {
      searchRef,
      currentItemId,
      popupElement,
      pointerSide,
      pointerGraceTimer,
      pointerGraceIntent,
      onPointerGraceIntentChange,
      resetPointerGraceIntent,
      onItemEnter: isPointerMovingToSubmenu,
      onItemLeave,
      onTriggerLeave: isPointerMovingToSubmenu
    };
  }
);

export const [provideMenuCheckboxGroupContext, useMenuCheckboxGroupContext] = useContext(
  'MenuCheckboxGroup',
  (params: MenuCheckboxGroupContextParams) => {
    const { modelValue } = params;

    const onModelValueChange = (v: DefinedValue) => {
      const current = modelValue.value ?? [];

      if (current.includes(v)) {
        modelValue.value = current.filter(item => item !== v);
      } else {
        modelValue.value = [...current, v];
      }
    };

    return {
      ...params,
      onModelValueChange
    };
  }
);

export const [provideMenuRadioGroupContext, useMenuRadioGroupContext] = useContext(
  'MenuRadioGroup',
  (params: MenuRadioGroupContextParams) => {
    const { modelValue } = params;

    const onModelValueChange = (v: NonNullable<AcceptableBooleanValue>) => {
      modelValue.value = v;
    };

    return {
      ...params,
      onModelValueChange
    };
  }
);

export const [provideMenuItemIndicatorContext, useMenuItemIndicatorContext] =
  useContext<MenuItemIndicatorContext>('MenuItemIndicator');

export const [provideMenuOptionsCompactContext, useMenuOptionsCompactContext] =
  useContext<MenuOptionsCompactContext>('MenuOptionsCompact');

export const [provideMenuUi, useMenuUi] = useUiContext<MenuUiSlot>('MenuUi', ui => {
  providePopperUi(ui);

  const separatorUi = computed(() => ({ root: ui.value?.separator }));
  provideSeparatorUi(separatorUi);

  return ui;
});

export const [provideMenuSubAttributeContext, useMenuSubAttributeContext] =
  useContext<MenuSubAttributeContext>('MenuSubAttribute');
