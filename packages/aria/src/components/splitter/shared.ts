import { clamp } from '../../shared';
import type { SplitterPanelRecord } from './types';

const LAYOUT_EPSILON = 0.01;
const LAYOUT_PRECISION = 3;

function roundLayoutValue(value: number) {
  return Number(value.toFixed(LAYOUT_PRECISION));
}

function getExpandedMinSize(panel: SplitterPanelRecord) {
  return clamp(panel.minSize.value, 0, 100);
}

function getCollapsedSize(panel: SplitterPanelRecord) {
  return clamp(panel.collapsedSize.value, 0, 100);
}

function getMaxSize(panel: SplitterPanelRecord, minSize: number) {
  return clamp(panel.maxSize.value, minSize, 100);
}

function getInteractiveMinSize(panel: SplitterPanelRecord) {
  if (!panel.collapsible.value) {
    return getExpandedMinSize(panel);
  }

  return Math.min(getExpandedMinSize(panel), getCollapsedSize(panel));
}

function normalizeCollapsedSize(size: number, panel: SplitterPanelRecord) {
  if (!panel.collapsible.value) {
    return clamp(size, getExpandedMinSize(panel), getMaxSize(panel, getExpandedMinSize(panel)));
  }

  const collapsedSize = getCollapsedSize(panel);
  const expandedMinSize = getExpandedMinSize(panel);
  const maxSize = getMaxSize(panel, expandedMinSize);

  const nextSize = clamp(size, collapsedSize, maxSize);

  if (nextSize <= collapsedSize + LAYOUT_EPSILON) {
    return roundLayoutValue(collapsedSize);
  }

  if (nextSize < expandedMinSize) {
    const threshold = collapsedSize + (expandedMinSize - collapsedSize) / 2;
    return roundLayoutValue(nextSize <= threshold ? collapsedSize : expandedMinSize);
  }

  return roundLayoutValue(nextSize);
}

function distributeDelta(layout: number[], panels: SplitterPanelRecord[], delta: number) {
  if (Math.abs(delta) <= LAYOUT_EPSILON) {
    return layout;
  }

  const nextLayout = [...layout];

  let remaining = delta;
  let guard = 0;

  while (Math.abs(remaining) > LAYOUT_EPSILON && guard < 20) {
    guard += 1;

    const candidates = nextLayout
      .map((size, index) => {
        const panel = panels[index];

        if (!panel) {
          return null;
        }

        const minSize = getExpandedMinSize(panel);
        const maxSize = getMaxSize(panel, minSize);
        const room = remaining > 0 ? maxSize - size : size - minSize;

        if (room <= LAYOUT_EPSILON) {
          return null;
        }

        return { index, room };
      })
      .filter(Boolean);

    if (candidates.length === 0) {
      break;
    }

    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];

      if (!candidate) {
        continue;
      }

      const remainingCandidates = candidates.length - index;
      const requested = remaining / remainingCandidates;
      const applied = remaining > 0 ? Math.min(requested, candidate.room) : -Math.min(-requested, candidate.room);

      nextLayout[candidate.index] = roundLayoutValue(nextLayout[candidate.index]! + applied);
      remaining -= applied;
    }
  }

  if (Math.abs(remaining) > LAYOUT_EPSILON) {
    const fallbackIndex = nextLayout.findIndex((_, index) => {
      const panel = panels[index];

      if (!panel) {
        return false;
      }

      return remaining > 0
        ? getMaxSize(panel, getExpandedMinSize(panel)) - nextLayout[index]! > LAYOUT_EPSILON
        : nextLayout[index]! - getExpandedMinSize(panel) > LAYOUT_EPSILON;
    });

    if (fallbackIndex >= 0) {
      nextLayout[fallbackIndex] = roundLayoutValue(nextLayout[fallbackIndex]! + remaining);
    }
  }

  return nextLayout;
}

function finalizeLayout(layout: number[], panels: SplitterPanelRecord[]) {
  const nextLayout = [...layout];
  const total = nextLayout.reduce((sum, size) => sum + size, 0);
  const remainder = roundLayoutValue(100 - total);

  if (Math.abs(remainder) <= LAYOUT_EPSILON) {
    return nextLayout.map(roundLayoutValue);
  }

  const fallbackIndex = nextLayout.findIndex((size, index) => {
    const panel = panels[index];

    if (!panel) {
      return false;
    }

    const minSize = getExpandedMinSize(panel);
    const maxSize = getMaxSize(panel, minSize);
    const nextSize = size + remainder;

    return nextSize >= minSize - LAYOUT_EPSILON && nextSize <= maxSize + LAYOUT_EPSILON;
  });

  if (fallbackIndex >= 0) {
    nextLayout[fallbackIndex] = roundLayoutValue(nextLayout[fallbackIndex]! + remainder);
  }

  return nextLayout.map(roundLayoutValue);
}

export function sortPanels(panels: SplitterPanelRecord[]) {
  return [...panels].sort((panelA, panelB) => {
    const orderA = panelA.order.value;
    const orderB = panelB.order.value;

    if (orderA == null && orderB == null) {
      return panelA.registrationIndex - panelB.registrationIndex;
    }

    if (orderA == null) {
      return -1;
    }

    if (orderB == null) {
      return 1;
    }

    if (orderA === orderB) {
      return panelA.registrationIndex - panelB.registrationIndex;
    }

    return orderA - orderB;
  });
}

export function areLayoutsEqual(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((value, index) => Math.abs(value - (b[index] ?? 0)) <= LAYOUT_EPSILON);
}

export function getDefaultLayout(panels: SplitterPanelRecord[], currentSizesById?: Map<string, number>) {
  if (panels.length === 0) {
    return [];
  }

  const explicitSizes = panels.map(panel => currentSizesById?.get(panel.id) ?? panel.defaultSize.value);
  const definedTotal = explicitSizes.reduce<number>((sum, size) => sum + (size ?? 0), 0);
  const undefinedCount = explicitSizes.filter(size => size === undefined).length;
  const fallback = undefinedCount > 0 ? Math.max(100 - definedTotal, 0) / undefinedCount : 0;

  const nextLayout = explicitSizes.map(size => size ?? fallback);
  const total = nextLayout.reduce((sum, size) => sum + size, 0);

  if (total <= LAYOUT_EPSILON) {
    return panels.map(() => roundLayoutValue(100 / panels.length));
  }

  return nextLayout.map(size => roundLayoutValue((size / total) * 100));
}

export function normalizeLayout(layout: number[], panels: SplitterPanelRecord[]) {
  if (panels.length === 0) {
    return [];
  }

  let nextLayout = layout.map((size, index) => {
    const panel = panels[index]!;
    const minSize = getExpandedMinSize(panel);
    const maxSize = getMaxSize(panel, minSize);

    return roundLayoutValue(clamp(size, minSize, maxSize));
  });

  const total = nextLayout.reduce((sum, size) => sum + size, 0);
  nextLayout = distributeDelta(nextLayout, panels, roundLayoutValue(100 - total));

  return finalizeLayout(nextLayout, panels);
}

export function resizeLayoutPair(layout: number[], panels: SplitterPanelRecord[], pairIndex: number, delta: number) {
  const panel = panels[pairIndex];
  const nextPanel = panels[pairIndex + 1];

  if (!panel || !nextPanel) {
    return layout;
  }

  const pairTotal = layout[pairIndex]! + layout[pairIndex + 1]!;
  const panelMin = getInteractiveMinSize(panel);
  const nextPanelMin = getInteractiveMinSize(nextPanel);
  const panelMax = Math.min(getMaxSize(panel, getExpandedMinSize(panel)), pairTotal - nextPanelMin);
  const nextPanelMax = Math.min(getMaxSize(nextPanel, getExpandedMinSize(nextPanel)), pairTotal - panelMin);

  let nextPanelSize = normalizeCollapsedSize(layout[pairIndex]! + delta, panel);
  nextPanelSize = clamp(nextPanelSize, panelMin, panelMax);

  let followingSize = normalizeCollapsedSize(pairTotal - nextPanelSize, nextPanel);
  followingSize = clamp(followingSize, nextPanelMin, nextPanelMax);

  nextPanelSize = clamp(pairTotal - followingSize, panelMin, panelMax);
  nextPanelSize = normalizeCollapsedSize(nextPanelSize, panel);
  followingSize = roundLayoutValue(pairTotal - nextPanelSize);

  const nextLayout = [...layout];

  nextLayout[pairIndex] = roundLayoutValue(nextPanelSize);
  nextLayout[pairIndex + 1] = roundLayoutValue(followingSize);

  return nextLayout;
}

export function getPanelState(size: number | undefined, panel: SplitterPanelRecord) {
  if (!panel.collapsible.value || size === undefined) {
    return undefined;
  }

  return size <= getCollapsedSize(panel) + LAYOUT_EPSILON ? 'collapsed' : 'expanded';
}

export function getPanelBounds(panel: SplitterPanelRecord, pairTotal = 100) {
  const min = getInteractiveMinSize(panel);
  const max = Math.min(getMaxSize(panel, getExpandedMinSize(panel)), pairTotal);

  return {
    min: roundLayoutValue(min),
    max: roundLayoutValue(max)
  };
}
