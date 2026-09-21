import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { createMockElement } from '../../shared';
import { useExposedElement } from '../../../../aria/src/composables/use-exposed-element';
import { useForwardElement } from '../../../../aria/src/composables/use-forward-element';

// Mock the useForwardElement composable
vi.mock('../../../../aria/src/composables/use-forward-element', () => ({
  useForwardElement: vi.fn()
}));

const mockedUseForwardElement = vi.mocked(useForwardElement);

describe('useExposedElement', () => {
  it('should expose element to parent component when used in component', () => {
    const mockElement = createMockElement();
    const mockElementRef = { value: mockElement };
    const mockSetElementRef = vi.fn();

    mockedUseForwardElement.mockReturnValue([mockElementRef, mockSetElementRef] as any);

    const TestComponent = defineComponent({
      setup(_, { expose }) {
        const [elementRef, setExposedElement] = useExposedElement();

        // Simulate setting an element
        setExposedElement({ $el: mockElement } as any);

        expose({ elementRef });
        return { elementRef, setExposedElement };
      },
      template: '<div ref="setExposedElement">Test</div>'
    });

    const wrapper = mount(TestComponent);
    const componentInstance = wrapper.vm as any;

    expect(mockSetElementRef).toHaveBeenCalled();
    expect(componentInstance.elementRef?.value).toBe(mockElement);
  });

  it('should handle case when no component instance is available', () => {
    const mockElementRef = { value: undefined };
    const mockSetElementRef = vi.fn();

    mockedUseForwardElement.mockReturnValue([mockElementRef, mockSetElementRef] as any);

    // This should not throw even when called outside of component context
    expect(() => {
      const [, setExposedElement] = useExposedElement();
      setExposedElement({ $el: createMockElement() } as any);
    }).not.toThrow();
  });
});
