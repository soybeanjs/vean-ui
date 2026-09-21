---
head:
  title: Skills
  description: 'Install VeanUI skills to give AI coding agents deep knowledge of components, theming, aria composition patterns, and generated references.'
---

# Skills

> Install VeanUI skills to give AI coding agents deep knowledge of components, theming, aria composition patterns, and generated references.

## What are Skills?

Skills are structured knowledge files for AI coding agents. They package library-specific guidance, workflows, and references so an agent can load the right context when a task matches.

Unlike MCP servers, skills do not provide live tools. They provide curated instructions and references directly in the model context.

VeanUI currently ships two public skills:

- **vean-ui** - styled package usage, theming, docs navigation, and generated component references
- **vean-aria** - aria primitives, Compact patterns, composition guidance, and shared component references

## What the VeanUI skills cover

The bundled skills help agents answer tasks such as:

- when to choose `@vean/ui` versus `@vean/aria`
- how to set up theming, locale, and direction
- how to use component APIs and generated references efficiently
- how to compose aria primitives into custom-styled wrappers
- how to navigate the docs and generated references without loading the whole site

## Usage

> **Repository rename not yet live.** Every installation path on this page resolves skills from GitHub, so the commands below only work once the repository rename `soybeanjs/soybean-ui` → `soybeanjs/vean-ui` has landed. Until then `github.com/soybeanjs/vean-ui` returns 404 — use the current slug `soybeanjs/soybean-ui` instead, for example `npx skills add soybeanjs/soybean-ui/skills`.

### Skills CLI

The easiest installation path is the `skills` CLI:

```bash
npx skills add soybeanjs/vean-ui/skills
```

You can target a specific agent:

```bash
npx skills add soybeanjs/vean-ui/skills --agent cursor
npx skills add soybeanjs/vean-ui/skills --agent claude-code
```

Or install globally so the skills are available across projects:

```bash
npx skills add soybeanjs/vean-ui/skills --global
```

Installing the package adds both `vean-ui` and `vean-aria`.

### Skills URL

If your tool supports direct skill URLs, you can point it at the public GitHub skill directory.

For the styled UI skill:

```text
https://github.com/soybeanjs/vean-ui/tree/main/skills/skills/vean-ui
```

For the aria skill:

```text
https://github.com/soybeanjs/vean-ui/tree/main/skills/skills/vean-aria
```

### Claude Code

Claude Code can install an individual skill directly from the GitHub directory:

```bash
claude skill add https://github.com/soybeanjs/vean-ui/tree/main/skills/skills/vean-ui
claude skill add https://github.com/soybeanjs/vean-ui/tree/main/skills/skills/vean-aria
```

The repository also ships Claude marketplace metadata inside the published skills package.

### Other AI tools

Any tool that supports GitHub-hosted skill folders or custom instruction directories can use the same sources.

- **VeanUI skill entry**: https://github.com/soybeanjs/vean-ui/tree/main/skills/skills/vean-ui/SKILL.md
- **VeanUI skill directory**: https://github.com/soybeanjs/vean-ui/tree/main/skills/skills/vean-ui
- **VeanAria skill entry**: https://github.com/soybeanjs/vean-ui/tree/main/skills/skills/vean-aria/SKILL.md
- **VeanAria skill directory**: https://github.com/soybeanjs/vean-ui/tree/main/skills/skills/vean-aria

## Practical recommendations

1. Install the full `@vean/skills` package when you work with both styled and aria packages.
2. Use `vean-ui` when you need component usage, theming, and docs navigation help.
3. Use `vean-aria` when you need composition guidance or custom-styled wrapper patterns.
4. Keep `llms.txt` as a complementary source when you need docs-wide context instead of packaged skill context.

## Related pages

- [Introduction](/overview/introduction)
- [Quick Start](/overview/quick-start)
- [Theming](/overview/theming)
- [LLMs.txt](/overview/llms)
- [Components](/components)
