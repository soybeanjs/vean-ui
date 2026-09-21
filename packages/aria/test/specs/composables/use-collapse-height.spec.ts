import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import type { Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { hasStructuralChildChange, useCollapseHeight } from '../../../src/composables/use-collapse-height';

describe('hasStructuralChildChange', () => {
  it('detects added element children', () => {
    expect(hasStructuralChildChange([{ addedNodes: [document.createElement('div')], removedNodes: [] }])).toBe(true);
  });

  it('detects removed element children', () => {
    expect(hasStructuralChildChange([{ addedNodes: [], removedNodes: [document.createElement('li')] }])).toBe(true);
  });

  it('ignores text-only content changes', () => {
    expect(hasStructuralChildChange([{ addedNodes: [document.createTextNode('edit')], removedNodes: [] }])).toBe(false);
  });

  it('ignores records without node changes', () => {
    expect(hasStructuralChildChange([{ addedNodes: [], removedNodes: [] }])).toBe(false);
    expect(hasStructuralChildChange([])).toBe(false);
  });

  it('detects a structural record among non-structural ones', () => {
    const records = [
      { addedNodes: [document.createTextNode('a')], removedNodes: [] },
      { addedNodes: [], removedNodes: [document.createElement('span')] }
    ];

    expect(hasStructuralChildChange(records)).toBe(true);
  });
});

describe('useCollapseHeight', () => {
  it('binds the returned ref onto the container element', () => {
    let elementRef: Ref<HTMLElement | undefined> | undefined;

    const Consumer = defineComponent({
      setup() {
        const scope = useCollapseHeight();

        elementRef = scope.elementRef;

        return () => h('div', { ref: scope.setElementRef }, ['row']);
      }
    });

    const wrapper = mount(Consumer);

    expect(elementRef?.value).toBe(wrapper.element);
  });
});
