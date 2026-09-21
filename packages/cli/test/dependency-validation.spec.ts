/**
 * Tests for registry dependency validation.
 */
import { describe, it, expect } from 'vitest';
import { validateRegistryDependencies } from '../src/registry/schema';
import type { RegistryItem } from '../src/registry/schema';

function makeItem(overrides: Partial<RegistryItem> = {}): RegistryItem {
  return {
    name: 'button',
    type: 'registry:ui',
    ...overrides
  } as RegistryItem;
}

describe('validateRegistryDependencies', () => {
  it('returns valid for items with no dependencies', () => {
    const items: RegistryItem[] = [makeItem({ name: 'button' }), makeItem({ name: 'dialog' })];

    const result = validateRegistryDependencies(items);
    expect(result.valid).toBe(true);
    expect(result.circularDependencies).toEqual([]);
    expect(result.missingDependencies).toEqual([]);
  });

  it('returns valid for items with resolved dependencies', () => {
    const items: RegistryItem[] = [
      makeItem({ name: 'button' }),
      makeItem({ name: 'dialog', registryDependencies: ['button'] })
    ];

    const result = validateRegistryDependencies(items);
    expect(result.valid).toBe(true);
  });

  it('detects missing dependencies', () => {
    const items: RegistryItem[] = [makeItem({ name: 'dialog', registryDependencies: ['button', 'modal'] })];

    const result = validateRegistryDependencies(items);
    expect(result.valid).toBe(false);
    expect(result.missingDependencies).toContain('button');
    expect(result.missingDependencies).toContain('modal');
  });

  it('detects circular dependencies', () => {
    const items: RegistryItem[] = [
      makeItem({ name: 'a', registryDependencies: ['b'] }),
      makeItem({ name: 'b', registryDependencies: ['a'] })
    ];

    const result = validateRegistryDependencies(items);
    expect(result.valid).toBe(false);
    expect(result.circularDependencies.length).toBeGreaterThan(0);
  });

  it('detects indirect circular dependencies', () => {
    const items: RegistryItem[] = [
      makeItem({ name: 'a', registryDependencies: ['b'] }),
      makeItem({ name: 'b', registryDependencies: ['c'] }),
      makeItem({ name: 'c', registryDependencies: ['a'] })
    ];

    const result = validateRegistryDependencies(items);
    expect(result.valid).toBe(false);
    expect(result.circularDependencies.length).toBeGreaterThan(0);
  });

  it('tracks package dependencies as edges', () => {
    const items: RegistryItem[] = [makeItem({ name: 'button', dependencies: ['@vean/aria'] })];

    const result = validateRegistryDependencies(items);
    // Package dependencies are informational only, not validated
    expect(result.valid).toBe(true);
    expect(result.fileDependencies.length).toBe(0);
  });

  it('tracks file-level dependencies from source content', () => {
    const items: RegistryItem[] = [
      makeItem({
        name: 'button',
        files: [{ path: 'button.vue', type: 'registry:ui', content: "import Icon from './icon.vue';" }]
      })
    ];

    const result = validateRegistryDependencies(items);
    expect(result.fileDependencies.length).toBe(1);
    expect(result.fileDependencies[0].from).toBe('button');
    expect(result.fileDependencies[0].type).toBe('file');
  });

  it('handles empty items array', () => {
    const result = validateRegistryDependencies([]);
    expect(result.valid).toBe(true);
    expect(result.circularDependencies).toEqual([]);
    expect(result.missingDependencies).toEqual([]);
  });

  it('handles items with both registry and file dependencies', () => {
    const items: RegistryItem[] = [
      makeItem({ name: 'utils' }),
      makeItem({
        name: 'button',
        registryDependencies: ['utils'],
        files: [{ path: 'button.vue', type: 'registry:ui', content: "import { cn } from '@/lib/utils';" }]
      })
    ];

    const result = validateRegistryDependencies(items);
    expect(result.valid).toBe(true);
    expect(result.missingDependencies).toEqual([]);
  });

  it('ignores package import edges in dependency validation', () => {
    const items: RegistryItem[] = [
      makeItem({
        name: 'button',
        files: [{ path: 'button.vue', type: 'registry:ui', content: "import { ref } from 'vue';" }]
      })
    ];

    const result = validateRegistryDependencies(items);
    // 'vue' is a package import, not a file import, so it shouldn't be treated as a file dependency
    expect(result.valid).toBe(true);
  });
});
