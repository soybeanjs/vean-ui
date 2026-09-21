import { onBeforeUnmount, shallowRef, toRef, unref, watch } from 'vue';
import type { MaybeRef, ShallowRef } from 'vue';
import EmblaCarousel from 'embla-carousel';
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from './types';

export function useEmblaCarousel(
  element: ShallowRef<HTMLElement | null | undefined>,
  options: MaybeRef<EmblaOptionsType> = {},
  plugins: MaybeRef<EmblaPluginType[]> = []
) {
  const optionsRef = toRef(() => unref(options));
  const pluginsRef = toRef(() => unref(plugins));

  let storedOptions = optionsRef.value;
  let storedPlugins = pluginsRef.value;

  const carousel = shallowRef<EmblaCarouselType>();

  function reInit(): void {
    if (!carousel.value) return;
    carousel.value.reInit(storedOptions, storedPlugins);
  }

  function destroy() {
    if (!carousel.value) return;
    carousel.value.destroy();
    carousel.value = undefined;
  }

  watch(
    element,
    node => {
      destroy();

      if (node) {
        carousel.value = EmblaCarousel(node, storedOptions, storedPlugins);
      }
    },
    { flush: 'post', immediate: true }
  );

  watch(optionsRef, newOptions => {
    if (areOptionsEqual(storedOptions, newOptions)) return;
    storedOptions = newOptions;

    reInit();
  });

  watch(pluginsRef, newPlugins => {
    if (arePluginsEqual(storedPlugins, newPlugins)) return;
    storedPlugins = newPlugins;
    reInit();
  });

  onBeforeUnmount(() => {
    destroy();
  });

  return carousel;
}

function isRecord(subject: unknown): subject is Record<string, unknown> {
  return Object.prototype.toString.call(subject) === '[object Object]' || Array.isArray(subject);
}

/** Local `embla-carousel-reactive-utils` equivalents so the package only depends on `embla-carousel` itself. */
function areOptionsEqual(optionsA: Record<string, unknown>, optionsB: Record<string, unknown>): boolean {
  const optionsAKeys = Object.keys(optionsA);
  const optionsBKeys = Object.keys(optionsB);

  if (optionsAKeys.length !== optionsBKeys.length) return false;

  const breakpointsA = JSON.stringify(Object.keys((optionsA.breakpoints as object) || {}));
  const breakpointsB = JSON.stringify(Object.keys((optionsB.breakpoints as object) || {}));

  if (breakpointsA !== breakpointsB) return false;

  return optionsAKeys.every(key => {
    const valueA = optionsA[key];
    const valueB = optionsB[key];

    if (typeof valueA === 'function') return String(valueA) === String(valueB);
    if (!isRecord(valueA) || !isRecord(valueB)) return valueA === valueB;

    return areOptionsEqual(valueA, valueB);
  });
}

function sortAndMapPluginToOptions(plugins: EmblaPluginType[]) {
  return plugins
    .concat()
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map(plugin => plugin.options ?? {});
}

function arePluginsEqual(pluginsA: EmblaPluginType[], pluginsB: EmblaPluginType[]): boolean {
  if (pluginsA.length !== pluginsB.length) return false;

  const optionsA = sortAndMapPluginToOptions(pluginsA);
  const optionsB = sortAndMapPluginToOptions(pluginsB);

  return optionsA.every((optionA, index) => areOptionsEqual(optionA, optionsB[index]!));
}
