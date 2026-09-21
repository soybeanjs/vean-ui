import { useCollection, useContext, useUiContext } from '../../composables';
import type { TagsInputCollectionItemData, TagsInputItemContext, TagsInputRootContext, TagsInputUiSlot } from './types';

export const { provideCollectionContext, useCollectionContext, useCollectionItem } =
  useCollection<TagsInputCollectionItemData>('TagsInput');

export const [provideTagsInputRootContext, useTagsInputRootContext] = useContext<TagsInputRootContext>('TagsInputRoot');

export const [provideTagsInputItemContext, useTagsInputItemContext] = useContext<TagsInputItemContext>('TagsInputItem');

export const [provideTagsInputUi, useTagsInputUi] = useUiContext<TagsInputUiSlot>('TagsInputUi');
