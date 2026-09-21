import { describe, expect, it } from 'vitest';
import {
  getExitSideFromRect,
  getHull,
  getPaddedExitPoints,
  getPointsFromRect,
  isDeltaInDirection,
  isPointInPolygon
} from '../../../src/shared';

describe('isPointInPolygon', () => {
  const square = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 }
  ];

  it('detects points inside the polygon', () => {
    expect(isPointInPolygon({ x: 5, y: 5 }, square)).toBe(true);
    expect(isPointInPolygon({ x: 1, y: 9 }, square)).toBe(true);
  });

  it('rejects points outside the bounding box', () => {
    expect(isPointInPolygon({ x: -1, y: 5 }, square)).toBe(false);
    expect(isPointInPolygon({ x: 15, y: 5 }, square)).toBe(false);
  });

  it('rejects polygons with fewer than 3 vertices', () => {
    expect(isPointInPolygon({ x: 5, y: 5 }, [])).toBe(false);
    expect(
      isPointInPolygon({ x: 5, y: 5 }, [
        { x: 0, y: 0 },
        { x: 1, y: 1 }
      ])
    ).toBe(false);
  });

  it('handles concave polygons via ray casting', () => {
    const concave = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 5, y: 5 },
      { x: 0, y: 10 }
    ];
    // (8,9) lies inside the notch cut out by the (10,10)→(5,5)→(0,10) edges
    expect(isPointInPolygon({ x: 8, y: 9 }, concave)).toBe(false);
    expect(isPointInPolygon({ x: 2, y: 2 }, concave)).toBe(true);
  });
});

describe('getExitSideFromRect', () => {
  const rect = { top: 0, right: 10, bottom: 10, left: 0 } as DOMRect;

  it('returns the closest horizontal side', () => {
    expect(getExitSideFromRect({ x: -3, y: 5 }, rect)).toBe('left');
    expect(getExitSideFromRect({ x: 13, y: 5 }, rect)).toBe('right');
  });

  it('returns the closest vertical side', () => {
    expect(getExitSideFromRect({ x: 5, y: -3 }, rect)).toBe('top');
    expect(getExitSideFromRect({ x: 5, y: 13 }, rect)).toBe('bottom');
  });
});

describe('getPaddedExitPoints', () => {
  it('creates two padded points perpendicicular to the exit side', () => {
    const top = getPaddedExitPoints({ x: 10, y: 10 }, 'top', 5);
    expect(top).toEqual([
      { x: 5, y: 15 },
      { x: 15, y: 15 }
    ]);

    const left = getPaddedExitPoints({ x: 10, y: 10 }, 'left', 5);
    expect(left).toEqual([
      { x: 15, y: 5 },
      { x: 15, y: 15 }
    ]);
  });

  it('defaults the padding to 5', () => {
    const bottom = getPaddedExitPoints({ x: 0, y: 0 }, 'bottom');
    expect(bottom).toEqual([
      { x: -5, y: -5 },
      { x: 5, y: -5 }
    ]);
  });
});

describe('getPointsFromRect', () => {
  it('returns the four corners clockwise from top-left', () => {
    const rect = { top: 1, right: 4, bottom: 3, left: 2 } as DOMRect;
    expect(getPointsFromRect(rect)).toEqual([
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 3 },
      { x: 2, y: 3 }
    ]);
  });
});

describe('getHull', () => {
  it('returns the input for fewer than three points', () => {
    expect(getHull([{ x: 0, y: 0 }])).toEqual([{ x: 0, y: 0 }]);
    expect(
      getHull([
        { x: 0, y: 0 },
        { x: 1, y: 1 }
      ])
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ]);
  });

  it('reduces three collinear points to the farthest pair', () => {
    const hull = getHull([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ]);
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 2 }
    ]);
  });

  it('keeps three non-collinear points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 }
    ];
    expect(getHull(points)).toEqual(points);
  });

  it('computes the convex hull of a larger set', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
      { x: 2, y: 2 },
      { x: 1, y: 3 }
    ];
    const hull = getHull(points);
    expect(hull).toHaveLength(4);
    expect(hull).toContainEqual({ x: 0, y: 0 });
    expect(hull).toContainEqual({ x: 4, y: 0 });
    expect(hull).toContainEqual({ x: 4, y: 4 });
    expect(hull).toContainEqual({ x: 0, y: 4 });
  });
});

describe('isDeltaInDirection', () => {
  it('checks horizontal dominance for left/right directions', () => {
    expect(isDeltaInDirection({ x: 10, y: 1 }, 'left', 5)).toBe(true);
    expect(isDeltaInDirection({ x: 1, y: 10 }, 'left', 5)).toBe(false);
    expect(isDeltaInDirection({ x: 3, y: 1 }, 'right', 5)).toBe(false);
  });

  it('checks vertical dominance for up/down directions', () => {
    expect(isDeltaInDirection({ x: 1, y: 10 }, 'up', 5)).toBe(true);
    expect(isDeltaInDirection({ x: 10, y: 1 }, 'up', 5)).toBe(false);
  });
});
