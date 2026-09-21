import { computed, shallowRef, useId, nextTick } from 'vue';
import { getDisclosureState } from '../../shared';
import { useContext, useForwardElement, useUiContext } from '../../composables';
import type { UseUiConsumer } from '../../composables';
import type { ClassValue, DisclosureState } from '../../types';
import type { DialogRootContextParams, DialogProviderContext, DialogCompactContext, DialogUiSlot } from './types';

export const [provideDialogRootContext, useDialogRootContext] = useContext(
  'DialogRoot',
  (params: DialogRootContextParams) => {
    const [overlayElement, setOverlayElement] = useForwardElement();
    const [triggerElement, setTriggerElement] = useForwardElement();
    const [popupElement, setPopupElement] = useForwardElement();
    const [cancelElement, setCancelElement] = useForwardElement();
    const [headerElement, setHeaderElement] = useForwardElement();

    const { open, fullscreen } = params;

    const onOpenChange = (value: boolean) => {
      open.value = value;
    };
    const onOpenToggle = () => {
      open.value = !open.value;
    };

    const onFullscreenChange = (value: boolean) => {
      fullscreen.value = value;
    };
    const onFullscreenToggle = () => {
      fullscreen.value = !fullscreen.value;
    };

    const dataState = computed<DisclosureState>(() => getDisclosureState(open.value));

    const popupId = shallowRef('');
    const generatedPopupId = `vean-dialog-popup-${useId()}`;
    const initPopupId = () => {
      if (popupId.value) return;
      popupId.value = generatedPopupId;
    };

    const titleId = shallowRef('');
    const generatedTitleId = `vean-dialog-title-${useId()}`;

    const initTitleId = () => {
      if (titleId.value) return;
      titleId.value = generatedTitleId;
    };

    const descriptionId = shallowRef('');
    const generatedDescriptionId = `vean-dialog-description-${useId()}`;

    const initDescriptionId = () => {
      if (descriptionId.value) return;
      descriptionId.value = generatedDescriptionId;
    };

    const focusCancel = async () => {
      await nextTick();

      cancelElement.value?.focus({
        preventScroll: true
      });
    };

    return {
      ...params,
      onOpenChange,
      onOpenToggle,
      onFullscreenChange,
      onFullscreenToggle,
      dataState,
      overlayElement,
      setOverlayElement,
      triggerElement,
      setTriggerElement,
      popupElement,
      setPopupElement,
      cancelElement,
      setCancelElement,
      headerElement,
      setHeaderElement,
      popupId,
      initPopupId,
      titleId,
      initTitleId,
      descriptionId,
      initDescriptionId,
      focusCancel
    };
  }
);

export const [provideDialogProviderContext, useDialogProviderContext] = useContext(
  'DialogProvider',
  (params: DialogProviderContext) => {
    const { dialogs } = params;

    const getCurrentDialog = (id: number | string) => dialogs.value.find(dialog => String(dialog.id) === String(id));

    return {
      dialogs,
      getCurrentDialog
    };
  }
);

export const [provideDialogCompactContext, useDialogCompactContext] = useContext(
  'DialogCompact',
  (params: DialogCompactContext) => {
    const { dialog } = params;

    return {
      dialog
    };
  }
);

export const [provideDialogUi, _useDialogUi] = useUiContext<DialogUiSlot>('DialogUi');

export const useDialogUi = ((slot?: DialogUiSlot) => {
  if (!slot) {
    return _useDialogUi();
  }

  const providerContext = useDialogCompactContext();

  const base = _useDialogUi(slot);

  const cls = computed(() => {
    const providerCls = providerContext?.dialog?.value?.ui?.[slot];

    return [base.value, providerCls].filter(Boolean).join(' ') as ClassValue;
  });

  return cls;
}) as UseUiConsumer<DialogUiSlot>;
