/**
 * Terminal rendering helpers for `vean migrate` previews. Pure string work —
 * the command owns all printing.
 */

export interface PreviewLine {
  /** 1-based line number in the original file. */
  line: number;
  before: string;
  after: string;
}

export interface PreviewDiff {
  lines: PreviewLine[];
  /** Differing lines beyond `limit`, collapsed into `… N more`. */
  hidden: number;
}

/**
 * The first `limit` differing lines between `before` and `after`. Line counts
 * differ only when a rewrite adds or removes newlines, which no rule does, so
 * the diff is a straight pairwise comparison.
 */
export function previewDiff(before: string, after: string, limit = 4): PreviewDiff {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const length = Math.max(beforeLines.length, afterLines.length);
  const lines: PreviewLine[] = [];
  let hidden = 0;

  for (let index = 0; index < length; index += 1) {
    if (beforeLines[index] === afterLines[index]) {
      continue;
    }

    if (lines.length >= limit) {
      hidden += 1;
      continue;
    }

    lines.push({
      line: index + 1,
      before: beforeLines[index] ?? '',
      after: afterLines[index] ?? ''
    });
  }

  return { lines, hidden };
}

/** Clamp a line for terminal display: tabs expanded, trailing space dropped, ellipsis when long. */
export function truncateLine(value: string, max = 108): string {
  const trimmed = value.replace(/\t/g, '  ').trimEnd();

  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}
