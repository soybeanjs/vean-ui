<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import type { VNodeChild } from 'vue';
import { defaultDocument, defaultWindow, useEventListener, useResizeObserver } from '@vueuse/core';
import { prefersReducedMotion } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useBodyScrollLock, useControllableState } from '../../composables';
import type { PopperReferenceElement } from '../popper/types';
import { createTourMaskPath, interpolateTourRect } from './shared';
import { provideTourRootContext } from './context';
import type {
  TourRootProps,
  TourRootEmits,
  TourCloseReason,
  TourTarget,
  TourSlotProps,
  TourRootContext
} from './types';

defineOptions({
  name: 'TourRoot',
  inheritAttrs: false
});

type TourStepDefinition = Exclude<TourRootContext['activeStep']['value'], undefined>;

type RegisteredTourStep = {
  id: symbol;
  resolveStep: () => TourStepDefinition;
};

const props = withDefaults(defineProps<TourRootProps>(), {
  modelValue: undefined,
  open: undefined,
  defaultOpen: false,
  current: undefined,
  defaultCurrent: 0,
  lockScroll: true,
  autoScroll: true,
  scrollIntoViewOptions: true,
  closeOnPressEscape: true,
  spotlightPadding: 6,
  spotlightRadius: 2
});

const emit = defineEmits<TourRootEmits>();

defineSlots<{
  default?: (props: TourSlotProps) => VNodeChild;
  steps?: () => VNodeChild;
}>();

const open = useControllableState(
  () => props.open ?? props.modelValue,
  value => {
    emit('update:modelValue', value);
    emit('update:open', value);
  },
  props.defaultOpen
);

const current = useControllableState(
  () => props.current,
  value => emit('update:current', value),
  props.defaultCurrent
);

const dir = useDirection(() => props.dir);
const targetElement = shallowRef<HTMLElement | SVGElement>();
const targetRect = shallowRef<DOMRect | null>(null);
const spotlightRect = shallowRef<DOMRect | null>(null);
const viewportSize = shallowRef({ width: 0, height: 0 });
const registeredSteps = shallowRef<RegisteredTourStep[]>([]);
let spotlightAnimationFrameId: number | undefined;
let releaseScrollLock: (() => void) | undefined;

const SPOTLIGHT_TRANSITION_DURATION = 320;
const steps = computed(() =>
  props.steps?.length ? props.steps : registeredSteps.value.map(({ resolveStep }) => resolveStep())
);
const totalSteps = computed(() => steps.value.length);
const currentStep = computed(() => {
  if (totalSteps.value === 0) return 0;

  return Math.min(Math.max(current.value, 0), totalSteps.value - 1) + 1;
});
const activeStep = computed(() => steps.value[currentStep.value - 1]);
const currentTarget = computed(() => activeStep.value?.target);
const isFirstStep = computed(() => currentStep.value <= 1);
const isLastStep = computed(() => totalSteps.value === 0 || currentStep.value >= totalSteps.value);

const virtualReference: PopperReferenceElement = {
  contextElement: defaultDocument?.documentElement,
  getBoundingClientRect: () =>
    DOMRect.fromRect({
      x: viewportSize.value.width / 2,
      y: viewportSize.value.height / 2,
      width: 0,
      height: 0
    })
};

const reference = computed<PopperReferenceElement>(() => targetElement.value ?? virtualReference);

const maskPath = computed(() =>
  createTourMaskPath(
    viewportSize.value.width,
    viewportSize.value.height,
    spotlightRect.value,
    props.spotlightPadding,
    props.spotlightRadius
  )
);

function resolveTarget(target: TourTarget | undefined): HTMLElement | SVGElement | undefined {
  if (!target || !defaultDocument) return undefined;
  if (typeof target === 'function') return target() ?? undefined;
  if (typeof target !== 'string') return target;

  try {
    return defaultDocument.querySelector<HTMLElement | SVGElement>(target) ?? undefined;
  } catch {
    return undefined;
  }
}

function cancelSpotlightAnimation() {
  if (spotlightAnimationFrameId === undefined) return;

  defaultWindow?.cancelAnimationFrame(spotlightAnimationFrameId);
  spotlightAnimationFrameId = undefined;
}

function updateGeometry() {
  viewportSize.value = {
    width: defaultWindow?.innerWidth ?? 0,
    height: defaultWindow?.innerHeight ?? 0
  };

  const target = targetElement.value;
  targetRect.value = open.value && target?.isConnected ? target.getBoundingClientRect() : null;

  if (spotlightAnimationFrameId === undefined) {
    spotlightRect.value = targetRect.value;
  }
}

function animateSpotlight(fromRect: DOMRect) {
  cancelSpotlightAnimation();

  const animationWindow = defaultWindow;
  const target = targetElement.value;

  if (!animationWindow || !target || prefersReducedMotion()) {
    spotlightRect.value = targetRect.value;

    return;
  }

  const requestNextFrame = animationWindow.requestAnimationFrame.bind(animationWindow);
  const startTime = animationWindow.performance.now();

  function updateSpotlight(timestamp: number) {
    const activeTarget = targetElement.value;

    if (!open.value || !activeTarget?.isConnected) {
      spotlightRect.value = null;
      spotlightAnimationFrameId = undefined;

      return;
    }

    const nextRect = activeTarget.getBoundingClientRect();
    const progress = Math.min((timestamp - startTime) / SPOTLIGHT_TRANSITION_DURATION, 1);

    targetRect.value = nextRect;
    spotlightRect.value = interpolateTourRect(fromRect, nextRect, progress);

    if (progress < 1) {
      spotlightAnimationFrameId = requestNextFrame(updateSpotlight);

      return;
    }

    spotlightRect.value = nextRect;
    spotlightAnimationFrameId = undefined;
  }

  spotlightRect.value = fromRect;
  spotlightAnimationFrameId = requestNextFrame(updateSpotlight);
}

function syncTarget(animate = false) {
  const previousSpotlightRect = spotlightRect.value;

  if (!open.value || !activeStep.value) {
    cancelSpotlightAnimation();
    targetElement.value = undefined;
    targetRect.value = null;
    spotlightRect.value = null;
    updateGeometry();

    return;
  }

  const target = resolveTarget(activeStep.value.target);
  targetElement.value = target?.isConnected ? target : undefined;

  if (targetElement.value && props.autoScroll && props.scrollIntoViewOptions !== false) {
    const scrollOptions = props.scrollIntoViewOptions;
    const options: ScrollIntoViewOptions =
      scrollOptions && typeof scrollOptions === 'object'
        ? scrollOptions
        : { behavior: 'smooth', block: 'center', inline: 'center' };

    targetElement.value.scrollIntoView(options);
  }

  updateGeometry();

  if (animate && previousSpotlightRect && targetRect.value) {
    animateSpotlight(previousSpotlightRect);

    return;
  }

  cancelSpotlightAnimation();
  spotlightRect.value = targetRect.value;
}

function syncScrollLock(shouldLock: boolean) {
  if (shouldLock) {
    if (!releaseScrollLock) {
      releaseScrollLock = useBodyScrollLock();
    }

    return;
  }

  releaseScrollLock?.();
  releaseScrollLock = undefined;
}

function close(reason: TourCloseReason = 'close-button') {
  if (!open.value) return;

  emit('close', reason);
  open.value = false;
}

function previous() {
  if (isFirstStep.value) return;

  current.value = currentStep.value - 2;
}

function next() {
  if (totalSteps.value === 0) return;

  if (isLastStep.value) {
    emit('finish', currentStep.value - 1);
    close('finish');

    return;
  }

  current.value = currentStep.value;
}

function onKeydown(event: KeyboardEvent) {
  if (open.value && props.closeOnPressEscape && event.key === 'Escape' && !event.defaultPrevented) {
    event.preventDefault();
    close('escape');
  }
}

const slotProps = computed<TourSlotProps>(() => ({
  step: activeStep.value,
  currentStep: currentStep.value,
  current: currentStep.value - 1,
  totalSteps: totalSteps.value,
  total: totalSteps.value,
  isFirstStep: isFirstStep.value,
  isLastStep: isLastStep.value,
  previous,
  next,
  close
}));

function registerStep(id: symbol, resolveStep: RegisteredTourStep['resolveStep']) {
  if (registeredSteps.value.some(step => step.id === id)) return;

  registeredSteps.value = [...registeredSteps.value, { id, resolveStep }];
}

function unregisterStep(id: symbol) {
  registeredSteps.value = registeredSteps.value.filter(step => step.id !== id);
}

provideTourRootContext({
  open,
  currentStep,
  totalSteps,
  activeStep,
  targetElement,
  targetRect,
  viewportSize,
  maskPath,
  reference,
  dir,
  isFirstStep,
  isLastStep,
  previous,
  next,
  close,
  registerStep,
  unregisterStep
});

useEventListener(defaultWindow, 'resize', updateGeometry);
useEventListener(defaultWindow, 'scroll', updateGeometry, { capture: true, passive: true });
useResizeObserver(targetElement, updateGeometry);
useEventListener(defaultDocument, 'keydown', onKeydown);

watch(
  [open, currentStep, currentTarget],
  ([isOpen, step, target], [wasOpen, previousStep, previousTarget]) => {
    const shouldAnimate = isOpen && wasOpen && (step !== previousStep || target !== previousTarget);

    syncTarget(shouldAnimate);
    syncScrollLock(isOpen && (props.lockScroll ?? true));
  },
  { flush: 'post' }
);
watch(
  () => props.lockScroll,
  shouldLock => syncScrollLock(open.value && (shouldLock ?? true))
);
watch(currentStep, value => {
  if (value > 0) {
    emit('change', value - 1);
  }
});

onMounted(() => {
  syncTarget();
  syncScrollLock(open.value && (props.lockScroll ?? true));
});
onBeforeUnmount(() => {
  cancelSpotlightAnimation();
  syncScrollLock(false);
});
</script>

<template>
  <slot name="steps" />
  <slot v-bind="slotProps" />
</template>
