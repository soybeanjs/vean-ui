import { provideTabsUi } from '../tabs/context';
import { useUiContext } from '../../composables';
import type { SegmentUiSlot } from './types';

export const [provideSegmentUi, useSegmentUi] = useUiContext<SegmentUiSlot>('SegmentUi', ui => {
  provideTabsUi(ui);

  return ui;
});
