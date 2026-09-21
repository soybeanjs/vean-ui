/**
 * Per-release custom notes that are injected into the generated release
 * changelog (`apps/docs/src/generated/changelog/releases.json`) in addition to
 * the git-commit-derived entries.
 *
 * The CHANGELOG itself is generated from git commits, so it cannot carry
 * maintainer-authored guidance (for example "this release has breaking
 * changes"). Add such notes here, keyed by the release line they document
 * (`v0.50.0` covers `v0.50.0-beta.1` … `v0.50.0`), and they will be attached to
 * the newest published release of that line and rendered on the `/releases`
 * page. A note therefore goes live on the newest prerelease and moves to the
 * stable release as soon as it is published, with no key edit and no lost
 * translation.
 *
 * The `summary` field is written in the default locale (English) and is
 * translatable: a `summaryKey` is generated from the note key + index and
 * registered in `apps/docs/src/generated/changelog-locales/*.json`, then
 * translated for non-English locales via `pnpm sui translate changelog`.
 */
export interface ReleaseChangelogNoteSource {
  /**
   * The tone of the note, which drives the alert color on the releases page.
   *
   * - `breaking`: the release contains breaking changes; rendered as a warning alert.
   * - `info`: general migration / highlight guidance; rendered as an info alert.
   */
  type: 'breaking' | 'info';
  /** The note body (default locale, English). Translatable via `summaryKey`. */
  summary: string;
  /**
   * Optional content path of the upgrade guide for this release, relative to
   * `src/content/{locale}/` (e.g. `ui/migration/v0.40.0`). When set, the
   * releases page renders a link to `/overview/migration/<version>`.
   */
  docPath?: string;
}

export const releaseChangelogNotes: Record<string, ReleaseChangelogNoteSource[]> = {
  'v0.30.0-beta.1': [
    {
      type: 'breaking',
      summary:
        'This release ships a rebuilt theme system with renamed packages. ' +
        '@soybeanjs/shadcn-theme is now @soybeanjs/theme (createShadcnTheme → createTheme), and ' +
        '@soybeanjs/unocss-shadcn is now @soybeanjs/ui-uno (presetShadcn → presetUi, ShadcnPresetOptions → UiUnocssOptions). ' +
        'The theme menu config (menuColor / menuAccent) is removed, and custom color overrides now use `overrides: { light, dark }` ' +
        'instead of the legacy preset object (presets can also be passed through SConfigProvider `theme.preset`). ' +
        'Please update your dependencies and imports accordingly.'
    }
  ],
  // Authored on the v0.40.0 line's first prerelease; it renders on the published
  // stable `v0.40.0` while the key — and its translations — stay stable.
  'v0.40.0-beta.1': [
    {
      type: 'breaking',
      summary:
        'This release removes the published peripheral packages @soybeanjs/ui-x, @soybeanjs/admin and @soybeanjs/chart. ' +
        'In headless, the RovingFocusGroup/RovingFocusItem components are replaced by the useRovingFocusGroup/useRovingFocusGroupItem ' +
        'composables, PropsToContext is renamed to ToContext, and transformPropsToContext becomes toContext with plain (non-invoked) ' +
        'function values. STable no longer rounds by default, and headless components stop injecting global helper classes. ' +
        'See the upgrade guide for the full migration walkthrough.',
      docPath: 'ui/migration/v0.40.0'
    }
  ],
  'v0.50.0': [
    {
      type: 'breaking',
      summary:
        'This release swaps all three engines and renames two families. The date engine moves from @internationalized/date to ' +
        'date-fns with native Date values; the table engine is rebuilt on @tanstack/vue-table (TanStack column/state naming, no legacy aliases); ' +
        'the form engine is rebuilt on @tanstack/vue-form (useForm returns a context object, initialValues becomes defaultValues). ' +
        'NavigationMenu is removed in favor of NavMenu; SDrawer renames to SSheet while SBottomSheet becomes the new gesture-driven SDrawer; ' +
        'presentation-only headless families (card/empty/list/skeleton/badge/tag) are removed, and SPopper/SArrow are no longer exported ' +
        'from the UI package. The SPagination actionAsSelected prop is renamed to actionVariant (same semantics, same default). ' +
        'See the upgrade guide for the full migration walkthrough.',
      docPath: 'ui/migration/v0.50.0'
    },
    {
      type: 'info',
      summary:
        'Date components (Calendar, DateField, DatePicker, TimeField and their range variants) now operate on native Date values built ' +
        'on date-fns. The dedicated date guide maps CalendarDate/Time/DateTime values, calendar math and formatting/parsing to the new model.',
      docPath: 'ui/migration/v0.50.0-date'
    },
    {
      type: 'breaking',
      summary:
        'The brand rename ships with this release: the npm scope moves from @soybeanjs/* to @vean/* (@soybeanjs/headless becomes ' +
        '@vean/aria, @soybeanjs/ui becomes @vean/ui, @soybeanjs/theme becomes @vean/theme, @soybeanjs/ui-uno becomes @vean/unocss, ' +
        '@soybeanjs/ui-skills becomes @vean/skills), the runtime contracts rename (data-soybean-* to data-vean-*, --soybean-* to ' +
        '--vean-*), and the CLI ships as @vean/cli with the vean bin (config file sbean.json becomes vean.json). The S component prefix, ' +
        'design tokens and the theme localStorage key are unchanged. See the brand migration guide for the full mapping.',
      docPath: 'ui/migration/rebrand'
    }
  ]
};

/**
 * Component renames applied when attributing changelog entries: entries scoped
 * to the old name follow the successor, so a wholesale rename keeps its history
 * on one component page (e.g. `bottom-sheet` history lives under `drawer`).
 *
 * Only map true 1:1 renames. Removed families with no successor (e.g.
 * `navigation-menu`) must not be listed — their entries simply stop being
 * attributed, and their history remains in `CHANGELOG.md`.
 */
export const componentRenameMap: Record<string, string> = {
  'bottom-sheet': 'drawer'
};

/**
 * Components newly introduced in a given release version (i.e. they did not
 * exist in any earlier version). Keyed by the version string, same as
 * `releaseChangelogNotes`.
 *
 * These are curated manually because they cannot be inferred reliably from the
 * git-commit-derived CHANGELOG entries: new components are often committed under
 * an aggregate scope (e.g. `components`) that does not resolve to a component
 * name, and pre-existing components can appear in the changelog later than they
 * were actually introduced.
 */
export const releaseIntroducedComponents: Record<string, string[]> = {
  'v0.30.0-beta.1': [
    'cascader',
    'rating',
    'palette-picker',
    'theme-customizer',
    'theme-mode-select',
    'theme-mode-switch'
  ]
};
