import { useContext, useUiContext } from '../../composables';
import type { WatermarkCompactContext, WatermarkRootContext, WatermarkUiSlot } from './types';

export const [provideWatermarkCompactContext, useWatermarkCompactContext] = useContext(
  'WatermarkCompact',
  (params: WatermarkCompactContext) => params
);

export const [provideWatermarkRootContext, useWatermarkRootContext] = useContext(
  'WatermarkRoot',
  (params: WatermarkRootContext) => params
);

export const [provideWatermarkUi, useWatermarkUi] = useUiContext<WatermarkUiSlot>('WatermarkUi');
