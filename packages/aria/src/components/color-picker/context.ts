import { computed } from 'vue';
import { provideColorAreaUi } from '../color-area/context';
import { provideColorFieldUi } from '../color-field/context';
import { provideColorSliderUi } from '../color-slider/context';
import { provideColorSwatchPickerUi } from '../color-swatch-picker/context';
import { provideColorSwatchUi } from '../color-swatch/context';
import { providePopoverUi } from '../popover/context';
import { provideSegmentUi } from '../segment/context';
import { useContext, useUiContext } from '../../composables';
import type { ColorAreaUi } from '../color-area/types';
import type { ColorFieldUi } from '../color-field/types';
import type { ColorSliderUi } from '../color-slider/types';
import type { ColorSwatchPickerUi } from '../color-swatch-picker/types';
import type { ColorSwatchUi } from '../color-swatch/types';
import type { PopoverUi } from '../popover/types';
import type { SegmentUi } from '../segment/types';
import type { ColorPickerRootContext, ColorPickerUi, ColorPickerUiSlot } from './types';

export const [provideColorPickerRootContext, useColorPickerRootContext] =
  useContext<ColorPickerRootContext>('ColorPickerRootContext');

function toPopoverUi(ui: Partial<ColorPickerUi>): Partial<PopoverUi> {
  return {
    positioner: ui.positioner,
    popup: ui.popup,
    arrow: ui.arrow,
    close: ui.close,
    trigger: ui.popoverTrigger
  };
}

function toColorAreaUi(ui: Partial<ColorPickerUi>): Partial<ColorAreaUi> {
  return {
    root: ui.areaRoot,
    area: ui.areaSurface,
    thumb: ui.areaThumb
  };
}

function toColorFieldUi(ui: Partial<ColorPickerUi>): Partial<ColorFieldUi> {
  return {
    root: ui.fieldRoot,
    input: ui.fieldInput
  };
}

function toColorSliderUi(ui: Partial<ColorPickerUi>): Partial<ColorSliderUi> {
  return {
    root: ui.sliderControl,
    track: ui.sliderTrack,
    thumb: ui.sliderThumb
  };
}

function toColorSwatchUi(ui: Partial<ColorPickerUi>): Partial<ColorSwatchUi> {
  return {
    root: ui.swatchRoot,
    checker: ui.swatchChecker,
    fill: ui.swatchFill
  };
}

function toColorSwatchPickerUi(ui: Partial<ColorPickerUi>): Partial<ColorSwatchPickerUi> {
  return {
    root: ui.swatchPickerRoot,
    item: ui.swatchPickerItem,
    itemIndicator: ui.swatchPickerItemIndicator,
    swatchRoot: ui.swatchPickerSwatchRoot,
    swatchChecker: ui.swatchPickerSwatchChecker,
    swatchFill: ui.swatchPickerSwatchFill
  };
}

function toSegmentUi(ui: Partial<ColorPickerUi>): Partial<SegmentUi> {
  return {
    root: ui.segmentRoot,
    list: ui.segmentList,
    trigger: ui.segmentTrigger,
    indicator: ui.segmentIndicator,
    indicatorContent: ui.segmentIndicatorContent
  };
}

export const [provideColorPickerUi, useColorPickerUi] = useUiContext<ColorPickerUiSlot>('ColorPickerUi', ui => {
  providePopoverUi(computed(() => toPopoverUi(ui.value)));
  provideColorAreaUi(computed(() => toColorAreaUi(ui.value)));
  provideColorFieldUi(computed(() => toColorFieldUi(ui.value)));
  provideColorSliderUi(computed(() => toColorSliderUi(ui.value)));
  provideColorSwatchUi(computed(() => toColorSwatchUi(ui.value)));
  provideColorSwatchPickerUi(computed(() => toColorSwatchPickerUi(ui.value)));
  provideSegmentUi(computed(() => toSegmentUi(ui.value)));

  return ui;
});
