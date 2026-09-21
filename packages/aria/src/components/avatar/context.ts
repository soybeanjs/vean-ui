import { shallowRef } from 'vue';
import { useContext, useUiContext } from '../../composables';
import type { ImageLoadingStatus } from '../../types';
import type { AvatarUiSlot } from './types';

export const [provideAvatarRootContext, useAvatarRootContext] = useContext('AvatarRoot', () => {
  const imageLoadingStatus = shallowRef<ImageLoadingStatus>('idle');

  const updateImageLoadingStatus = (status: ImageLoadingStatus) => {
    imageLoadingStatus.value = status;
  };

  return {
    imageLoadingStatus,
    updateImageLoadingStatus
  };
});

export const [provideAvatarUi, useAvatarUi] = useUiContext<AvatarUiSlot>('AvatarUi');
