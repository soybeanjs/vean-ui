---
head:
  title: LLMs.txt
  description: 介绍如何在 Cursor、Windsurf、GitHub Copilot、ChatGPT、Claude 等 AI 工具中使用 VeanUI 生成的 LLM 友好文档。
---

# LLMs.txt

> 介绍如何在 Cursor、Windsurf、GitHub Copilot、ChatGPT、Claude 等 AI 工具中使用 VeanUI 生成的 LLM 友好文档。

## 什么是 LLMs.txt？

LLMs.txt 是一种面向大语言模型的结构化文档格式。VeanUI 会在文档构建阶段生成专门的 LLM 友好文件，让 AI 工具比直接读取渲染后的站点页面更稳定地获取组件文档、API 信息和使用建议。

这些生成文件专门针对 AI 消费场景做了处理，目前以英文文档作为导出来源。

## 可用路由

VeanUI 文档构建后会暴露以下面向 LLM 的路由：

- **/llms.txt** - 精简版文档总览，适合普通上下文窗口
- **/llms-full.txt** - 完整版文档包，包含渲染后的文档内容和生成的 API 细节
- **/overview/\*.md** 与 **/components/\*.md** - 单页 Markdown 路由，对应英文 guide 和组件页面

## 如何选择文件

> 大多数情况下应先使用 **/llms.txt**。它更小、更容易放进 AI 上下文，也足够完成大部分导航和一般性问答。

以下场景再考虑 **/llms-full.txt**：

- 需要更完整的组件 API 细节
- 需要把渲染后的 guide 内容集中放进上下文
- 需要更大的资料包来支撑长链路实现问题

如果你只关注某一个 guide 或某一个组件，优先使用对应的单页 Markdown 路由，这样上下文更干净。

## 重要说明

- 当前生成的 LLM 文件基于英文文档源。
- 站点本身支持多语言，但 LLM 导出目前仍以英文文档源为基础。
- 组件 API 部分是在 docs build 阶段由生成的 API 元数据渲染出来的。

## 在 AI 工具中的使用方式

### Cursor

你可以在 Cursor 的提问中直接引用 VeanUI 文档路由，或者通过文档上下文能力把这些路由加进去。

示例：

- Use https://veanui.com/llms.txt as the VeanUI docs context
- Follow VeanUI component guidance from https://veanui.com/components/button.md

如果你在 Cursor 或 Windsurf 里使用 `@docs` 这类引用方式，建议手动输入触发符号，不要直接粘贴整段触发文本。

### Windsurf

Windsurf 也可以把这些路由作为持久文档上下文，用来理解组件用法、主题能力和 API 设计。

推荐起点：

- `/llms.txt` 适合通用指导
- `/llms-full.txt` 适合更完整的 API 和内容覆盖
- 单个组件 Markdown 路由适合只查一个组件

### GitHub Copilot、ChatGPT、Claude 等其它工具

任何支持读取 URL 或粘贴 Markdown 内容的工具，都可以利用这些文件。

示例：

- Follow VeanUI docs from https://veanui.com/llms.txt
- Use the Button page from https://veanui.com/components/button.md
- Use the full VeanUI bundle from https://veanui.com/llms-full.txt

## 实际建议

1. 先从 `/llms.txt` 开始做整体理解。
2. 再补充一两个与你当前任务直接相关的单页 Markdown 路由。
3. 只有在小文件不够用时，再切到 `/llms-full.txt`。

## 相关页面

- [快速开始](/overview/quick-start)
- [介绍](/overview/introduction)
- [主题](/overview/theming)
- [组件](/components)
