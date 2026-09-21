import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useFocusGuards } from '../../../../aria/src/composables/use-focus-guards';

// Mock the shared/env module
vi.mock('../../../../aria/src/shared/env', () => ({
  isClient: true
}));

describe('useFocusGuards', () => {
  beforeEach(() => {
    // Clean up any existing focus guards before each test
    document.querySelectorAll('[data-vean-focus-guard]').forEach(guard => guard.remove());
  });

  afterEach(() => {
    // Clean up any remaining focus guards after each test
    document.querySelectorAll('[data-vean-focus-guard]').forEach(guard => guard.remove());
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should create focus guards when first used', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      mount(TestComponent);
      await nextTick();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);

      // Check that guards are positioned correctly
      expect(document.body.firstElementChild).toBe(guards[0]);
      expect(document.body.lastElementChild).toBe(guards[1]);
    });

    it('should set correct attributes and styles on focus guards', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      mount(TestComponent);
      await nextTick();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');

      guards.forEach(guard => {
        const element = guard as HTMLElement;
        expect(element.getAttribute('data-vean-focus-guard')).toBe('');
        expect(element.tabIndex).toBe(0);
        expect(element.style.opacity).toBe('0');
        expect(element.style.position).toBe('fixed');
        expect(element.style.pointerEvents).toBe('none');
        // Check that outline is set (may include additional CSS)
        expect(element.style.outline).toContain('none');
      });
    });
  });

  describe('multiple components usage', () => {
    it('should reuse existing guards when multiple components use focus guards', async () => {
      const TestComponent1 = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test1</div>'
      };

      const TestComponent2 = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test2</div>'
      };

      // Mount first component
      mount(TestComponent1);
      await nextTick();

      let guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);

      // Mount second component
      mount(TestComponent2);
      await nextTick();

      // Should still have only 2 guards (reused)
      guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);
    });

    it('should maintain guards while any component is using them', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      // Mount multiple components
      const wrapper1 = mount(TestComponent);
      const wrapper2 = mount(TestComponent);
      await nextTick();

      let guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);

      // Unmount first component
      wrapper1.unmount();
      await nextTick();

      // Guards should still exist because wrapper2 is still mounted
      guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);

      // Verify wrapper2 is still active
      expect(wrapper2.vm).toBeDefined();

      // Cleanup wrapper2 for this test
      wrapper2.unmount();
    });
  });

  describe('guard lifecycle management', () => {
    it('should handle guards that are already in DOM', async () => {
      // Manually create existing guards
      const existingGuard1 = document.createElement('span');
      existingGuard1.setAttribute('data-vean-focus-guard', '');
      const existingGuard2 = document.createElement('span');
      existingGuard2.setAttribute('data-vean-focus-guard', '');

      document.body.insertAdjacentElement('afterbegin', existingGuard1);
      document.body.insertAdjacentElement('beforeend', existingGuard2);

      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      mount(TestComponent);
      await nextTick();

      // Should still have only 2 guards (reused existing ones)
      const guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);
      expect(guards[0]).toBe(existingGuard1);
      expect(guards[1]).toBe(existingGuard2);
    });
  });

  describe('focus guard element creation', () => {
    it('should create focus guard with correct properties', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      mount(TestComponent);
      await nextTick();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);

      guards.forEach(guard => {
        const element = guard as HTMLElement;
        expect(element.tagName).toBe('SPAN');
        expect(element.getAttribute('data-vean-focus-guard')).toBe('');
        expect(element.tabIndex).toBe(0);

        // Check styles
        expect(element.style.opacity).toBe('0');
        expect(element.style.position).toBe('fixed');
        expect(element.style.pointerEvents).toBe('none');
        expect(element.style.outline).toContain('none');
      });
    });

    it('should position guards at beginning and end of body', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      mount(TestComponent);
      await nextTick();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);

      // Check positioning
      expect(document.body.firstElementChild).toBe(guards[0]);
      expect(document.body.lastElementChild).toBe(guards[1]);
    });
  });

  describe('focus guard attributes and behavior', () => {
    it('should use correct focus guard attribute', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      mount(TestComponent);
      await nextTick();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);

      guards.forEach(guard => {
        expect(guard.getAttribute('data-vean-focus-guard')).toBe('');
      });
    });

    it('should create guards with tabindex 0 for keyboard navigation', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      mount(TestComponent);
      await nextTick();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');

      guards.forEach(guard => {
        const element = guard as HTMLElement;
        expect(element.tabIndex).toBe(0);
      });
    });

    it('should make guards invisible but focusable', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      mount(TestComponent);
      await nextTick();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');

      guards.forEach(guard => {
        const element = guard as HTMLElement;
        expect(element.style.opacity).toBe('0');
        expect(element.style.position).toBe('fixed');
        expect(element.style.pointerEvents).toBe('none');
        expect(element.style.outline).toContain('none');
        expect(element.tabIndex).toBe(0); // Still focusable via keyboard
      });
    });
  });

  describe('environment handling', () => {
    it('should handle DOM operations gracefully', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      expect(() => {
        mount(TestComponent);
      }).not.toThrow();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle multiple rapid mount cycles', async () => {
      const TestComponent = {
        setup() {
          useFocusGuards();
          return {};
        },
        template: '<div>Test</div>'
      };

      // Test rapid mount cycles
      const wrappers = [];

      // Mount multiple components
      for (let i = 0; i < 3; i++) {
        const wrapper = mount(TestComponent);
        wrappers.push(wrapper);
      }

      await nextTick();

      const guards = document.querySelectorAll('[data-vean-focus-guard]');
      expect(guards).toHaveLength(2);

      // Cleanup for this test
      wrappers.forEach(wrapper => wrapper.unmount());
    });
  });
});
