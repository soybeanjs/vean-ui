import { describe, expect, it } from 'vitest';
import { useStateMachine } from '../../../../aria/src/composables/use-state-machine';

describe('useStateMachine', () => {
  it('should initialize with the initial state', () => {
    const machine = {
      idle: { START: 'loading' as const },
      loading: { SUCCESS: 'success' as const, ERROR: 'error' as const },
      success: { RESET: 'idle' as const },
      error: { RESET: 'idle' as const, RETRY: 'loading' as const }
    };

    const [state] = useStateMachine('idle', machine);
    expect(state.value).toBe('idle');
  });

  it('should transition between states correctly', () => {
    const machine = {
      idle: { START: 'loading' as const },
      loading: { SUCCESS: 'success' as const, ERROR: 'error' as const },
      success: { RESET: 'idle' as const },
      error: { RESET: 'idle' as const, RETRY: 'loading' as const }
    };

    const [state, send] = useStateMachine('idle', machine);

    // Initial state
    expect(state.value).toBe('idle');

    // Transition to loading
    send('START');
    expect(state.value).toBe('loading');

    // Transition to success
    send('SUCCESS');
    expect(state.value).toBe('success');

    // Reset to idle
    send('RESET');
    expect(state.value).toBe('idle');
  });

  it('should handle error transitions', () => {
    const machine = {
      idle: { START: 'loading' as const },
      loading: { SUCCESS: 'success' as const, ERROR: 'error' as const },
      success: { RESET: 'idle' as const },
      error: { RESET: 'idle' as const, RETRY: 'loading' as const }
    };

    const [state, send] = useStateMachine('loading', machine);

    // Start from loading
    expect(state.value).toBe('loading');

    // Transition to error
    send('ERROR');
    expect(state.value).toBe('error');

    // Retry from error
    send('RETRY');
    expect(state.value).toBe('loading');

    // Reset from error
    send('ERROR');
    expect(state.value).toBe('error');
    send('RESET');
    expect(state.value).toBe('idle');
  });

  it('should stay in current state for invalid events', () => {
    const machine = {
      idle: { START: 'loading' as const },
      loading: { SUCCESS: 'success' as const, ERROR: 'error' as const },
      success: { RESET: 'idle' as const },
      error: { RESET: 'idle' as const, RETRY: 'loading' as const }
    };

    const [state, send] = useStateMachine('idle', machine);

    expect(state.value).toBe('idle');

    // Try to send an invalid event for idle state
    send('SUCCESS' as any);
    expect(state.value).toBe('idle'); // Should stay in idle

    send('ERROR' as any);
    expect(state.value).toBe('idle'); // Should stay in idle
  });

  it('should work with simple toggle machine', () => {
    const toggleMachine = {
      off: { TOGGLE: 'on' as const },
      on: { TOGGLE: 'off' as const }
    };

    const [state, send] = useStateMachine('off', toggleMachine);

    expect(state.value).toBe('off');

    send('TOGGLE');
    expect(state.value).toBe('on');

    send('TOGGLE');
    expect(state.value).toBe('off');

    send('TOGGLE');
    expect(state.value).toBe('on');
  });

  it('should work with complex machine with multiple events per state', () => {
    const machine = {
      closed: {
        OPEN: 'opening' as const,
        LOCK: 'locked' as const
      },
      opening: {
        OPENED: 'open' as const,
        CLOSE: 'closing' as const
      },
      open: {
        CLOSE: 'closing' as const,
        LOCK: 'locked' as const
      },
      closing: {
        CLOSED: 'closed' as const,
        OPEN: 'opening' as const
      },
      locked: {
        UNLOCK: 'closed' as const
      }
    };

    const [state, send] = useStateMachine('closed', machine);

    expect(state.value).toBe('closed');

    // Open sequence
    send('OPEN');
    expect(state.value).toBe('opening');

    send('OPENED');
    expect(state.value).toBe('open');

    // Lock from open
    send('LOCK');
    expect(state.value).toBe('locked');

    // Unlock
    send('UNLOCK');
    expect(state.value).toBe('closed');

    // Close sequence
    send('OPEN');
    send('CLOSE');
    expect(state.value).toBe('closing');

    send('CLOSED');
    expect(state.value).toBe('closed');
  });
});
