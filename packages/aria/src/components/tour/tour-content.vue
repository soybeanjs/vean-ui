<script setup lang="ts">
import { computed, useId } from 'vue';
import { interpolate } from '../../shared';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import {
  PopperArrow,
  PopperPortal,
  PopperPositioningPositioner,
  PopperPositioningPopup,
  PopperPositioningRoot
} from '../popper';
import { useTourRootContext, useTourUi } from './context';
import type { TourCompactProps, TourCompactSlots, TourSlotProps } from './types';

defineOptions({
  name: 'TourContent',
  inheritAttrs: false
});

const props = defineProps<TourCompactProps>();

const slots = defineSlots<Omit<TourCompactSlots, 'default'>>();

const messages = useLocaleMessages();
const ui = useTourUi();
const rootContext = useTourRootContext('TourCompact');
const { open, currentStep, totalSteps, activeStep, viewportSize, maskPath, reference, dir } = rootContext;
const popupId = useId();

const slotProps = computed<TourSlotProps>(() => ({
  step: rootContext.activeStep.value,
  currentStep: rootContext.currentStep.value,
  current: rootContext.currentStep.value - 1,
  totalSteps: rootContext.totalSteps.value,
  total: rootContext.totalSteps.value,
  isFirstStep: rootContext.isFirstStep.value,
  isLastStep: rootContext.isLastStep.value,
  previous: rootContext.previous,
  next: rootContext.next,
  close: rootContext.close
}));

const hasDescription = computed(
  () => !slots.content && Boolean(slotProps.value.step?.description || activeStep.value?.content || slots.description)
);
const progressText = computed(() =>
  interpolate(messages.value.tour.stepOf, {
    current: String(currentStep.value),
    total: String(totalSteps.value)
  })
);
const resolvedCloseLabel = computed(() => props.closeLabel ?? messages.value.tour.close);
const resolvedPreviousText = computed(() => props.previousText ?? messages.value.tour.previous);
const resolvedNextText = computed(() => props.nextText ?? messages.value.tour.next);
const resolvedFinishText = computed(() => props.finishText ?? messages.value.tour.finish);
const resolvedPlacement = computed(() => slotProps.value.step?.placement ?? props.placement ?? 'bottom');
const resolvedPositionerProps = computed(() => ({
  ...props.positionerProps,
  sideOffset: props.positionerProps?.sideOffset ?? 12
}));
const viewBox = computed(() => `0 0 ${viewportSize.value.width} ${viewportSize.value.height}`);

function handleMaskClick() {
  if (props.maskClosable) {
    rootContext.close('mask');
  }
}
</script>

<template>
  <PopperPortal v-bind="props.portalProps">
    <svg
      v-if="open && totalSteps > 0 && (slotProps.step?.showMask ?? props.showMask) && maskPath"
      :class="ui.mask"
      :viewBox="viewBox"
      :width="viewportSize.width"
      :height="viewportSize.height"
      aria-hidden="true"
      focusable="false"
      data-vean-tour-mask
      @click="handleMaskClick"
    >
      <path :d="maskPath" fill-rule="evenodd" />
    </svg>

    <PopperPositioningRoot v-if="open && totalSteps > 0" :dir="dir">
      <PopperPositioningPositioner
        v-bind="resolvedPositionerProps"
        :open="open"
        :reference="reference"
        :placement="resolvedPlacement"
      >
        <PopperPositioningPopup
          v-bind="props.popupProps"
          :id="popupId"
          role="dialog"
          :aria-modal="false"
          :aria-labelledby="slotProps.step?.title || slots.title ? `${popupId}-title` : undefined"
          :aria-label="slotProps.step?.title || slots.title ? undefined : messages.tour.ariaLabel"
          :aria-describedby="hasDescription ? `${popupId}-description` : undefined"
          data-vean-tour-popup
        >
          <slot name="content" v-bind="slotProps">
            <header :class="ui.header">
              <h2 v-if="slotProps.step?.title || slots.title" :id="`${popupId}-title`" :class="ui.title">
                <slot name="title" v-bind="slotProps">{{ slotProps.step?.title }}</slot>
              </h2>
              <div v-if="activeStep?.content && !slots.description" :id="`${popupId}-description`">
                <component :is="activeStep.content" />
              </div>
              <p v-else-if="hasDescription" :id="`${popupId}-description`" :class="ui.description">
                <slot name="description" v-bind="slotProps">{{ slotProps.step?.description }}</slot>
              </p>
            </header>

            <footer :class="ui.footer">
              <div v-if="props.showProgress" :class="ui.indicators">
                <slot name="indicators" v-bind="slotProps">
                  <span
                    v-for="step in totalSteps"
                    :key="step"
                    :class="ui.indicator"
                    :data-active="step === currentStep"
                    aria-hidden="true"
                  />
                </slot>
                <span :class="ui.progress" role="status" aria-live="polite" aria-atomic="true">
                  {{ progressText }}
                </span>
              </div>
              <div :class="ui.actions">
                <button
                  v-if="slotProps.step?.showClose ?? props.showClose"
                  type="button"
                  :class="ui.close"
                  :aria-label="resolvedCloseLabel"
                  data-vean-tour-close
                  @click="rootContext.close('close-button')"
                >
                  <slot name="close" v-bind="slotProps">
                    <Icon icon="lucide:x" :aria-hidden="true" />
                  </slot>
                </button>
                <button
                  v-if="!slotProps.isFirstStep"
                  type="button"
                  :class="ui.previous"
                  data-vean-tour-previous
                  @click="rootContext.previous"
                >
                  <slot name="previous" v-bind="slotProps">{{ resolvedPreviousText }}</slot>
                </button>
                <button type="button" :class="ui.next" data-vean-tour-next @click="rootContext.next">
                  <slot name="next" v-bind="slotProps">
                    {{ slotProps.isLastStep ? resolvedFinishText : resolvedNextText }}
                  </slot>
                </button>
              </div>
            </footer>
          </slot>
          <!-- Keep the arrow inside the popup so its square can cover the border at the join. -->
          <PopperArrow v-if="slotProps.step?.showArrow ?? props.showArrow" v-bind="props.arrowProps" />
        </PopperPositioningPopup>
      </PopperPositioningPositioner>
    </PopperPositioningRoot>
  </PopperPortal>
</template>
