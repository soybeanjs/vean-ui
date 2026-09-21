import { computed, ref, shallowRef, useId } from 'vue';
import { getDisclosureState, isValueEqualOrExist, tryFocusFirst } from '../../shared';
import { useDirection } from '../config-provider/context';
import { providePopperUi } from '../popper/context';
import { useCollection, useContext, useUiContext } from '../../composables';
import type { AcceptableValue, Point } from '../../types';
import type {
  SelectContentContextParams,
  SelectItemAlignedPositionContext,
  SelectItemCollectionItemData,
  SelectItemContextParams,
  SelectOption,
  SelectRootContextParams,
  SelectUiSlot
} from './types';

export const [provideSelectRootContext, useSelectRootContext] = useContext(
  'SelectRoot',
  (params: SelectRootContextParams) => {
    const { open } = params;

    const onOpenChange = (value: boolean) => {
      open.value = value;
    };

    const dataState = computed(() => getDisclosureState(open.value));

    const dir = useDirection(params.dir);

    const contentId = shallowRef('');
    const generatedContentId = `vean-select-content-${useId()}`;
    const initContentId = () => {
      if (contentId.value) return;
      contentId.value = generatedContentId;
    };

    const triggerElement = shallowRef<HTMLElement>();

    const onTriggerElementChange = (node: HTMLElement) => {
      triggerElement.value = node;
    };

    const valueElement = shallowRef<HTMLElement>();

    const onValueElementChange = (node: HTMLElement) => {
      valueElement.value = node;
    };

    const optionsSet = ref<Set<SelectOption>>(new Set());

    const options = computed(() => Array.from(optionsSet.value));

    // The native `select` only associates the correct default value if the corresponding
    // `option` is rendered as a child **at the same time** as itself.
    // Because it might take a few renders for our items to gather the information to build
    // the native `option`(s), we generate a key on the `select` to make sure Vue re-builds it
    // each time the options change.
    const nativeSelectKey = computed(() => options.value.map(option => option.value).join(';'));

    const onOptionAdd = (option: SelectOption) => {
      optionsSet.value.add(option);
    };
    const onOptionRemove = (option: SelectOption) => {
      optionsSet.value.delete(option);
    };

    const triggerPointerDownPosition = shallowRef<Point | null>({
      x: 0,
      y: 0
    });

    const setTriggerPointerDownPosition = (position: Point) => {
      triggerPointerDownPosition.value = position;
    };

    const resetTriggerPointerDownPosition = () => {
      triggerPointerDownPosition.value = null;
    };

    return {
      ...params,
      dataState,
      onOpenChange,
      dir,
      contentId,
      initContentId,
      triggerElement,
      onTriggerElementChange,
      valueElement,
      onValueElementChange,
      optionsSet,
      onOptionAdd,
      onOptionRemove,
      options,
      nativeSelectKey,
      triggerPointerDownPosition,
      setTriggerPointerDownPosition,
      resetTriggerPointerDownPosition
    };
  }
);

export const { provideCollectionContext, useCollectionContext, useCollectionItem } =
  useCollection<SelectItemCollectionItemData>('Select');

export const [provideSelectContentContext, useSelectContentContext] = useContext(
  'SelectContent',
  (params: SelectContentContextParams) => {
    const { modelValue, isMultiple, popupElement, position } = params;

    const isPositioned = shallowRef(false);

    const viewportElement = shallowRef<HTMLElement>();
    const onViewportElementChange = (node: HTMLElement) => {
      viewportElement.value = node;
    };

    let firstValidItemFound = false;
    let firstSelectedItemInArrayFound = false;

    const selectedItemTextElement = shallowRef<HTMLElement>();
    const onSelectedItemTextElementChange = (node: HTMLElement, value: AcceptableValue, disabled: boolean) => {
      const isFirstValidItem = !firstValidItemFound && !disabled;
      const isSelectedItem = isValueEqualOrExist(modelValue.value, value);

      if (isSelectedItem || isFirstValidItem) {
        selectedItemTextElement.value = node;
      }
    };

    const selectedItemElement = shallowRef<HTMLElement>();
    const onSelectedItemElementChange = (node: HTMLElement, value: AcceptableValue, disabled: boolean) => {
      const isFirstValidItem = !firstValidItemFound && !disabled;
      const isSelectedItem = isValueEqualOrExist(modelValue.value, value);

      if (isMultiple.value) {
        if (firstSelectedItemInArrayFound) {
          return;
        }
        if (isSelectedItem || isFirstValidItem) {
          selectedItemElement.value = node;

          // make sure to keep the first item highlighted when `multiple`
          if (isSelectedItem) {
            firstSelectedItemInArrayFound = true;
          }
        }
      } else if (isSelectedItem || isFirstValidItem) {
        selectedItemElement.value = node;
      }

      if (isFirstValidItem) {
        firstValidItemFound = true;
      }
    };
    const onItemElementLeave = () => {
      popupElement.value?.focus();
    };

    // Explicitly scroll the selected item fully into view.
    // If we only rely on the browser's default scrolling behavior (block: nearest) when focusing,
    // when the selected item is at the end of the list and the viewport is expanded during scrolling,
    // Here we directly scroll the viewport to the actual position of the selected item.
    const scrollSelectedItemIntoView = (): void => {
      const viewport = viewportElement.value;
      const item = selectedItemElement.value;

      if (!viewport || !item) return;

      const viewportTop = viewport.scrollTop;
      const viewportBottom = viewportTop + viewport.clientHeight;
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;

      if (itemTop < viewportTop) {
        viewport.scrollTop = itemTop;
      } else if (itemBottom > viewportBottom) {
        viewport.scrollTop = itemBottom - viewport.clientHeight;
      }
    };

    const isSelectedItemFullyVisible = (): boolean => {
      const viewport = viewportElement.value;
      const item = selectedItemElement.value;

      if (!viewport || !item) return true;

      return (
        item.offsetTop >= viewport.scrollTop &&
        item.offsetTop + item.offsetHeight <= viewport.scrollTop + viewport.clientHeight
      );
    };

    function focusSelectedItem() {
      if (!selectedItemElement.value || !popupElement.value) return;

      tryFocusFirst([selectedItemElement.value, popupElement.value]);

      // The `item-aligned` positioner already vertically centers the selected item
      // relative to the trigger via `position()`. Running an edge-aligned scroll here
      // would override that centering, so only apply it in `popper` mode.
      if (position.value !== 'popper') return;

      scrollSelectedItemIntoView();

      // During the opening process, the viewport height will dynamically shrink due to the maximum height constraint applied by popper
      // and the appearance of scroll buttons (e.g., from 285 → 234).
      // If we only correct it in one scroll, the bottom of the selected item at the end of the list.
      // Here, we continuously scroll the selected item into view in subsequent animation frames
      // until the viewport size is stable for several consecutive frames and the selected item is fully visible before stopping, to cover the final size after the animation ends.
      const viewport = viewportElement.value;

      if (!viewport || typeof requestAnimationFrame === 'undefined') return;

      let stableFrames = 0;
      let lastHeight = viewport.clientHeight;
      const startTime = performance.now();

      const tick = (): void => {
        scrollSelectedItemIntoView();

        const heightChanged = viewport.clientHeight !== lastHeight;
        const fullyVisible = isSelectedItemFullyVisible();
        lastHeight = viewport.clientHeight;

        if (heightChanged) {
          stableFrames = 0;
        } else if (fullyVisible) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
        }

        // 尺寸连续 3 帧稳定且选中项完整可见，或超过 500ms 兜底，则停止。
        if (stableFrames >= 3 || performance.now() - startTime > 500) {
          return;
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }

    return {
      ...params,
      isPositioned,
      viewportElement,
      onViewportElementChange,
      selectedItemElement,
      onSelectedItemElementChange,
      onItemElementLeave,
      selectedItemTextElement,
      onSelectedItemTextElementChange,
      focusSelectedItem
    };
  }
);

export const [provideSelectGroupContext, useSelectGroupContext] = useContext('SelectGroup', () => {
  const labelId = shallowRef('');
  const generatedLabelId = `vean-select-group-label-${useId()}`;

  const initLabelId = () => {
    if (labelId.value) return;

    labelId.value = generatedLabelId;
  };

  return {
    labelId,
    initLabelId
  };
});

export const [provideSelectItemContext, useSelectItemContext] = useContext(
  'SelectItem',
  (params: SelectItemContextParams) => {
    const textValue = shallowRef(params.textValue.value ?? '');

    const itemTextElement = shallowRef<HTMLElement>();
    const onItemTextElementChange = (node: HTMLElement) => {
      itemTextElement.value = node;

      textValue.value = ((textValue.value || node?.textContent) ?? '').trim();
    };

    const textId = shallowRef('');
    const generatedTextId = `vean-select-item-text-${useId()}`;

    const initTextId = () => {
      if (textId.value) return;

      textId.value = generatedTextId;
    };

    return {
      ...params,
      textId,
      initTextId,
      textValue,
      itemTextElement,
      onItemTextElementChange
    };
  }
);

export const [provideSelectPopupElementContext, useSelectPopupElementContext] = useContext('SelectPopupElement', () => {
  const popupElement = shallowRef<HTMLElement>();
  const onPopupElementChange = (node: HTMLElement) => {
    popupElement.value = node;
  };

  return {
    popupElement,
    onPopupElementChange
  };
});

export const [provideSelectItemAlignedPositionContext, useSelectItemAlignedPositionContext] =
  useContext<SelectItemAlignedPositionContext>('SelectItemAlignedPosition');

export const [provideSelectUi, useSelectUi] = useUiContext<SelectUiSlot>('SelectUi', ui => {
  providePopperUi(ui);

  return ui;
});
