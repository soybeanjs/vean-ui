import { describe, expect, it } from 'vitest';
import {
  clamp,
  getBinaryCheckedState,
  getCheckedState,
  getDisclosureState,
  getOpenFromSingleOrMultiple,
  getValue,
  isIndeterminate,
  roundToStepPrecision,
  setValue,
  snapValueToStep
} from '../../../src/shared';

describe('checked state helpers', () => {
  it('isIndeterminate detects the indeterminate state', () => {
    expect(isIndeterminate('indeterminate')).toBe(true);
    expect(isIndeterminate(true)).toBe(false);
  });

  it('getCheckedState maps to checked / unchecked / indeterminate', () => {
    expect(getCheckedState(true)).toBe('checked');
    expect(getCheckedState(false)).toBe('unchecked');
    expect(getCheckedState('indeterminate')).toBe('indeterminate');
  });

  it('getBinaryCheckedState never returns indeterminate', () => {
    expect(getBinaryCheckedState('indeterminate')).toBe('unchecked');
    expect(getBinaryCheckedState(true)).toBe('checked');
  });
});

describe('getDisclosureState', () => {
  it('maps boolean open state to data-state values', () => {
    expect(getDisclosureState(true)).toBe('open');
    expect(getDisclosureState(false)).toBe('closed');
    expect(getDisclosureState(undefined)).toBe('closed');
  });
});

describe('getOpenFromSingleOrMultiple', () => {
  it('compares strictly in single mode', () => {
    expect(getOpenFromSingleOrMultiple('a', 'a', false)).toBe(true);
    expect(getOpenFromSingleOrMultiple('a', 'b', false)).toBe(false);
  });

  it('checks inclusion in multiple mode', () => {
    expect(getOpenFromSingleOrMultiple('a', ['a', 'b'], true)).toBe(true);
    expect(getOpenFromSingleOrMultiple('a', ['b'], true)).toBe(false);
  });
});

describe('clamp', () => {
  it('restricts values within the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe('step math', () => {
  it('roundToStepPrecision rounds to the step precision', () => {
    expect(roundToStepPrecision(0.30000000000000004, 0.1)).toBe(0.3);
    expect(roundToStepPrecision(1.234, 1)).toBe(1.234);
  });

  it('snapValueToStep snaps to the nearest step', () => {
    expect(snapValueToStep(3.2, 0, 10, 1)).toBe(3);
    expect(snapValueToStep(3.7, 0, 10, 1)).toBe(4);
    expect(snapValueToStep(0.35, 0, 1, 0.5)).toBe(0.5);
  });

  it('snapValueToStep clamps to min and max bounds', () => {
    expect(snapValueToStep(-5, 0, 10, 1)).toBe(0);
    expect(snapValueToStep(15, 0, 10, 1)).toBe(10);
  });
});

describe('setValue / getValue', () => {
  it('setValue creates nested structures along the path', () => {
    const obj: Record<string, any> = {};
    setValue(obj, 'a.b.c', 1);
    expect(obj).toEqual({ a: { b: { c: 1 } } });

    const withArray: Record<string, any> = {};
    setValue(withArray, 'list[0]', 'x');
    expect(withArray).toEqual({ list: ['x'] });
  });

  it('getValue reads nested values with a default fallback', () => {
    const obj = { a: { b: 1 } };
    expect(getValue(obj, 'a.b')).toBe(1);
    expect(getValue(obj, 'a.z', 'fallback')).toBe('fallback');
    expect(getValue(null, 'a.b', 'fallback')).toBe('fallback');
  });

  it('getValue keeps the default when obj itself is returned', () => {
    expect(getValue({ a: 1 }, '', 'fallback')).toBe('fallback');
  });
});
