import { onBeforeUnmount, watch } from 'vue';
import type { PopperRootContext } from './types';

export function usePopperNesting(context: PopperRootContext): void {
  const { parent } = context;
  const unregister = parent?.registerChild(context);

  if (parent) {
    watch(
      parent.open,
      open => {
        if (!open) {
          context.onOpenChange(false, 'parent-close');
        }
      },
      { immediate: true }
    );
  }

  watch(
    context.open,
    open => {
      if (!open) {
        context.closeDescendants();
      }
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    context.closeDescendants();
    context.clearTimers();
    unregister?.();
  });
}
