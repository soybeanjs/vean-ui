import { computed, shallowRef, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { ALL_TOAST_POSITIONS } from './shared';
import type { ToastT, ToastPosition, ToastHeight } from './types';

interface UseToastStateOptions {
  id: MaybeRefOrGetter<ToastT['id'] | undefined>;
  position: MaybeRefOrGetter<ToastPosition>;
}

export const useToastState = (options: UseToastStateOptions) => {
  const { id, position } = options;

  const toasts = shallowRef<ToastT[]>([]);
  const heights = shallowRef<ToastHeight[]>([]);

  const filtered = computed<ToastT[]>(() =>
    toasts.value.filter(toast => (toValue(id) && toast.toasterId === toValue(id)) || !toast.toasterId)
  );

  const allPositions = computed(() => {
    const positions = new Set<ToastPosition>();

    filtered.value.forEach(toast => {
      const pos = toast.position || toValue(position);
      positions.add(pos);
    });

    ALL_TOAST_POSITIONS.forEach(pos => {
      if (!positions.has(pos)) {
        positions.add(pos);
      }
    });

    return Array.from(positions);
  });

  const positionZIndex = computed(() => {
    const record = {} as Record<ToastPosition, number>;

    allPositions.value.forEach((pos, index) => {
      record[pos] = 9999 - index;
    });

    return record;
  });

  const allToasts = computed(() => {
    const record = ALL_TOAST_POSITIONS.reduce(
      (acc, pos) => {
        acc[pos] = [];
        return acc;
      },
      {} as Record<ToastPosition, ToastT[]>
    );

    filtered.value.forEach(toast => {
      const pos = toast.position || toValue(position);
      record[pos].push(toast);
    });

    return record;
  });

  const allHeights = computed(() => {
    const record = ALL_TOAST_POSITIONS.reduce(
      (acc, pos) => {
        acc[pos] = [];
        return acc;
      },
      {} as Record<ToastPosition, ToastHeight[]>
    );

    heights.value.forEach(height => {
      record[height.position].push(height);
    });

    return record;
  });

  return {
    toasts,
    filtered,
    heights,
    allPositions,
    positionZIndex,
    allToasts,
    allHeights
  };
};
