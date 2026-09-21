import type { ImgHTMLAttributes } from 'vue';
import type { BaseProps, ImageLoadingStatus, UiClass } from '../../types';

/**
 * Properties for the AvatarRoot component.
 */
export interface AvatarRootProps extends BaseProps {}

/**
 * Properties for the AvatarImage component.
 */
export interface AvatarImageProps extends BaseProps<ImgHTMLAttributes> {
  /** The image source URL */
  src: string;
  /**
   * Alternate text for the image. When unset the avatar's fallback label is used so the loaded image keeps an
   * accessible name; set to `''` to mark a purely decorative avatar.
   *
   * @defaultValue undefined
   */
  alt?: string;
  /** The referrer policy for the image */
  referrerpolicy?: ImgHTMLAttributes['referrerpolicy'];
  /** The cross-origin setting for the image */
  crossorigin?: ImgHTMLAttributes['crossorigin'];
}
/**
 * Events for the AvatarImage component.
 */
export type AvatarImageEmits = {
  /**
   * Event handler called when the image loading status changes. This is useful for controlling what to render as the
   * image is loading.
   */
  loadingStatusChange: [status: ImageLoadingStatus];
};

/**
 * Properties for the AvatarFallback component.
 */
export interface AvatarFallbackProps extends BaseProps {
  /**
   * Useful for delaying rendering so it only appears for those with slower connections.
   *
   * @defaultValue undefined
   */
  delayMs?: number;
}

/**
 * Properties for the AvatarCompact component.
 */
export interface AvatarCompactProps extends AvatarRootProps {
  /** The image source URL. */
  src: string;
  /**
   * Useful for delaying fallback rendering so it only appears for those with slower connections.
   *
   * @defaultValue undefined
   */
  delayMs?: number;
  /** Fallback text rendered when no custom fallback slot is provided. */
  fallbackLabel?: string;
  /** Properties forwarded to the image element. */
  imageProps?: AvatarImageProps;
  /** Properties forwarded to the fallback element. */
  fallbackProps?: AvatarFallbackProps;
}

/**
 * Events for the AvatarCompact component.
 */
export type AvatarCompactEmits = AvatarImageEmits;

/**
 * Slots for the AvatarCompact component.
 */
export type AvatarCompactSlots = {
  /** Custom content for the default slot. */
  default?: () => any;
  /** Custom content for the image slot. */
  image?: () => any;
  /** Custom content for the fallback slot. */
  fallback?: () => any;
};

/**
 * Available UI slots for the Avatar component.
 */
export type AvatarUiSlot = 'root' | 'image' | 'fallback';

/**
 * UI class overrides for the Avatar component.
 */
export type AvatarUi = UiClass<AvatarUiSlot>;
