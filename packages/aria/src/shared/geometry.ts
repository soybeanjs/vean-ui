import type { Point, Polygon, Side, SwipeDirection } from '../types';

export function isPointerInGraceArea(event: PointerEvent, area?: Polygon) {
  if (!area) return false;
  const { clientX: x, clientY: y } = event;

  const point: Point = { x, y };

  return isPointInPolygon(point, area);
}

export function isPointInPolygon(point: Point, polygon: Polygon): boolean {
  const { x, y } = point;

  // Quick exclusion: boundary box check
  if (polygon.length < 3) return false;

  let { x: minX, y: minY } = polygon[0]!;
  let { x: maxX, y: maxY } = polygon[0]!;

  // Calculate boundary box
  for (let i = 1; i < polygon.length; i++) {
    const vertex = polygon[i]!;
    minX = Math.min(minX, vertex.x);
    maxX = Math.max(maxX, vertex.x);
    minY = Math.min(minY, vertex.y);
    maxY = Math.max(maxY, vertex.y);
  }

  // Point is outside boundary box, return false directly
  if (x < minX || x > maxX || y < minY || y > maxY) {
    return false;
  }

  // Ray casting algorithm - cast a ray from the point to the right, count intersections with polygon edges
  let intersectionCount = 0;

  for (let i = 0; i < polygon.length; i++) {
    const currentVertex = polygon[i]!;
    const nextVertex = polygon[(i + 1) % polygon.length]!;

    const { x: x1, y: y1 } = currentVertex;
    const { x: x2, y: y2 } = nextVertex;

    // Check if the ray intersects with the current edge
    // 1. The edge must cross the horizontal ray (one endpoint above, another below)
    // 2. The ray must be to the right of the edge
    if (y1 > y !== y2 > y) {
      // Calculate the x-coordinate of the intersection point between ray and edge
      const intersectionX = x1 + ((y - y1) * (x2 - x1)) / (y2 - y1);

      // If the intersection point is to the right of the point, increment counter
      if (x < intersectionX) {
        intersectionCount++;
      }
    }
  }

  // Odd number of intersections indicates the point is inside the polygon
  return intersectionCount % 2 === 1;
}

/**
 * Determine which side of the rectangle the point is closest to
 *
 * @param point Target point
 * @param rect DOM rectangle
 * @returns The closest side
 */
export function getExitSideFromRect(point: Point, rect: DOMRect): Side {
  const { x, y } = point;
  const { top, right, bottom, left } = rect;

  // Calculate distance to each side
  const distanceToTop = Math.abs(top - y);
  const distanceToBottom = Math.abs(bottom - y);
  const distanceToLeft = Math.abs(left - x);
  const distanceToRight = Math.abs(right - x);

  // Compare horizontal and vertical minimum distances first to reduce comparisons
  const minHorizontal = Math.min(distanceToLeft, distanceToRight);
  const minVertical = Math.min(distanceToTop, distanceToBottom);

  if (minHorizontal < minVertical) {
    return distanceToLeft < distanceToRight ? 'left' : 'right';
  }
  return distanceToTop < distanceToBottom ? 'top' : 'bottom';
}

/**
 * Create padded points based on exit point and exit side
 *
 * @param exitPoint Exit point
 * @param exitSide Exit side
 * @param padding Padding distance, default 5
 * @returns Array of padded points
 */
export function getPaddedExitPoints(exitPoint: Point, exitSide: Side, padding = 5): Point[] {
  const { x, y } = exitPoint;

  // Use object mapping to simplify switch logic and improve performance
  const paddingMap: Record<Side, [Point, Point]> = {
    top: [
      { x: x - padding, y: y + padding },
      { x: x + padding, y: y + padding }
    ],
    bottom: [
      { x: x - padding, y: y - padding },
      { x: x + padding, y: y - padding }
    ],
    left: [
      { x: x + padding, y: y - padding },
      { x: x + padding, y: y + padding }
    ],
    right: [
      { x: x - padding, y: y - padding },
      { x: x - padding, y: y + padding }
    ]
  };

  return paddingMap[exitSide];
}

/**
 * Get four corner points from DOMRect
 *
 * @param rect DOM rectangle
 * @returns Array of points (clockwise starting from top-left)
 */
export function getPointsFromRect(rect: DOMRect): Point[] {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top }, // Top-left
    { x: right, y: top }, // Top-right
    { x: right, y: bottom }, // Bottom-right
    { x: left, y: bottom } // Bottom-left
  ];
}

/**
 * Calculate the squared Euclidean distance between two points (avoid square root for better performance)
 *
 * @param a Point A
 * @param b Point B
 * @returns Squared distance
 */
function getDistanceSquared(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/**
 * Calculate cross product for determining point orientation
 *
 * @param o Origin point
 * @param a Point A
 * @param b Point B
 * @returns Cross product value
 */
function crossProduct(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Calculate convex hull using Graham scan algorithm - optimized version with better performance
 *
 * @param points Point collection
 * @returns Array of convex hull points
 */
export function getHull<P extends Point>(points: Readonly<Array<P>>): Array<P> {
  if (points.length <= 1) return [...points];
  if (points.length === 2) return [...points];
  if (points.length === 3) {
    // For three points, check if they are collinear, if so return endpoints
    const [p1, p2, p3] = points;
    const cross = crossProduct(p1!, p2!, p3!);
    if (Math.abs(cross) < 1e-10) {
      // Collinear, return the two farthest points
      const dist12 = getDistanceSquared(p1!, p2!);
      const dist13 = getDistanceSquared(p1!, p3!);
      const dist23 = getDistanceSquared(p2!, p3!);
      const maxDist = Math.max(dist12, dist13, dist23);
      if (maxDist === dist12) return [p1!, p2!];
      if (maxDist === dist13) return [p1!, p3!];
      return [p2!, p3!];
    }
    return [...points];
  }

  // Copy and sort points
  const sortedPoints = [...points].sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    return a.y - b.y;
  });

  return getHullPresorted(sortedPoints);
}

/**
 * Calculate convex hull for pre-sorted points
 *
 * @param points Pre-sorted array of points
 * @returns Array of convex hull points
 */
function getHullPresorted<P extends Point>(points: Readonly<Array<P>>): Array<P> {
  if (points.length <= 1) return [...points];

  // Build lower convex hull
  const lower: P[] = [];
  for (const point of points) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2]!, lower[lower.length - 1]!, point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }

  // Build upper convex hull
  const upper: P[] = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i]!;
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2]!, upper[upper.length - 1]!, point) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }

  // Remove the last point (duplicate) and merge
  lower.pop();
  upper.pop();

  // If only one point, avoid duplication
  if (lower.length === 1 && upper.length === 1 && lower[0]!.x === upper[0]!.x && lower[0]!.y === upper[0]!.y) {
    return lower;
  }

  return lower.concat(upper);
}

export function isDeltaInDirection(delta: Point, direction: SwipeDirection, threshold = 0) {
  const deltaX = Math.abs(delta.x);
  const deltaY = Math.abs(delta.y);
  const isDeltaX = deltaX > deltaY;

  if (direction === 'left' || direction === 'right') {
    return isDeltaX && deltaX > threshold;
  }

  return !isDeltaX && deltaY > threshold;
}
