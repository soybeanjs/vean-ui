import { describe, expect, it, vi } from 'vitest';
import { getElFromTemplateRef } from '../../../../aria/src/shared';
import { createMockElement } from '../../shared';
import { useForwardElement } from '../../../../aria/src/composables/use-forward-element';

// Mock the getElFromTemplateRef function
vi.mock('../../../../aria/src/shared', () => ({
  getElFromTemplateRef: vi.fn()
}));

const mockedGetElFromTemplateRef = vi.mocked(getElFromTemplateRef);

describe('useForwardElement', () => {
  it('should return element ref and setter function', () => {
    const [elementRef, setElementRef] = useForwardElement();

    expect(elementRef.value).toBeUndefined();
    expect(typeof setElementRef).toBe('function');
  });

  it('should set element ref when valid node is provided', () => {
    const mockDiv = createMockElement();
    mockedGetElFromTemplateRef.mockReturnValue(mockDiv);

    const [elementRef, setElementRef] = useForwardElement<HTMLDivElement>();
    const mockNode = { $el: createMockElement() };

    setElementRef(mockNode as any);

    expect(mockedGetElFromTemplateRef).toHaveBeenCalledWith(mockNode);
    expect(elementRef.value).toBeInstanceOf(HTMLElement);
  });

  it('should not set element ref when node is null', () => {
    mockedGetElFromTemplateRef.mockReturnValue(undefined);

    const [elementRef, setElementRef] = useForwardElement();
    const mockNode = null;

    setElementRef(mockNode as any);

    expect(mockedGetElFromTemplateRef).toHaveBeenCalledWith(mockNode);
    expect(elementRef.value).toBeUndefined();
  });

  it('should not set element ref when getElFromTemplateRef returns undefined', () => {
    mockedGetElFromTemplateRef.mockReturnValue(undefined as any);

    const [elementRef, setElementRef] = useForwardElement();
    const mockNode = { $el: null };

    setElementRef(mockNode as any);

    expect(mockedGetElFromTemplateRef).toHaveBeenCalledWith(mockNode);
    expect(elementRef.value).toBeUndefined();
  });

  it('should work with specific element types', () => {
    const divElement = createMockElement();
    mockedGetElFromTemplateRef.mockReturnValue(divElement);

    const [elementRef, setElementRef] = useForwardElement<HTMLDivElement>();
    const mockNode = { $el: divElement };

    setElementRef(mockNode as any);

    expect(elementRef.value).toBe(divElement);
    expect(elementRef.value).toBeInstanceOf(HTMLDivElement);
  });

  it('should update element ref when called multiple times', () => {
    const div1 = createMockElement();
    const div2 = createMockElement('span');

    const [elementRef, setElementRef] = useForwardElement();

    // First call
    mockedGetElFromTemplateRef.mockReturnValueOnce(div1);
    setElementRef({ $el: div1 } as any);
    expect(elementRef.value).toBe(div1);

    // Second call
    mockedGetElFromTemplateRef.mockReturnValueOnce(div2);
    setElementRef({ $el: div2 } as any);
    expect(elementRef.value).toBe(div2);
  });
});
