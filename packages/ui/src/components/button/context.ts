import { useContext } from '@vean/aria/composables';
import type { ButtonGroupContext } from './types';

export const [provideButtonGroupContext, useButtonGroupContext] = useContext<ButtonGroupContext>('ButtonGroup');
