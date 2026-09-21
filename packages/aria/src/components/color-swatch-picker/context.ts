import { computed } from 'vue';
import { provideColorSwatchUi } from '../color-swatch/context';
import { provideListboxUi } from '../listbox/context';
import { useContext, useUiContext } from '../../composables';
import type { ColorSwatchPickerItemContext, ColorSwatchPickerUiSlot } from './types';

export const [provideColorSwatchPickerItemContext, useColorSwatchPickerItemContext] =
  useContext<ColorSwatchPickerItemContext>('ColorSwatchPickerItem');

export const [provideColorSwatchPickerUi, useColorSwatchPickerUi] = useUiContext<ColorSwatchPickerUiSlot>(
  'ColorSwatchPickerUi',
  ui => {
    const listboxUi = computed(() => ({
      content: ui.value.root,
      item: ui.value.item,
      itemIndicator: ui.value.itemIndicator
    }));

    const swatchUi = computed(() => ({
      root: ui.value.swatchRoot,
      checker: ui.value.swatchChecker,
      fill: ui.value.swatchFill
    }));

    provideListboxUi(listboxUi);
    provideColorSwatchUi(swatchUi);

    return ui;
  }
);
