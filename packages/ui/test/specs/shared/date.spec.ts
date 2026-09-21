import { describe, expect, it } from 'vitest';
import {
  areAllDaysBetweenValid,
  compareYearMonth,
  createDecade,
  createDateRange,
  createMonth,
  createYear,
  createYearGrid,
  getWeekNumber,
  getWeekStartsOn,
  isMonthBetweenInclusive,
  parseStringToDateValue
} from '@vean/aria/date';
import { chunk } from '@vean/aria/shared';

describe('shared date helpers', () => {
  it('creates a fixed six-week month grid', () => {
    const month = createMonth({
      dateObj: new Date(2026, 2 - 1, 1),
      weekStartsOn: 0,
      fixedWeeks: true,
      locale: 'en-US'
    });

    expect(month.rows).toHaveLength(6);
    expect(month.cells).toHaveLength(42);
    expect(month.value.getMonth() + 1).toBe(2);
  });

  it('builds an inclusive date range', () => {
    const dates = createDateRange({
      start: new Date(2026, 4 - 1, 18),
      end: new Date(2026, 4 - 1, 20)
    });

    expect(dates.map(date => date.getDate())).toEqual([18, 19, 20]);
  });

  it('throws when chunk size is not positive', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
    expect(() => chunk([1, 2, 3], -1)).toThrow('chunk size must be greater than 0');
  });

  it('parses strings into the reference value shape', () => {
    const dateValue = parseStringToDateValue('2026-04-18', new Date(2026, 0, 1));
    const dateTimeValue = parseStringToDateValue('2026-04-18T08:30:00', {
      date: new Date(2026, 0, 1),
      time: new Date(2000, 0, 1, 9)
    });
    const dateTimeReferenceDateOnly = parseStringToDateValue('2026-04-18', {
      date: new Date(2026, 0, 1),
      time: new Date(2000, 0, 1, 9)
    });

    expect(dateValue).toEqual(new Date(2026, 3, 18));
    expect(dateTimeValue).toEqual({
      date: new Date(2026, 3, 18),
      time: new Date(2000, 0, 1, 8, 30)
    });
    // A date-only string keeps the reference value's time part.
    expect(dateTimeReferenceDateOnly).toEqual({
      date: new Date(2026, 3, 18),
      time: new Date(2000, 0, 1, 9)
    });
  });

  it('validates all intermediate dates unless explicitly highlightable', () => {
    const start = new Date(2026, 4 - 1, 18);
    const end = new Date(2026, 4 - 1, 21);

    expect(areAllDaysBetweenValid(start, end, undefined, date => date.getDate() === 19)).toBe(false);
    expect(
      areAllDaysBetweenValid(
        start,
        end,
        undefined,
        date => date.getDate() === 19,
        date => date.getDate() === 19
      )
    ).toBe(true);
  });

  it('keeps year-month comparisons inclusive', () => {
    const start = new Date(2026, 4 - 1, 1);
    const current = new Date(2026, 5 - 1, 15);
    const end = new Date(2026, 6 - 1, 1);

    expect(compareYearMonth(start, current)).toBeLessThan(0);
    expect(isMonthBetweenInclusive(current, start, end)).toBe(true);
  });

  it('detects locale week rules and creates decade-aligned year grids', () => {
    expect(getWeekStartsOn('en-US')).toBe(0);
    expect(getWeekStartsOn('de-DE')).toBe(1);
    // 2023-01-01 is a Sunday, so the ISO (Monday-based) week number is 52 of 2022.
    expect(getWeekNumber(new Date(2023, 0, 1), 'en-US', 'mon')).toBe(52);
    expect(getWeekNumber(new Date(2023, 0, 1), 'en-US', 'sun')).toBe(1);

    const yearGrid = createYearGrid({ dateObj: new Date(2026, 4 - 1, 18) });

    expect(yearGrid.rows).toHaveLength(3);
    // createYearGrid is decade-aligned by default, so a 2026 date renders the 2020-2031 page.
    expect(yearGrid.cells[0]?.getFullYear()).toBe(2020);
    expect(yearGrid.cells.at(-1)?.getFullYear()).toBe(2031);
  });

  it('creates a contiguous decade range when start and end indexes are provided', () => {
    const years = createDecade({
      dateObj: new Date(2026, 4 - 1, 18),
      startIndex: -1,
      endIndex: 10
    });

    expect(years.map(year => year.getFullYear())).toEqual([
      2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036
    ]);
  });

  it('keeps trailing months reachable in paged year navigation', () => {
    const months = createYear({
      dateObj: new Date(2026, 4 - 1, 18),
      numberOfMonths: 5,
      pagedNavigation: true
    });

    expect(months.map(month => month.getMonth() + 1)).toEqual([1, 6, 11]);
  });
});
