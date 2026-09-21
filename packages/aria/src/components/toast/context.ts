import { useContext, useUiContext } from '../../composables';
import type { ToasterContext, ToastUiSlot } from './types';

export const [provideToasterContext, useToasterContext] = useContext<ToasterContext>('Toaster');

export const [provideToastUi, useToastUi] = useUiContext<ToastUiSlot>('ToastUi');
