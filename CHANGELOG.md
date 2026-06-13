# @interop/http-digest-header Changelog

## 3.0.0 - 2026-06-13

### Changed

- **Infrastructure only (no API or behavior changes).** Migrated the toolchain
  to the `isomorphic-lib-template`: pnpm, source converted to TypeScript under
  `src/` (built to `dist/` via `tsc`), ESLint flat config, Prettier 3, Vitest
  (Node) + Playwright (browser), and template CI/publish workflows. Node engine
  floor raised to `>=24`. The per-platform module swapping (`browser` /
  `react-native` map fields) is preserved.

## 2.3.2 - 2026-05-24

### Added

- Add TypeScript types to export, and React Native support.

## 2.3.0 - 2025-10-09

### Added

- Support parsing a digest from structured field value, i.e., expressed as a
  base64-encoded byte array that is wrapped in colons; see:
  https://datatracker.ietf.org/doc/html/rfc9651#name-byte-sequences.

## 2.2.1 - 2025-10-08

### Fixed

- Prevent making an unnecessary copy when encoding bytes.

## 2.2.0 - 2025-10-08

### Changed

- Eliminate dependencies in favor of native platform support for simple (and
  rarely used) polyfill fallbacks which may be removed in future versions.
  Dependencies removed:
  - `base64url-universal`
  - `js-base64`.

## 2.1.0 - 2025-10-07

### Added

- Support passing `Blob` or `Uint8Array` as the request/response body `data`
  parameter when creating or verifying a header value.

### Changed

- Recommend node>=20 instead of node>=14.
- Remove now obsolete webcrypto platform differentiation/browser alias code.

## 2.0.0 - 2022-06-06

### Changed

- **BREAKING**: Convert to module (ESM).
- **BREAKING**: Require Node.js >=14.
- **BREAKING**: Use `globalThis` for browser crypto and streams.
- **BREAKING**: Require Web Crypto API. Older browsers and Node.js 14 users need
  to install an appropriate polyfill.
- Update dependencies.
- Lint module.

## 1.0.1 - 2021-06-02

### Fixed

- Enable karma tests.
- Switch from `universal-base64` to `js-base64` which handles Uint8Arrays
  properly.

## 1.0.0 - 2020-12-04

### Added

- Added core files.
- Added `createHeaderValue` and `verifyHeaderValue` functions.
- Added tests.
