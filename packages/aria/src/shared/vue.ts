import { Comment, Fragment, computed, getCurrentInstance, toValue } from 'vue';
import type { ComponentPublicInstance, MaybeRefOrGetter, VNode } from 'vue';
import type { ToContext, VNodeRef } from '../types';

/**
 * Vue's compiler generates blocks with a `patchFlag` property
 *
 * following `@vue/shared`'s `PatchFlags` enum
 */
const PatchFlags = {
  /**
   * Indicates a fragment with keyed or partially keyed children
   */
  KEYED_FRAGMENT: 128,
  /**
   * A special flag that indicates that the diffing algorithm should bail out
   * of optimized mode. For example, on block fragments created by renderSlot()
   * when encountering non-compiler generated slots (i.e. manually written
   * render functions, which should always be fully diffed)
   * OR manually cloneVNodes
   */
  BAIL: -2
};

export function getLifeCycleTarget(target?: any) {
  return target || getCurrentInstance();
}

export function getRawChildren(children: VNode[]): VNode[] {
  let ret: VNode[] = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    // handle fragment children case, e.g. v-for
    if (child.type === Fragment) {
      if ((child.patchFlag ?? 0) === PatchFlags.KEYED_FRAGMENT) {
        keyedFragmentCount++;
      }
      ret = ret.concat(getRawChildren(child.children as VNode[]));
    }
    // comment placeholders should be skipped, e.g. v-if
    else if (child.type !== Comment) {
      ret.push(child);
    }
  }

  // bail if there are multiple keyed fragments
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i]!.patchFlag = PatchFlags.BAIL;
    }
  }

  return ret;
}

export function getElFromTemplateRef<T extends HTMLElement>(nodeRef: VNodeRef) {
  let node: T | undefined = (nodeRef as ComponentPublicInstance)?.$el ?? nodeRef;

  if (node && node.nodeType !== 1) {
    node = undefined;
  }

  return node;
}

/**
 * Builds a reactive context value map (`ComputedRef` per key) from a source object.
 *
 * `source` accepts anything `toValue` understands — a reactive object such as `props`, a
 * ref / computed of an object, or a getter returning one. Values are taken as-is, so a
 * function-valued key stays a function in the context. Keys default to every own key of
 * the resolved source.
 */
export function toContext<T extends object, K extends keyof T = keyof T>(
  source: MaybeRefOrGetter<T>,
  keys?: K[]
): ToContext<T, K> {
  return (keys ?? (Object.keys(toValue(source)) as K[])).reduce(
    (acc, key) => {
      acc[key] = computed(() => toValue(source)[key]);

      return acc;
    },
    {} as ToContext<T, K>
  );
}

/**
 * Snapshots a `toContext`-built context back into plain values (all own keys by default).
 * A nullish context yields an empty object, whose missing keys behave like `undefined`
 * ones in `defu` resolution chains.
 */
export function fromContext<T extends object, K extends keyof T = keyof T>(
  context: ToContext<T, K> | null | undefined,
  keys?: K[]
): Partial<T> {
  if (!context) {
    return {};
  }

  return (keys ?? (Object.keys(context) as K[])).reduce((acc, key) => {
    acc[key] = context[key].value;

    return acc;
  }, {} as Partial<T>);
}

export function isFormControl(el?: HTMLElement | null) {
  // We set this to true by default so that events bubble to forms without JS (SSR)
  if (!el) return true;

  return 'classList' in el && el.classList.contains('form');
}

type RefToValue<T extends MaybeRefOrGetter> = T extends MaybeRefOrGetter<infer V> ? V : never;

export const getMergedRefsValue = <T extends Record<string, MaybeRefOrGetter>>(refs: T) => {
  const merged = {} as { [K in keyof T]: RefToValue<T[K]> };

  for (const key in refs) {
    merged[key] = toValue(refs[key]);
  }

  return merged;
};

export const getVueBooleanCasting = (value?: boolean | '') => {
  return Boolean(value) || value === '';
};
