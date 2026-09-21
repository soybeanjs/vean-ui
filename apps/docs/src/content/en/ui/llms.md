---
head:
  title: LLMs.txt
  description: "How to use Vean's generated LLM-friendly documentation with Cursor, Windsurf, GitHub Copilot, ChatGPT, Claude, and similar AI tools."
---

# LLMs.txt

> How to use Vean's generated LLM-friendly documentation with Cursor, Windsurf, GitHub Copilot, ChatGPT, Claude, and similar AI tools.

## What is LLMs.txt?

LLMs.txt is a structured documentation format for large language models. VeanUI generates dedicated LLM-friendly files during the docs build so AI tools can consume the library docs, API details, and usage guidance more reliably than by reading the rendered website alone.

The generated files are optimized for AI consumption and currently use the English docs set as the source of truth.

## Available routes

VeanUI exposes the following LLM-oriented routes from the docs build output:

- **/llms.txt** - a compact overview of the docs and component links, intended for normal context windows
- **/llms-full.txt** - a much larger bundle that includes the rendered documentation content plus generated API details
- **/overview/\*.md** and **/components/\*.md** - page-level Markdown routes for individual English guide and component pages

## Choosing the right file

> Start with **/llms.txt** in most cases. It is smaller, faster to load into AI context, and usually enough for general guidance and navigation.

Use **/llms-full.txt** when you need:

- richer component API details
- rendered guide content in one place
- a larger context source for long-form implementation help

Use the per-page Markdown routes when you want to keep prompts narrow, for example only one component or one guide.

## Important notes

- The generated LLM files are based on the English docs source.
- The website itself is localized, but the LLM export currently uses the English documentation source.
- Component API sections in the LLM files are rendered from generated API metadata during the docs build.

## Usage with AI tools

### Cursor

You can reference VeanUI docs routes directly in Cursor prompts or add them through docs-based context features.

Examples:

- Use https://veanui.com/llms.txt as the VeanUI docs context
- Follow VeanUI component guidance from https://veanui.com/components/button.md

If you use `@docs`-style references in tools like Cursor or Windsurf, type the trigger manually in the editor UI instead of pasting it.

### Windsurf

Windsurf can use the same routes as persistent documentation references for component usage, theming, and API guidance.

Recommended starting points:

- `/llms.txt` for general usage guidance
- `/llms-full.txt` for deeper API and content coverage
- individual component Markdown routes when you only need one component page

### GitHub Copilot, ChatGPT, Claude, and others

Any tool that can read URLs or pasted Markdown can use these files.

Examples:

- Follow VeanUI docs from https://veanui.com/llms.txt
- Use the Button page from https://veanui.com/components/button.md
- Use the full VeanUI bundle from https://veanui.com/llms-full.txt

## Practical recommendations

1. Start with `/llms.txt` for quick orientation.
2. Add one or two page-level Markdown routes for the exact guide or component you are working on.
3. Only switch to `/llms-full.txt` when the smaller files are not enough.

## Related routes

- [Quick Start](/overview/quick-start)
- [Introduction](/overview/introduction)
- [Theming](/overview/theming)
- [Components](/components)
