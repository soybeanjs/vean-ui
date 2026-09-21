import type {
  CommandCompactEmits,
  CommandCompactProps,
  CommandCompactSlots,
  CommandSingleOptionData,
  CommandUi
} from '@vean/aria/command';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Command component.
 */
export interface CommandProps<
  T extends CommandSingleOptionData = CommandSingleOptionData
> extends CommandCompactProps<T> {
  /** Root class. */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<CommandUi>;
}

/**
 * Events for the Command component.
 */
export type CommandEmits = CommandCompactEmits;

/**
 * Slots for the Command component.
 */
export type CommandSlots<T extends CommandSingleOptionData = CommandSingleOptionData> = CommandCompactSlots<T>;
