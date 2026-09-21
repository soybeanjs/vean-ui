export { default as AffixCompact } from './affix-compact.vue';
export { default as AffixRoot } from './affix-root.vue';
export { default as AffixPlaceholder } from './affix-placeholder.vue';
export { default as AffixContent } from './affix-content.vue';

export { provideAffixUi } from './context';

export type {
  AffixCompactProps,
  AffixCompactEmits,
  AffixRootProps,
  AffixRootEmits,
  AffixPlaceholderProps,
  AffixContentProps,
  AffixTarget,
  AffixState,
  AffixUiSlot,
  AffixUi
} from './types';
