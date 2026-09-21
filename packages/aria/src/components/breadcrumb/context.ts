import { useUiContext } from '../../composables';
import type { BreadcrumbUiSlot } from './types';

export const [provideBreadcrumbUi, useBreadcrumbUi] = useUiContext<BreadcrumbUiSlot>('BreadcrumbUi');
