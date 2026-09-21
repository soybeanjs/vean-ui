import { readFileSync } from 'node:fs';
import { components as ariaComponents } from '../../aria/src/constants/components';
import { components as uiComponents } from '../../ui/src/constants/components';
import { kebabCase } from '../../aria/src/shared/string';
import { resolveChangelogComponent, resolveNoteReleaseVersion, resolveReleaseLine } from '../src/commands/changelog';
import { componentRenameMap, releaseChangelogNotes } from '../src/commands/changelog-notes';

const changelogPath = new URL('../../../CHANGELOG.md', import.meta.url);

/** Published versions in `CHANGELOG.md` order (newest first). */
function readPublishedVersions(): string[] {
  const content = readFileSync(changelogPath, 'utf8');

  return [...content.matchAll(/^## \[(v[^\]]+)\]/gmu)].map(match => match[1]);
}

describe('commands/changelog component attribution', () => {
  it('resolves aria families and UI-only components alike', () => {
    expect(resolveChangelogComponent('table')).toBe('table');
    expect(resolveChangelogComponent('badge')).toBe('badge');
    expect(resolveChangelogComponent('card')).toBe('card');
    expect(resolveChangelogComponent('empty')).toBe('empty');
    expect(resolveChangelogComponent('list')).toBe('list');
    expect(resolveChangelogComponent('sheet')).toBe('sheet');
    expect(resolveChangelogComponent('spinner')).toBe('spinner');
  });

  it('follows renames to the successor component', () => {
    expect(resolveChangelogComponent('bottom-sheet')).toBe('drawer');
  });

  it('stops attributing removed families', () => {
    expect(resolveChangelogComponent('navigation-menu')).toBeNull();
    expect(resolveChangelogComponent('projects')).toBeNull();
  });

  it('only maps renames onto components that exist in a catalog', () => {
    const catalogNames = new Set(
      [...Object.keys(ariaComponents), ...Object.keys(uiComponents)].map(name => kebabCase(name))
    );

    for (const [from, to] of Object.entries(componentRenameMap)) {
      expect(catalogNames.has(from)).toBe(false);
      expect(catalogNames.has(to)).toBe(true);
    }
  });
});

describe('commands/changelog release note resolution', () => {
  it('resolves a version to its release line', () => {
    expect(resolveReleaseLine('v0.40.0')).toBe('v0.40.0');
    expect(resolveReleaseLine('v0.40.0-beta.1')).toBe('v0.40.0');
    expect(resolveReleaseLine('v0.40.1')).toBe('v0.40.1');
  });

  it('renders a note on the newest published release of its line', () => {
    const published = ['v0.50.0-beta.5', 'v0.40.1', 'v0.40.0', 'v0.40.0-beta.1'];

    expect(resolveNoteReleaseVersion('v0.50.0', published)).toBe('v0.50.0-beta.5');
    expect(resolveNoteReleaseVersion('v0.40.0-beta.1', published)).toBe('v0.40.0');
    expect(resolveNoteReleaseVersion('v0.40.0', published)).toBe('v0.40.0');
  });

  it('keeps notes off unrelated release lines and reports lines with no release', () => {
    expect(resolveNoteReleaseVersion('v0.40.0', ['v0.40.1', 'v0.50.0-beta.1'])).toBeNull();
    expect(resolveNoteReleaseVersion('v0.60.0', ['v0.50.0-beta.1'])).toBeNull();
  });

  it('renders every authored note on a release published in CHANGELOG.md', () => {
    const publishedVersions = readPublishedVersions();

    expect(publishedVersions.length).toBeGreaterThan(0);

    for (const noteVersion of Object.keys(releaseChangelogNotes)) {
      expect(resolveNoteReleaseVersion(noteVersion, publishedVersions), noteVersion).not.toBeNull();
    }
  });
});
