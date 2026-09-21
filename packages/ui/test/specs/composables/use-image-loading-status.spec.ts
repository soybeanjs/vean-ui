import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import { TEST_DELAYS, delay, setupMockImage } from '../../shared';
import { useImageLoadingStatus } from '../../../../aria/src/composables/use-image-loading-status';

describe('useImageLoadingStatus', () => {
  let cleanupMockImage: () => void;

  beforeEach(() => {
    cleanupMockImage = setupMockImage();
  });

  afterEach(() => {
    cleanupMockImage();
  });

  it('should set error status for empty src', async () => {
    const status = useImageLoadingStatus({ src: '' });
    await nextTick();
    expect(status.value).toBe('error');
  });

  it('should set loading status when src is provided', async () => {
    const status = useImageLoadingStatus({ src: 'https://example.com/image.jpg' });
    await nextTick();
    expect(status.value).toBe('loading');
  });

  it('should set loaded status when image loads successfully', async () => {
    const status = useImageLoadingStatus({ src: 'https://example.com/image.jpg' });

    await nextTick();
    expect(status.value).toBe('loading');

    // Wait for mock image to load
    await delay(TEST_DELAYS.IMAGE_LOAD);
    expect(status.value).toBe('loaded');
  });

  it('should set error status when image fails to load', async () => {
    const status = useImageLoadingStatus({ src: 'https://example.com/error.jpg' });

    await nextTick();
    expect(status.value).toBe('loading');

    // Wait for mock image to error
    await delay(TEST_DELAYS.IMAGE_LOAD);
    expect(status.value).toBe('error');
  });

  it('should handle reactive src changes', async () => {
    const src = ref('https://example.com/image1.jpg');
    const status = useImageLoadingStatus({ src });

    await nextTick();
    expect(status.value).toBe('loading');

    // Wait for first image to load
    await delay(TEST_DELAYS.IMAGE_LOAD);
    expect(status.value).toBe('loaded');

    // Change src to trigger new loading
    src.value = 'https://example.com/image2.jpg';
    await nextTick();
    expect(status.value).toBe('loading');

    // Wait for second image to load
    await delay(TEST_DELAYS.IMAGE_LOAD);
    expect(status.value).toBe('loaded');
  });

  it('should handle referrerPolicy option', async () => {
    const referrerPolicy = ref<'no-referrer' | undefined>('no-referrer');
    const status = useImageLoadingStatus({
      src: 'https://example.com/image.jpg',
      referrerpolicy: referrerPolicy
    });

    await nextTick();
    expect(status.value).toBe('loading');
  });

  it('should handle crossOrigin option', async () => {
    const crossOrigin = ref<'anonymous' | undefined>('anonymous');
    const status = useImageLoadingStatus({
      src: 'https://example.com/image.jpg',
      crossorigin: crossOrigin
    });

    await nextTick();
    expect(status.value).toBe('loading');
  });

  it('should handle reactive options', async () => {
    const referrerPolicy = ref<'no-referrer' | undefined>(undefined);
    const crossOrigin = ref<'anonymous' | undefined>(undefined);

    const status = useImageLoadingStatus({
      src: 'https://example.com/image.jpg',
      referrerpolicy: referrerPolicy,
      crossorigin: crossOrigin
    });

    await nextTick();
    expect(status.value).toBe('loading');

    // Change options
    referrerPolicy.value = 'no-referrer';
    crossOrigin.value = 'anonymous';

    await nextTick();
    expect(status.value).toBe('loading');
  });

  it('should handle getter function for src', async () => {
    const currentSrc = 'https://example.com/image1.jpg';
    const status = useImageLoadingStatus({ src: currentSrc });

    await nextTick();
    expect(status.value).toBe('loading');

    // Wait for image to load
    await delay(TEST_DELAYS.IMAGE_LOAD);
    expect(status.value).toBe('loaded');
  });

  it('should clean up properly when src changes', async () => {
    const src = ref('https://example.com/image1.jpg');
    const status = useImageLoadingStatus({ src });

    await nextTick();
    expect(status.value).toBe('loading');

    // Change src before first image loads
    src.value = 'https://example.com/image2.jpg';
    await nextTick();
    expect(status.value).toBe('loading');

    // Wait for second image to load
    await delay(TEST_DELAYS.IMAGE_LOAD);
    expect(status.value).toBe('loaded');
  });
});
