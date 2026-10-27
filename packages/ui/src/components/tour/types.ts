import type { TourCompactProps, TourCompactEmits, TourCompactSlots, TourUi } from '@vean/aria/tour';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/** Properties for the Tour component. */
export interface TourProps extends TourCompactProps {
  /** Class applied to the popup surface. */
  class?: ClassValue;
  /** Use the emphasized primary bubble appearance. Omit for the default appearance. */
  type?: 'primary';
  /** Visual size of the component. */
  size?: ThemeSize;
  /** Per-slot class overrides for the component. */
  ui?: Partial<TourUi>;
}

/** Events for the Tour component. */
export type TourEmits = TourCompactEmits;

/** Slots for the Tour component. */
export type TourSlots = TourCompactSlots;
