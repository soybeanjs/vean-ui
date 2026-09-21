---
head:
  title: InputOtp
  description: 'A one-time-password (OTP / verification code) input built around a real native input. It keeps the robust selection, paste, and mobile autofill behavior of vue-input-otp while exposing a default VeanUI presentation and a fully custom scoped slot. Use it for SMS codes, email verification codes, two-factor authentication, or any fixed-length code entry.'
---

# InputOtp

## Overview

A one-time-password (OTP / verification code) input built around a real native input. It keeps the robust selection, paste, and mobile autofill behavior of vue-input-otp while exposing a default VeanUI presentation and a fully custom scoped slot. Use it for SMS codes, email verification codes, two-factor authentication, or any fixed-length code entry.

## Usage

<UsageCode component="input-otp" />

## Features

- 📏 6 sizes: xs, sm, md, lg, xl, 2xl
- 🔤 Real native input overlay — native selection, paste, and mobile autofill / password-manager behavior
- 📐 `align` control: start / center / end
- 🎨 Fully custom `default` slot per character, with placeholder chars and fake caret
- 🔢 `maxlength` clamping plus `pattern` validation (double-layer `beforeinput` + rollback)
- 📋 `pasteTransformer` for normalizing pasted input, and a `complete` event when full
- 🔐 Password-manager badge detection (disable via `pushPasswordManagerStrategy`)
- ♿ Full accessibility support — `aria-label`, `inputmode`, axe-clean

## Demos

<PlaygroundGallery component="input-otp" />

## API

<ComponentApi component="input-otp" />

## Notes

### Architecture and benchmark differences

VeanUI splits input-otp into an Aria layer (`@vean/aria/input-otp`) that owns the transparent input overlay, selection mirroring, and validation, and a styled layer (`@vean/ui`) that owns variants and UnoCSS classes. The Aria `InputOtpCompact` composes `InputOtpRoot` / `InputOtpPositioner` / `InputOtpInput`. This is a port of the vue-input-otp approach used by reka-ui and shadcn, with Vean's size variants and `align` states as differentiators.

| Capability                      | VeanUI | reka-ui `InputOtp` | shadcn `InputOTP` | Element Plus |
| :------------------------------ | :----: | :----------------: | :---------------: | :----------: |
| Aria/styled split               |   ✅   |         —          |         —         |      —       |
| Controlled / uncontrolled       |   ✅   |         ✅         |        ✅         |      —       |
| `maxlength` / `pattern`         |   ✅   |         ✅         |        ✅         |      —       |
| Real input transparent overlay  |   ✅   |         ✅         |        ✅         |      —       |
| Selection mirroring             |   ✅   |         ✅         |        ✅         |      —       |
| Paste transformer               |   ✅   |         ✅         |        ✅         |      —       |
| Password-manager badge handling |   ✅   |         ✅         |        ✅         |      —       |
| iOS autofill                    |   ✅   |         ✅         |        ✅         |      —       |
| `complete` event                |   ✅   |         ✅         |        ✅         |      —       |
| Size variants (xs…2xl)          |   ✅   |         —          |         —         |      —       |
| `align` states                  |   ✅   |         ✅         |        ✅         |      —       |
| Custom visual slot (fake caret) |   ✅   |         ✅         |        ✅         |      —       |

### Cautions

- `maxlength` is required — it drives the number of rendered characters.
- The `aria-label` prop is declared as `ariaLabel` (camelCase); both kebab-case attributes and camelCase props work, and it falls back to the localized default `One-time password`.
- Locale-aware default `aria-label` and `contextmenu` handling are tracked as enhancement backlog.

## FAQ

### How do I customize the character cells?

Use the `default` slot. Each character receives `char`, `placeholderChar`, `isActive`, and `hasFakeCaret` so you can render boxes, separators, or custom carets.

### How do I trigger an action when the code is complete?

Listen for the `complete` event, emitted once all cells are filled.

### How do I restrict what characters can be entered?

Pass `maxlength` for length and `pattern` for a per-character validation regex. Invalid input is rejected by `beforeinput` interception and rolled back on `input`.

### How do I make the OTP usable in a native form?

Pass `name` — the transparent input carries the value and participates in native form submission and autofill.
