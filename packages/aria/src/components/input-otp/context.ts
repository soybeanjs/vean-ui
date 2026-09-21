import { useContext, useUiContext } from '../../composables';
import type { InputOtpRootContext, InputOtpUiSlot } from './types';

export const [provideInputOtpRootContext, useInputOtpRootContext] = useContext<InputOtpRootContext>('InputOtpRoot');

export const [provideInputOtpUi, useInputOtpUi] = useUiContext<InputOtpUiSlot>('InputOtpUi');
