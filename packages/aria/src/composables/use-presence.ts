import { computed, onWatcherCleanup, toValue, watchPostEffect } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { useStateMachine } from './use-state-machine';

export function usePresence(
  elRef: Ref<HTMLElement | null | undefined>,
  present: MaybeRefOrGetter<boolean | undefined>,
  onChange?: (value: boolean) => void
) {
  let styles: CSSStyleDeclaration = {} as CSSStyleDeclaration;
  let prevAnimationName = 'none';
  const initialState = toValue(present) ? 'mounted' : 'unmounted';

  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: 'unmounted',
      ANIMATION_OUT: 'unmountSuspended'
    },
    unmountSuspended: {
      MOUNT: 'mounted',
      ANIMATION_END: 'unmounted'
    },
    unmounted: {
      MOUNT: 'mounted'
    }
  });

  const isPresent = computed(() => ['mounted', 'unmountSuspended'].includes(state.value));

  /**
   * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel` event for ANIMATION_IN after we
   * have entered `unmountSuspended` state. So, we make sure we only trigger ANIMATION_END for the currently active
   * animation.
   */
  const handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target !== elRef.value) return;

    const currentAnimationName = getAnimationName(styles);
    const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));

    if (isCurrentAnimation) {
      // With React 18 concurrency this update is applied
      // a frame after the animation ends, creating a flash of visible content.
      // By manually flushing we ensure they sync within a frame, removing the flash.
      send('ANIMATION_END');
      return;
    }

    // A cancelled animation whose animation-name no longer resolves (e.g. its
    // styles were removed mid-flight) never fires a matching `animationend`;
    // without this the machine would stay stuck in `unmountSuspended` forever.
    if (currentAnimationName === 'none') {
      send('ANIMATION_END');
    }
  };

  const handleAnimationStart = (event: AnimationEvent) => {
    if (event.target === elRef.value) {
      // if animation occurred, store its name as the previous animation.
      prevAnimationName = getAnimationName(styles);
    }
  };

  // Watch for animation name changes and update prevAnimationName
  watchPostEffect(() => {
    const currentAnimationName = getAnimationName(styles);
    prevAnimationName = state.value === 'mounted' ? currentAnimationName : 'none';
  });

  // Watch for present state changes and trigger state machine transitions
  watchPostEffect(() => {
    const newValue = toValue(present);

    onChange?.(Boolean(newValue));

    const currentAnimationName = getAnimationName(styles);

    if (newValue) {
      send('MOUNT');
    } else if (currentAnimationName === 'none' || styles?.display === 'none') {
      // If there is no exit animation or the element is hidden, animations won't run
      // so we unmount instantly
      send('UNMOUNT');
    } else {
      /**
       * When `present` changes to `false`, we check changes to animation-name to determine whether an animation has
       * started. We chose this approach (reading computed styles) because there is no `animationrun` event and
       * `animationstart` fires after `animation-delay` has expired which would be too late.
       */
      const isAnimating = prevAnimationName !== currentAnimationName;

      if (isAnimating) {
        send('ANIMATION_OUT');
      } else {
        send('UNMOUNT');
      }
    }
  });

  // Watch for element ref changes and manage event listeners
  watchPostEffect(() => {
    const node = elRef.value;

    if (node) {
      styles = getComputedStyle(node);
      node.addEventListener('animationstart', handleAnimationStart);
      node.addEventListener('animationcancel', handleAnimationEnd);
      node.addEventListener('animationend', handleAnimationEnd);

      onWatcherCleanup(() => {
        node.removeEventListener('animationstart', handleAnimationStart);
        node.removeEventListener('animationcancel', handleAnimationEnd);
        node.removeEventListener('animationend', handleAnimationEnd);
      });
    } else {
      // Transition to the unmounted state if the el is removed prematurely.
      // We avoid doing so during cleanup as the el may change but still exist.
      send('ANIMATION_END');
    }
  });

  return isPresent;
}

function getAnimationName(styles?: CSSStyleDeclaration) {
  return styles?.animationName || 'none';
}
