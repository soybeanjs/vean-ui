import { useUiContext } from '@vean/aria/composables';
import type { ListUiSlot } from './types';

/**
 * The list family is UI-only (`list` failed Aria admission), so the slot-class channel is
 * established here instead of in Aria. `SList` provides the recipe, `SListItem` consumes the
 * `item` / `content` / `title` / `description` slots.
 */
export const [provideListUi, useListUi] = useUiContext<ListUiSlot>('ListUi');
