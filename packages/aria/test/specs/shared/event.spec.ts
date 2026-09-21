import { describe, expect, it } from 'vitest';
import { handleAndDispatchCustomEvent, isMouseEvent } from '../../../src/shared';

describe('isMouseEvent', () => {
  it('detects mouse pointer type', () => {
    const mouseEvent = new PointerEvent('pointermove', { pointerType: 'mouse' });
    const touchEvent = new PointerEvent('pointermove', { pointerType: 'touch' });
    expect(isMouseEvent(mouseEvent)).toBe(true);
    expect(isMouseEvent(touchEvent)).toBe(false);
  });
});

describe('handleAndDispatchCustomEvent', () => {
  it('dispatches a custom event with the detail and invokes the handler once', () => {
    const button = document.createElement('button');
    const originalEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(originalEvent, 'target', { value: button });
    document.body.append(button);

    const handlerCalls: unknown[] = [];
    const handler = (event: Event) => handlerCalls.push(event);

    handleAndDispatchCustomEvent<CustomEvent<{ value: number; originalEvent: MouseEvent }>, MouseEvent>(
      'soybean:custom',
      handler,
      {
        originalEvent,
        value: 42
      }
    );

    expect(handlerCalls).toHaveLength(1);
    const dispatched = handlerCalls[0] as CustomEvent<{ value: number; originalEvent: MouseEvent }>;
    expect(dispatched.type).toBe('soybean:custom');
    expect(dispatched.detail.value).toBe(42);
    expect(dispatched.detail.originalEvent).toBe(originalEvent);
  });

  it('does nothing when the original event has no target', () => {
    const originalEvent = new MouseEvent('click');
    Object.defineProperty(originalEvent, 'target', { value: null });

    expect(() => {
      handleAndDispatchCustomEvent<CustomEvent, MouseEvent>('soybean:custom', undefined, {
        originalEvent
      });
    }).not.toThrow();
  });
});
