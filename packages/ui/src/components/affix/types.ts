import type { AffixCompactEmits, AffixCompactProps, AffixUi } from '@vean/aria/affix';
import type { ClassValue } from '@vean/aria/types';

/**
 * Properties for the Affix component.
 */
export interface AffixProps extends AffixCompactProps {
  /**
   * Additional class names to apply to the content element.
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<AffixUi>;
}

/**
 * Events for the Affix component.
 */
export type AffixEmits = AffixCompactEmits;
