import { describe, expect, it } from 'vitest';
import { collectComponentCoverageGaps } from '../src/commands/skills-docs';
import type { ComponentCoverageInput } from '../src/commands/skills-docs';

const completeCatalog: ComponentCoverageInput = {
  documentedSlugs: ['button', 'theme-mode-switch'],
  families: ['button', 'themeModeSwitch'],
  menuItems: ['button', 'themeModeSwitch']
};

describe('collectComponentCoverageGaps', () => {
  it('reports no gaps when the catalog, docs pages, and menu agree', () => {
    expect(collectComponentCoverageGaps(completeCatalog)).toEqual({
      missingDocs: [],
      unregisteredFamilies: [],
      orphanDocs: []
    });
  });

  it('reports a catalog family whose docs page is missing', () => {
    const gaps = collectComponentCoverageGaps({
      ...completeCatalog,
      documentedSlugs: ['button']
    });

    expect(gaps.missingDocs).toEqual(['theme-mode-switch']);
  });

  it('reports a catalog family missing from menuData', () => {
    const gaps = collectComponentCoverageGaps({
      ...completeCatalog,
      menuItems: ['button']
    });

    expect(gaps.unregisteredFamilies).toEqual(['theme-mode-switch']);
  });

  it('reports a docs page that is neither a catalog family nor a menu entry', () => {
    const gaps = collectComponentCoverageGaps({
      ...completeCatalog,
      documentedSlugs: [...completeCatalog.documentedSlugs, 'navigation-menu']
    });

    expect(gaps.orphanDocs).toEqual(['navigation-menu']);
  });

  it('resolves a camelCase family to its kebab-case docs slug', () => {
    const gaps = collectComponentCoverageGaps({
      documentedSlugs: ['theme-mode-switch'],
      families: ['themeModeSwitch'],
      menuItems: ['themeModeSwitch']
    });

    expect(gaps).toEqual({ missingDocs: [], unregisteredFamilies: [], orphanDocs: [] });
  });

  it('sorts every gap list so the failure output is stable', () => {
    const gaps = collectComponentCoverageGaps({
      documentedSlugs: [],
      families: ['virtualizer', 'button', 'appShell'],
      menuItems: []
    });

    expect(gaps.missingDocs).toEqual(['app-shell', 'button', 'virtualizer']);
    expect(gaps.unregisteredFamilies).toEqual(['app-shell', 'button', 'virtualizer']);
  });
});
