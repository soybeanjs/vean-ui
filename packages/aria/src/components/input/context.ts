import { useContext, useUiContext } from '../../composables';
import type { InputRootContext, InputUiSlot } from './types';

export const [provideInputRootContext, useInputRootContext] = useContext<InputRootContext>('InputRoot');

export const [provideInputUi, useInputUi] = useUiContext<InputUiSlot>('InputUi');
