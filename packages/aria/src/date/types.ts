/**
 * A date with an optional time-of-day part. `date` carries the calendar day
 * (local 00:00 by convention); `time` carries the time-of-day when the value
 * has time granularity.
 */
export interface DateTimeValue {
  date: Date;
  time?: Date;
}

/**
 * Public date value model: a plain `Date` for day-granularity values (local
 * 00:00), or `{ date, time? }` when a time part is present.
 */
export type DateValue = Date | DateTimeValue;

/**
 * Range value with nullable bounds. Members accept `null` (empty bound) and
 * tolerate omission for partial ranges.
 */
export interface DateRange {
  start?: DateValue | null;
  end?: DateValue | null;
}

/**
 * A time-of-day value. Only the hour/minute/second parts are meaningful; the
 * date part is normalized to a fixed local epoch.
 */
export type TimeValue = Date;

/**
 * Time-of-day range with nullable bounds. Members accept `null` (empty bound)
 * and tolerate omission for partial ranges.
 */
export interface TimeRange {
  start?: Date | null;
  end?: Date | null;
}

export type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export type DateMatcher = (date: Date) => boolean;

export type TimeMatcher = (time: Date) => boolean;

export interface DateGrid<T> {
  value: Date;
  rows: T[][];
  cells: T[];
}

export interface DateStep {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

export type HourCycle = 12 | 24 | undefined;
export type DateSegmentPart = 'day' | 'month' | 'year';
export type TimeSegmentPart = 'hour' | 'minute' | 'second' | 'dayPeriod';
export type EditableSegmentPart = DateSegmentPart | TimeSegmentPart;
export type NonEditableSegmentPart = 'literal' | 'timeZoneName';
export type SegmentPart = EditableSegmentPart | NonEditableSegmentPart;
export type AnyExceptLiteral = Exclude<SegmentPart, 'literal'>;

export type DayPeriod = 'AM' | 'PM' | null;
export type WeekDayFormat = 'narrow' | 'short' | 'long';
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DateSegmentObj = {
  [K in DateSegmentPart]: number | null;
};

export type TimeSegmentObj = {
  [K in TimeSegmentPart]: K extends 'dayPeriod' ? DayPeriod : number | null;
};

export type DateAndTimeSegmentObj = DateSegmentObj & TimeSegmentObj;
export type SegmentValueObj = DateSegmentObj | DateAndTimeSegmentObj;
export type SegmentContentObj = Record<EditableSegmentPart, string>;

export type DateInputType = 'date' | 'datetime-local';
export type TimeInputType = 'time';
export type TimeGranularity = 'hour' | 'minute' | 'second';
export type Granularity = 'day' | TimeGranularity;
