interface TourTargetRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const clamp = (value: number, minimum: number, maximum: number): number => Math.min(Math.max(value, minimum), maximum);

/** Interpolates the tour spotlight rectangle with an ease-out curve. */
export function interpolateTourRect(from: DOMRect, to: DOMRect, progress: number): DOMRect {
  const amount = clamp(progress, 0, 1);
  const easedProgress = 1 - (1 - amount) ** 3;

  return DOMRect.fromRect({
    x: from.x + (to.x - from.x) * easedProgress,
    y: from.y + (to.y - from.y) * easedProgress,
    width: from.width + (to.width - from.width) * easedProgress,
    height: from.height + (to.height - from.height) * easedProgress
  });
}

/** Creates the even-odd SVG path used to dim the viewport around a target. */
export function createTourMaskPath(
  width: number,
  height: number,
  targetRect: TourTargetRect | null,
  padding: number,
  radius: number
): string {
  if (width <= 0 || height <= 0) {
    return '';
  }

  const viewportPath = `M0 0H${width}V${height}H0Z`;

  if (!targetRect) {
    return viewportPath;
  }

  const left = clamp(targetRect.left - padding, 0, width);
  const top = clamp(targetRect.top - padding, 0, height);
  const right = clamp(targetRect.right + padding, 0, width);
  const bottom = clamp(targetRect.bottom + padding, 0, height);

  if (right <= left || bottom <= top) {
    return viewportPath;
  }

  const cornerRadius = clamp(radius, 0, Math.min((right - left) / 2, (bottom - top) / 2));
  const spotlightPath =
    cornerRadius === 0
      ? `M${left} ${top}H${right}V${bottom}H${left}Z`
      : [
          `M${left + cornerRadius} ${top}`,
          `H${right - cornerRadius}`,
          `A${cornerRadius} ${cornerRadius} 0 0 1 ${right} ${top + cornerRadius}`,
          `V${bottom - cornerRadius}`,
          `A${cornerRadius} ${cornerRadius} 0 0 1 ${right - cornerRadius} ${bottom}`,
          `H${left + cornerRadius}`,
          `A${cornerRadius} ${cornerRadius} 0 0 1 ${left} ${bottom - cornerRadius}`,
          `V${top + cornerRadius}`,
          `A${cornerRadius} ${cornerRadius} 0 0 1 ${left + cornerRadius} ${top}`,
          'Z'
        ].join('');

  return `${viewportPath} ${spotlightPath}`;
}
