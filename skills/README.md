# Vean Skills

Agent skills for `@vean/ui` and `@vean/aria`.

## Installation

```bash
npx skills add soybeanjs/vean-ui/skills
```

The `skills` CLI installs every skill shipped in the package and places them into the correct agent-specific skills directory.

## Included Skills

- `vean-ui`: Styled Vean usage, theming, docs, and component references
- `vean-aria`: Aria primitives, Compact patterns, and composition guidance

## Claude Code Marketplace

```bash
/plugin marketplace add vean-skills
/plugin install vean-skills@vean-skills
```

## Development

Generate the publishable package contents from the source repository:

```bash
pnpm sui gen skills
```
