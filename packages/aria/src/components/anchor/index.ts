export { default as AnchorCompact } from './anchor-compact.vue';
export { default as AnchorItemCompact } from './anchor-item-compact.vue';
export { default as AnchorLink } from './anchor-link.vue';
export { default as AnchorRoot } from './anchor-root.vue';

export { provideAnchorUi } from './context';

export type {
  AnchorCompactProps,
  AnchorCompactEmits,
  AnchorRootProps,
  AnchorRootEmits,
  AnchorItemCompactProps,
  AnchorLinkProps,
  AnchorContainer,
  AnchorOptionData,
  AnchorUi,
  AnchorUiSlot
} from './types';
