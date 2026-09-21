import { shallowRef } from 'vue';
import type { ShallowRef } from 'vue';

interface Machine<S> {
  [k: string]: { [k: string]: S };
}
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;

export function useStateMachine<M extends object>(
  initialState: MachineState<M>,
  machine: M & Machine<MachineState<M>>
) {
  const state = shallowRef(initialState) as ShallowRef<MachineState<M>>;

  function reducer(event: MachineEvent<M>) {
    // @ts-expect-error - event is a key of machine[state]
    const nextState = machine[state.value][event];
    return nextState ?? state.value;
  }

  function send(event: MachineEvent<M>) {
    state.value = reducer(event);
  }

  return [state, send] as const;
}
