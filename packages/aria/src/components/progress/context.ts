import { useContext, useUiContext } from '../../composables';
import type { ProgressProviderUiSlot, ProgressRootContext, ProgressUiSlot } from './types';

export const [provideProgressRootContext, useProgressRootContext] = useContext<ProgressRootContext>('ProgressRoot');

export const [provideProgressUi, useProgressUi] = useUiContext<ProgressUiSlot>('ProgressUi');

export const [provideProgressProviderUi, useProgressProviderUi] =
  useUiContext<ProgressProviderUiSlot>('ProgressProviderUi');
