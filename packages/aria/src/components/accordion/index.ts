export { default as AccordionCompact } from './accordion-compact.vue';
export { default as AccordionRoot } from './accordion-root.vue';
export { default as AccordionItem } from './accordion-item.vue';
export { default as AccordionHeader } from './accordion-header.vue';
export { default as AccordionTrigger } from './accordion-trigger.vue';
export { default as AccordionContent } from './accordion-content.vue';
export { default as AccordionDescription } from './accordion-description.vue';

export { provideAccordionUi } from './context';

export type {
  AccordionCompactProps,
  AccordionCompactEmits,
  AccordionCompactSlots,
  AccordionCompactSlotProps,
  AccordionRootProps,
  AccordionRootEmits,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionDescriptionProps,
  AccordionOptionData,
  AccordionUiSlot,
  AccordionUi
} from './types';
