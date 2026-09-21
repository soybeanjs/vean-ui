export interface ComponentChangelogOverride {
  components: string[];
}

export const componentChangelogOverrides: Record<string, ComponentChangelogOverride> = {
  'v0.15.4:fb274': {
    // The v0.15.4 `bottom-sheet` release is the gesture drawer family, renamed in v0.50.0.
    components: ['drawer']
  },
  'v0.16.0:6cbdc': {
    // `navigation-menu` was dropped here: the family was removed in v0.50.0 (superseded by `nav-menu`).
    components: ['card', 'editable', 'hover-card', 'pagination', 'popover', 'stepper']
  }
};
