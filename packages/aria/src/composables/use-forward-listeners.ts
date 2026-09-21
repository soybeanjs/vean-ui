import { getCurrentInstance } from 'vue';

export function useForwardListeners<T extends string>(emit: (...args: any[]) => void) {
  const vm = getCurrentInstance();

  const events: T[] = vm?.type?.emits || [];
  const listeners = {} as Record<T, (...args: any[]) => void>;

  events.forEach(name => {
    listeners[name] = (...args: any[]) => {
      emit(name, ...args);
    };
  });

  return listeners;
}
