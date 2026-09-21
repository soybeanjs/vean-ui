---
head:
  title: Visually Hidden
  description: VisuallyHidden is a utility component that hides content from the screen but keeps it accessible to screen readers. It is essential for accessibility when you want to provide context to users relying on assistive technologies without affecting the visual design.
---

# Visually Hidden

## Overview

`VisuallyHidden` is a utility component that hides content from the screen but keeps it accessible to screen readers. It is essential for accessibility when you want to provide context to users relying on assistive technologies without affecting the visual design.

> Note: This component is exported from `@vean/aria`.

## Usage

<UsageCode component="visually-hidden" />

## API

### Props

<DataTable preset="props" :data="[
  { name: 'as', type: 'string | Component', default: `'span'`, description: 'Rendered element' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Merge props into child element' }
]"/>

### Slots

<DataTable preset="slots" :data="[
  { name: 'default', parameters: '-', description: 'Hidden content' }
]"/>
