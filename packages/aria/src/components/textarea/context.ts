import { useContext, useUiContext } from '../../composables';
import type { TextareaRootContext, TextareaUiSlot } from './types';

export const [provideTextareaRootContext, useTextareaRootContext] = useContext<TextareaRootContext>('TextareaRoot');

export const [provideTextareaUi, useTextareaUi] = useUiContext<TextareaUiSlot>('TextareaUi');
