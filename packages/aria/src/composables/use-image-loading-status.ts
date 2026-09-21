import { onWatcherCleanup, shallowRef, toValue, watchEffect } from 'vue';
import type { ImgHTMLAttributes, MaybeRefOrGetter } from 'vue';
import { isClient } from '../shared';
import type { ImageLoadingStatus } from '../types';

interface ImageLoadingOptions {
  src: MaybeRefOrGetter<string>;
  referrerpolicy?: MaybeRefOrGetter<ImgHTMLAttributes['referrerpolicy']>;
  crossorigin?: MaybeRefOrGetter<ImgHTMLAttributes['crossorigin']>;
}

/**
 * Composable for tracking image loading status
 *
 * @param options - Additional image loading options
 * @returns Reactive loading status
 */
export function useImageLoadingStatus(options: ImageLoadingOptions) {
  const { src, referrerpolicy, crossorigin } = options;
  const loadingStatus = shallowRef<ImageLoadingStatus>('idle');

  // Early return for SSR
  if (!isClient) return loadingStatus;

  watchEffect(() => {
    const srcValue = toValue(src);
    const referrerPolicy = toValue(referrerpolicy);
    const crossOrigin = toValue(crossorigin);

    if (!srcValue) {
      loadingStatus.value = 'error';
      return;
    }

    let isMounted = true;
    const image = new window.Image();

    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (!isMounted) return;
      loadingStatus.value = status;
    };

    // Set loading status immediately
    loadingStatus.value = 'loading';

    // Configure image properties
    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy;
    }
    if (crossOrigin !== undefined) {
      image.crossOrigin = crossOrigin;
    }

    // Set up event listeners
    const onLoad = updateStatus('loaded');
    const onError = updateStatus('error');

    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);

    // Start loading
    image.src = srcValue;

    onWatcherCleanup(() => {
      isMounted = false;
      // Clean up image to prevent memory leaks
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    });
  });

  return loadingStatus;
}
