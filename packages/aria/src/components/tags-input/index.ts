export { default as TagsInputCompact } from './tags-input-compact.vue';
export { default as TagsInputRoot } from './tags-input-root.vue';
export { default as TagsInputItem } from './tags-input-item.vue';
export { default as TagsInputItemText } from './tags-input-item-text.vue';
export { default as TagsInputItemDelete } from './tags-input-item-delete.vue';
export { default as TagsInputControl } from './tags-input-control.vue';
export { default as TagsInputClear } from './tags-input-clear.vue';

export { provideTagsInputUi } from './context';

export type {
  TagsInputCompactProps,
  TagsInputCompactEmits,
  TagsInputCompactSlots,
  TagsInputRootProps,
  TagsInputRootEmits,
  TagsInputItemProps,
  TagsInputItemTextProps,
  TagsInputItemDeleteProps,
  TagsInputControlProps,
  TagsInputClearProps,
  TagsInputCompactSlotProps,
  TagsInputUiSlot,
  TagsInputUi
} from './types';
