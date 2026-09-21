<script setup lang="ts">
import { computed, nextTick, useAttrs, onBeforeUnmount, onMounted, onWatcherCleanup, shallowRef, watch } from 'vue';
import { toContext, isClient } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import {
  getAnchorOffsetTop,
  getAnchorScrollTop,
  getAnchorSections,
  getCurrentAnchorHref,
  getLocationHash,
  resolveAnchorContainer,
  resolveLocationHashSyncTarget,
  resolveAnchorTargetElement,
  scrollContainerTo,
  updateAnchorHistory
} from './shared';
import { provideAnchorRootContext, useAnchorUi } from './context';
import type { AnchorRootProps, AnchorRootEmits, AnchorContainer } from './types';

defineOptions({
  name: 'AnchorRoot'
});

const props = withDefaults(defineProps<AnchorRootProps>(), {
  modelValue: undefined,
  bounds: 5,
  offsetTop: 0,
  orientation: 'vertical'
});

const emit = defineEmits<AnchorRootEmits>();

const forwardedProps = useOmitProps(props, [
  'bounds',
  'dir',
  'getContainer',
  'getCurrentAnchor',
  'modelValue',
  'offsetTop',
  'orientation',
  'replace',
  'targetOffset'
]);

const attrs = useAttrs();

const cls = useAnchorUi('root');
const messages = useLocaleMessages();

const ariaLabel = computed(() => (attrs['aria-label'] as string | undefined) ?? messages.value.anchor.nav);

const dir = useDirection(() => props.dir);

const activeHref = useControllableState(
  () => props.modelValue,
  value => emit('update:modelValue', value),
  ''
);

const registeredLinks = shallowRef<string[]>([]);
const isAnimating = shallowRef(false);
const animationTimer = shallowRef<number>();
const syncedLocationHash = shallowRef('');
const syncedLocationContainer = shallowRef<AnchorContainer | null>(null);

const getCurrentContainer = (): AnchorContainer | null => {
  return resolveAnchorContainer(props.getContainer);
};

const getResolvedOffsetTop = () => getAnchorOffsetTop(props.offsetTop, props.targetOffset);

const clearAnimationTimer = () => {
  if (isClient && animationTimer.value) {
    window.clearTimeout(animationTimer.value);
    animationTimer.value = undefined;
  }
};

const setActiveHref = (href: string) => {
  const nextHref = props.getCurrentAnchor?.(href) ?? href;

  if (activeHref.value === nextHref) {
    return;
  }

  activeHref.value = nextHref;
  emit('activeChange', href);
};

const getCurrentAnchor = () => {
  const container = getCurrentContainer();

  if (!container) {
    return '';
  }

  const offsetTop = getResolvedOffsetTop();
  const sections = getAnchorSections(registeredLinks.value, container);

  return getCurrentAnchorHref(sections, offsetTop + props.bounds);
};

const syncActiveAnchor = (historyMode: 'replace' | false = false) => {
  if (isAnimating.value) {
    return;
  }

  const href = getCurrentAnchor();
  setActiveHref(href);

  if (historyMode) {
    updateAnchorHistory(href, historyMode);
  }
};

const handleScroll = () => {
  syncActiveAnchor('replace');
};

const scrollToAnchor = (href: string, behavior: ScrollBehavior = 'smooth') => {
  const element = resolveAnchorTargetElement(href);
  if (!element) {
    return false;
  }

  const container = getCurrentContainer();
  if (!container) {
    return false;
  }

  const offsetTop = getResolvedOffsetTop();
  const top = getAnchorScrollTop(element, container, offsetTop);

  scrollContainerTo(container, top, behavior);

  return true;
};

const syncFromLocationHash = () => {
  const target = resolveLocationHashSyncTarget(
    getLocationHash(),
    registeredLinks.value,
    getCurrentContainer(),
    syncedLocationHash.value,
    syncedLocationContainer.value
  );

  if (!target) {
    return false;
  }

  if (target.shouldScroll) {
    const scrolled = scrollToAnchor(target.hash, 'auto');

    if (!scrolled) {
      return false;
    }
  }

  setActiveHref(target.hash);
  syncedLocationHash.value = target.hash;
  syncedLocationContainer.value = target.container;
  return true;
};

const initializeActiveAnchor = () => {
  const synced = syncFromLocationHash();

  if (!synced) {
    syncActiveAnchor();
  }
};

const scrollTo = (href: string) => {
  if (!isClient) {
    return;
  }

  const scrolled = scrollToAnchor(href);
  if (!scrolled) {
    return;
  }

  setActiveHref(href);
  isAnimating.value = true;

  clearAnimationTimer();

  animationTimer.value = window.setTimeout(() => {
    isAnimating.value = false;
    syncActiveAnchor();
  }, 300);

  updateAnchorHistory(href, props.replace ? 'replace' : 'push');
};

const registerLink = (href: string) => {
  if (registeredLinks.value.includes(href)) {
    return;
  }

  registeredLinks.value = [...registeredLinks.value, href];
};

const unregisterLink = (href: string) => {
  registeredLinks.value = registeredLinks.value.filter(link => link !== href);
};

provideAnchorRootContext({
  activeHref,
  onLinkClick: (event, payload) => {
    emit('itemSelect', event, payload);
  },
  registerLink,
  scrollTo,
  unregisterLink,
  ...toContext(props, ['dir'])
});

watch(
  // NOTE: `props.getContainer` is a user callback that may touch `window`
  // (e.g. `() => containerRef.value ?? window`); never invoke it during SSR.
  () => [registeredLinks.value, isClient ? props.getContainer?.() : null] as const,
  () => {
    const container = getCurrentContainer();
    if (!container) {
      return;
    }

    initializeActiveAnchor();

    container.addEventListener('scroll', handleScroll, { passive: true });

    onWatcherCleanup(() => {
      container.removeEventListener('scroll', handleScroll);
    });
  },
  {
    deep: true,
    immediate: true
  }
);

onMounted(async () => {
  await nextTick();
  initializeActiveAnchor();
});

onBeforeUnmount(() => {
  clearAnimationTimer();
});
</script>

<template>
  <nav
    v-bind="forwardedProps"
    data-vean-anchor-root
    :class="cls"
    :dir="dir"
    :data-orientation="orientation"
    :aria-label="ariaLabel"
  >
    <slot :model-value="activeHref" />
  </nav>
</template>
