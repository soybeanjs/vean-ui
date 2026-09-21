---
head:
  title: 视觉隐藏
  description: VisuallyHidden 是一个工具组件：它会在视觉上隐藏内容，但仍能被屏幕阅读器读取。当你需要在不影响视觉设计的前提下，为依赖辅助技术的用户提供额外上下文时，它对无障碍体验非常重要。
---

# 视觉隐藏

## 概述

`VisuallyHidden` 是一个工具组件：它会在视觉上隐藏内容，但仍能被屏幕阅读器读取。当你需要在不影响视觉设计的前提下，为依赖辅助技术的用户提供额外上下文时，它对无障碍体验非常重要。

> 注意：该组件从 `@vean/aria` 导出。

## 用法

<UsageCode component="visually-hidden" />

## API

### 属性

<DataTable preset="props" :data="[
  { name: 'as', type: 'string | Component', default: `'span'`, description: '渲染的元素' },
  { name: 'asChild', type: 'boolean', default: 'false', description: '将属性合并到子元素' }
]"/>

### 插槽

<DataTable preset="slots" :data="[
  { name: 'default', parameters: '-', description: '隐藏内容' }
]"/>
