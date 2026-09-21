import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { cloneJsonObject, isJsonObject, listFileBasenames } from '../shared/json';
import type { JsonObject, JsonValue } from '../shared/json';
import type { TranslationEntry } from '../shared/translate';

/**
 * File-format layer for the aria locale registry
 * (`packages/aria/src/locale/langs/*.ts`): reading, rebuilding, and
 * serializing these modules, plus the copy guidance used when translating them.
 */
interface LocaleRegistryDocument {
  name: string;
  key: string;
  dir?: 'ltr' | 'rtl';
  messages: JsonObject;
}

const rootDir = process.cwd();
export const localeDir = path.join(rootDir, 'packages/aria/src/locale/langs');

const rtlLanguageCodes = new Set(['ar', 'fa', 'he', 'ur']);

export async function listLocaleNames(): Promise<string[]> {
  return listFileBasenames(localeDir, '.ts');
}

function isMissingModuleError(error: unknown, filePath: string): boolean {
  if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
    return true;
  }

  return error instanceof Error && error.message.includes(path.basename(filePath));
}

function isLocaleRegistryDocument(value: unknown): value is LocaleRegistryDocument {
  return (
    isJsonObject(value) &&
    typeof value.name === 'string' &&
    typeof value.key === 'string' &&
    isJsonObject(value.messages) &&
    (value.dir === undefined || value.dir === 'ltr' || value.dir === 'rtl')
  );
}

function getPrimaryLanguageSubtag(locale: string): string {
  const normalizedLocale = locale.trim().replace(/_/gu, '-').toLowerCase();

  if (!normalizedLocale) {
    return 'en';
  }

  return normalizedLocale.split('-')[0] ?? 'en';
}

function resolveLocaleDirection(locale: string): 'ltr' | 'rtl' {
  return rtlLanguageCodes.has(getPrimaryLanguageSubtag(locale)) ? 'rtl' : 'ltr';
}

function resolveLocaleDisplayName(locale: string): string {
  const normalizedLocale = locale.trim().replace(/_/gu, '-');
  const [languageCode, regionCode] = normalizedLocale.split('-');

  if (!languageCode) {
    return 'English';
  }

  const languageDisplayNames = new Intl.DisplayNames([normalizedLocale, languageCode, 'en'], {
    type: 'language'
  });
  const languageName = languageDisplayNames.of(languageCode) ?? normalizedLocale;

  if (!regionCode) {
    return languageName;
  }

  const regionDisplayNames = new Intl.DisplayNames([normalizedLocale, languageCode, 'en'], {
    type: 'region'
  });
  const regionName = regionDisplayNames.of(regionCode.toUpperCase());

  if (!regionName) {
    return languageName;
  }

  return `${languageName} (${regionName})`;
}

function toLocaleExportName(locale: string): string {
  const segments = locale.trim().replace(/_/gu, '-').split('-').filter(Boolean);
  const [firstSegment, ...remainingSegments] = segments;

  if (!firstSegment) {
    return 'en';
  }

  return `${firstSegment.toLowerCase()}${remainingSegments.map(segment => segment.toUpperCase()).join('')}`;
}

export function getLocaleFilePath(locale: string): string {
  return path.join(localeDir, `${locale}.ts`);
}

export async function readLocaleMessages(locale: string): Promise<JsonObject> {
  const filePath = getLocaleFilePath(locale);

  try {
    const localeModule = (await import(pathToFileURL(filePath).href)) as Record<string, unknown>;
    const exportName = toLocaleExportName(locale);
    const localeExport = localeModule.default ?? localeModule[exportName];
    const messages = isLocaleRegistryDocument(localeExport) ? localeExport.messages : localeExport;

    return isJsonObject(messages) ? cloneJsonObject(messages) : {};
  } catch (error) {
    if (isMissingModuleError(error, filePath)) {
      return {};
    }

    throw error;
  }
}

/** `date.placeholder.*` mirrors the date format of the source locale verbatim. */
export function shouldTranslateKey(key: string): boolean {
  return !key.startsWith('date.placeholder.');
}

/** Rebuild the source message tree, substituting the translated leaves. */
export function rebuildLocaleMessages(
  sourceMessages: JsonObject,
  translatedMessages: Map<string, string>,
  prefix: string = ''
): JsonObject {
  const output: JsonObject = {};

  for (const [key, value] of Object.entries(sourceMessages)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      output[key] = translatedMessages.get(nextKey) ?? value;
      continue;
    }

    if (isJsonObject(value)) {
      output[key] = rebuildLocaleMessages(value, translatedMessages, nextKey);
    }
  }

  return output;
}

function formatObjectKey(key: string): string {
  return /^[A-Za-z_$][\w$]*$/u.test(key) ? key : JSON.stringify(key);
}

function escapeString(value: string): string {
  return value.replace(/\\/gu, '\\\\').replace(/'/gu, "\\'").replace(/\n/gu, '\\n');
}

function serializeTsValue(value: JsonValue, indentLevel: number = 0): string {
  if (typeof value === 'string') {
    return `'${escapeString(value)}'`;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return '[]';
    }

    const indent = '  '.repeat(indentLevel);
    const childIndent = '  '.repeat(indentLevel + 1);

    return `[
${value.map(item => `${childIndent}${serializeTsValue(item, indentLevel + 1)}`).join(',\n')}
${indent}]`;
  }

  const entries = Object.entries(value);

  if (!entries.length) {
    return '{}';
  }

  const indent = '  '.repeat(indentLevel);
  const childIndent = '  '.repeat(indentLevel + 1);

  return `{
${entries.map(([key, item]) => `${childIndent}${formatObjectKey(key)}: ${serializeTsValue(item, indentLevel + 1)}`).join(',\n')}
${indent}}`;
}

export async function writeLocaleMessages(locale: string, messages: JsonObject): Promise<void> {
  const exportName = toLocaleExportName(locale);
  const localeRegistry = {
    name: resolveLocaleDisplayName(locale),
    key: locale,
    dir: resolveLocaleDirection(locale),
    messages
  };
  const content = `import type { LocaleRegistry } from '../types';\n\nconst ${exportName}: LocaleRegistry = ${serializeTsValue(localeRegistry)};\n\nexport default ${exportName};\n`;

  await writeFile(getLocaleFilePath(locale), content, 'utf8');
}

function getEntryDescription(key: string): string {
  switch (key) {
    case 'pagination.firstPage':
    case 'pagination.prevPage':
    case 'pagination.nextPage':
    case 'pagination.lastPage':
      return 'Pagination button label and aria-label.';
    case 'table.emptyTitle':
      return 'Table empty state title.';
    case 'table.emptyDescription':
      return 'Table empty state description.';
    case 'table.selectAllRows':
      return 'Aria-label for selecting all table rows.';
    case 'table.sortByColumn':
      return 'Aria-label template for sorting a table column. Keep {column} unchanged.';
    case 'table.sortByColumnAsc':
      return 'Aria-label template for a table column sorted ascending. Keep {column} unchanged.';
    case 'table.sortByColumnDesc':
      return 'Aria-label template for a table column sorted descending. Keep {column} unchanged.';
    case 'table.resizeColumn':
      return 'Aria-label template for resizing a table column. Keep {column} unchanged.';
    case 'table.expandRow':
      return 'Aria-label template for expanding a table row. Keep {row} unchanged.';
    case 'table.collapseRow':
      return 'Aria-label template for collapsing a table row. Keep {row} unchanged.';
    case 'table.selectRow':
      return 'Aria-label template for selecting a table row. Keep {row} unchanged.';
    case 'calendar.prevPage':
    case 'calendar.nextPage':
      return 'Calendar navigation button label and aria-label.';
    case 'calendar.selectMonth':
      return 'Aria-label for opening the month selector in a calendar.';
    case 'calendar.selectYear':
      return 'Aria-label for opening the year selector in a calendar.';
    case 'layout.toggleSidebar':
      return 'Aria-label and title for toggling a layout sidebar.';
    case 'inputNumber.increment':
      return 'Aria-label for increasing a number input value.';
    case 'inputNumber.decrement':
      return 'Aria-label for decreasing a number input value.';
    case 'inputNumber.clear':
      return 'Aria-label for clearing a number input value.';
    case 'textarea.clear':
      return 'Aria-label for clearing a textarea value.';
    case 'tagsInput.addTag':
      return 'Aria-label for a tags input field used to add a tag.';
    case 'tagsInput.clear':
      return 'Aria-label for clearing all tags.';
    case 'progress.loading':
      return 'Aria-label describing a loading progress indicator.';
    case 'anchor.nav':
      return 'Aria-label for an anchor navigation landmark.';
    case 'breadcrumb.nav':
      return 'Aria-label for a breadcrumb navigation landmark.';
    case 'stepper.step':
      return 'Step indicator text template. Keep {step} unchanged.';
    case 'editable.cancel':
    case 'dialog.cancel':
      return 'Button text and aria-label for a cancel action.';
    case 'editable.edit':
      return 'Button text and aria-label for entering edit mode.';
    case 'editable.submit':
      return 'Button text and aria-label for submitting an edit.';
    case 'combobox.clearInput':
    case 'autocomplete.clearInput':
    case 'password.clearInput':
      return 'Aria-label for clearing the current text input value. Clear means remove content, not make obvious.';
    case 'combobox.noResults':
    case 'autocomplete.noResults':
    case 'command.noResults':
      return 'Empty state text shown when search returns no results.';
    case 'combobox.search':
      return 'Fallback aria-label for a search input field.';
    case 'combobox.options':
      return 'Fallback aria-label for the options list or viewport.';
    case 'autocomplete.toggleSuggestions':
      return 'Aria-label for toggling the autocomplete suggestions list.';
    case 'dialog.confirm':
      return 'Button text and aria-label for confirming an action.';
    case 'slider.valueN':
      return 'Aria-label template for one slider thumb in a multi-value slider. Keep {index} and {total} unchanged.';
    case 'slider.minimum':
      return 'Aria-label for the minimum thumb in a range slider.';
    case 'slider.maximum':
      return 'Aria-label for the maximum thumb in a range slider.';
    case 'password.showPassword':
      return 'Aria-label for showing a hidden password.';
    case 'password.hidePassword':
      return 'Aria-label for hiding a visible password.';
    case 'date.daySegment':
      return 'Aria-label for the day segment in a date input.';
    case 'date.monthSegment':
      return 'Aria-label for the month segment in a date input.';
    case 'date.yearSegment':
      return 'Aria-label for the year segment in a date input.';
    case 'date.hourSegment':
      return 'Aria-label for the hour segment in a time input.';
    case 'date.minuteSegment':
      return 'Aria-label for the minute segment in a time input.';
    case 'date.secondSegment':
      return 'Aria-label for the second segment in a time input.';
    case 'date.dayPeriodSegment':
      return 'Aria-label for the AM/PM or day period segment in a time input.';
    case 'date.timeZoneSegment':
      return 'Aria-label for the time zone segment in a time input.';
    case 'date.empty':
      return 'Aria-valuetext for an empty or unfilled date/time segment.';
    default:
      return 'Short UI copy for a component label, button, aria-label, or empty state.';
  }
}

export function createLocaleTranslationContext(locale: string, entries: TranslationEntry[]): string {
  return [
    `Target locale: ${locale}.`,
    'Translate short built-in UI copy for a Vue component library.',
    'Keep placeholders such as {column}, {row}, {step}, {index}, and {total} unchanged.',
    'For verbs such as clear, confirm, submit, edit, and toggle, prefer concise interface wording suitable for button labels and aria-labels.',
    'For date strings, day, month, year, hour, minute, second, day period, and time zone refer to date or time input segments.',
    'Preserve punctuation, spacing, casing intent, and concise accessibility wording.',
    'Translate naturally for interface labels, empty states, and button text.',
    ...entries.map(entry => `${entry.key}: ${getEntryDescription(entry.key)}`)
  ].join(' ');
}
