export type HTMLAttributeReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export type HTMLAttributeCrossOrigin = 'anonymous' | 'use-credentials' | '';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
