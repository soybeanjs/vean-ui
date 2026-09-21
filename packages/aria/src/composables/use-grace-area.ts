import { onWatcherCleanup, ref, watchEffect } from 'vue';
import type { ShallowRef } from 'vue';
import { refAutoReset, tryOnScopeDispose } from '@vueuse/core';
import { GRACE_AREA_TRIGGER_ATTR } from '../constants';
import {
  getExitSideFromRect,
  getHull,
  getPaddedExitPoints,
  getPointsFromRect,
  isClient,
  isPointInPolygon
} from '../shared';
import type { Point, Polygon } from '../types';

export interface UseGraceAreaOptions {
  /** Reactive reference to the trigger element */
  triggerElement: ShallowRef<HTMLElement | undefined>;
  /** Reactive reference to the area element */
  areaElement: ShallowRef<HTMLElement | undefined>;
  /** Callback invoked when the pointer in-transit state changes */
  onPointerInTransitChange?: (v: boolean) => void;
  /** Callback invoked when the pointer exits the grace area */
  onPointerExit: () => void;
  /** Whether to disable the grace area feature */
  disabled?: ShallowRef<boolean | undefined>;
  /** DOM attribute name for secondary areas used to identify sub-area elements */
  subAreaAttribute?: string;
  /** Callback invoked when entering a sub-area */
  onSubAreaEnter?: (subArea: HTMLElement) => void;
  /** Callback invoked when leaving a sub-area */
  onSubAreaExit?: (subArea: HTMLElement) => void;
}

/**
 * Grace Area composable that provides intelligent hover area management.
 *
 * A grace area is a geometric region that allows the user to move
 * from the trigger to the content without accidentally closing the
 * floating content. Secondary area support is included.
 *
 * @param options - Configuration options
 *
 * Features:
 * - Automatically creates a safe transition area from trigger to content
 * - Supports detection and management of secondary hover areas
 * - Intelligent pointer tracking and state management
 * - Automatic cleanup and performance optimizations
 */
export function useGraceArea(options: UseGraceAreaOptions) {
  const {
    triggerElement,
    areaElement,
    onPointerInTransitChange,
    onPointerExit,
    disabled,
    subAreaAttribute,
    onSubAreaEnter,
    onSubAreaExit
  } = options;

  // Reset the inTransit state if idle/scrolled.
  const isPointerInTransit = refAutoReset(false, 300);
  const pointerGraceArea = ref<Polygon>();
  const currentSubArea = ref<HTMLElement>();

  const cleanupGraceArea = () => {
    pointerGraceArea.value = undefined;
    currentSubArea.value = undefined;
    onPointerInTransitChange?.(false);
  };

  // Element reference change listener
  watchEffect(() => {
    if (!isClient || disabled?.value === true) {
      return;
    }

    const trigger = triggerElement.value;
    const area = areaElement.value;

    if (!trigger || !area) {
      return;
    }

    // Conditional function creation, only create when needed
    function createGraceAreaSafely(event: PointerEvent, hoverTarget: HTMLElement) {
      const { currentTarget, clientX: x, clientY: y } = event;
      if (!(currentTarget instanceof HTMLElement)) return;

      const exitPoint: Point = { x, y };
      const graceArea = createGraceAreaGeometry(exitPoint, currentTarget, hoverTarget);

      pointerGraceArea.value = graceArea;
      isPointerInTransit.value = true;
    }

    // Handle sub-area detection and grace area creation
    function handleSubAreaInteraction(event: PointerEvent) {
      if (!subAreaAttribute) return;

      const target = event.target as HTMLElement;
      const subArea = target.closest(`[${subAreaAttribute}]`) as HTMLElement;

      if (subArea && areaElement.value?.contains(subArea)) {
        // Enter sub-area
        if (currentSubArea.value !== subArea) {
          if (currentSubArea.value) {
            onSubAreaExit?.(currentSubArea.value);
          }
          currentSubArea.value = subArea;
          onSubAreaEnter?.(subArea);

          // Create a grace area for the sub-area
          const { clientX: x, clientY: y } = event;
          const exitPoint: Point = { x, y };
          const graceArea = createGraceAreaGeometry(exitPoint, trigger!, subArea);

          pointerGraceArea.value = graceArea;
          isPointerInTransit.value = true;
        }
      } else if (currentSubArea.value) {
        // Leave sub-area
        onSubAreaExit?.(currentSubArea.value);
        currentSubArea.value = undefined;
      }
    }

    // Setup event listeners with consistent pattern
    const handleTriggerLeave = (event: PointerEvent) => createGraceAreaSafely(event, area);
    const handleAreaLeave = (event: PointerEvent) => createGraceAreaSafely(event, trigger);
    const handleSubContentMove = (event: PointerEvent) => handleSubAreaInteraction(event);

    trigger.addEventListener('pointerleave', handleTriggerLeave);
    area.addEventListener('pointerleave', handleAreaLeave);

    // Listen for pointer movement on the content area to handle sub-areas
    if (subAreaAttribute) {
      area.addEventListener('pointermove', handleSubContentMove);
    }

    onWatcherCleanup(() => {
      trigger.removeEventListener('pointerleave', handleTriggerLeave);
      area.removeEventListener('pointerleave', handleAreaLeave);
      if (subAreaAttribute) {
        area.removeEventListener('pointermove', handleSubContentMove);
      }
    });
  });

  // Grace area tracking listener
  watchEffect(() => {
    if (!isClient || disabled?.value === true || !pointerGraceArea.value) {
      return;
    }

    // Conditional creation of the tracking function
    const trackPointerGrace = (event: PointerEvent) => {
      if (!pointerGraceArea.value) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const { clientX: x, clientY: y } = event;
      const hasEnteredTarget = triggerElement.value?.contains(target) || areaElement.value?.contains(target);

      // Check whether the pointer has entered a sub-area
      const hasEnteredSubArea =
        subAreaAttribute && target.closest(`[${subAreaAttribute}]`) && areaElement.value?.contains(target);

      if (hasEnteredTarget || hasEnteredSubArea) {
        // If entered the primary target area or a sub-area, clean up the current grace area
        if (hasEnteredTarget) {
          cleanupGraceArea();
        }
        return;
      }

      const pointerPosition: Point = { x, y };
      const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea.value);
      const isAnotherGraceAreaTrigger = Boolean(target.closest(`[${GRACE_AREA_TRIGGER_ATTR}]`));

      // Check whether the pointer has left all related areas (including sub-areas)
      const isOutsideAllAreas =
        !triggerElement.value?.contains(target) &&
        !areaElement.value?.contains(target) &&
        !(subAreaAttribute && target.closest(`[${subAreaAttribute}]`));

      if ((isPointerOutsideGraceArea && isOutsideAllAreas) || isAnotherGraceAreaTrigger) {
        cleanupGraceArea();
        onPointerExit();
      }
    };

    triggerElement.value?.ownerDocument.addEventListener('pointermove', trackPointerGrace);

    onWatcherCleanup(() => {
      triggerElement.value?.ownerDocument.removeEventListener('pointermove', trackPointerGrace);
    });
  });

  watchEffect(() => {
    const updated = isPointerInTransit.value;
    onPointerInTransitChange?.(updated);
  });

  tryOnScopeDispose(() => {
    isPointerInTransit.value = false;
  });
}

function createGraceAreaGeometry(exitPoint: Point, currentTarget: HTMLElement, hoverTarget: HTMLElement): Polygon {
  const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
  const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide, 1);
  const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
  return getHull([...paddedExitPoints, ...hoverTargetPoints]);
}
