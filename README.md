# HTTP Digest Header Library _(@interop/http-digest-header)_

[![Node.js CI](https://github.com/interop-alliance/http-digest-header/workflows/CI/badge.svg)](https://github.com/interop-alliance/http-digest-header/actions?query=workflow%3A%22CI%22)
[![CI](https://github.com/interop-alliance/http-digest-header/actions/workflows/ci.yml/badge.svg)](https://github.com/interop-alliance/http-digest-header/actions/workflows/ci.yml)

> JavaScript library (Node.js, browser and React Native) for creating and
> verifying Digest headers for HTTP Signatures

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

**FORKED FROM**: https://github.com/digitalbazaar/http-digest-header to provide
support for React Native and add TypeScript types.

- For React Native use: the `expo-crypto` peer dependency is required (see
  [Usage in React Native](#usage-in-react-native)).

Originally, this library was implemented based on the `Digest` header as
mentioned in
**[HTTP Signatures IETF draft](https://tools.ietf.org/html/draft-cavage-http-signatures)**.

Since then, the `Digest` header got its own standards-track spec, at
https://tools.ietf.org/html/draft-ietf-httpbis-digest-headers.

This is a library specifically for creating and verifying the `Digest:` header,
for use with HTTP Signatures and similar mechanisms.

It's intended to be isomorphic (for use both in the browser and server-side,
with Node.js).

## Install

- Browsers and Node.js 24+ supported.
- [Web Crypto API][] required. Older browsers and Node.js 14 must use a
  polyfill.

To install from `npm`:

```
npm install @interop/http-digest-header
```

To install locally (for development):

```
git clone https://github.com/interop-alliance/http-digest-header.git
cd http-digest-header
pnpm install
```

## Usage

```js
import * as httpDigest from '@interop/http-digest-header'

const data = `{"hello": "world"}`

const headerValue = await httpDigest.createHeaderValue({
  data,
  algorithm: 'sha256',
  useMultihash: false
})
// -> SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=

const dataToVerify1 = `{"hello": "world"}`
const dataToVerify2 = `{"hello": "planet earth"}`

const verifyResult = await httpDigest.verifyHeaderValue({
  data: dataToVerify1,
  headerValue
})
// -> { verified: true }
const verifyResult = await httpDigest.verifyHeaderValue({
  data: dataToVerify2,
  headerValue
})
// -> { verified: false }
```

### Usage in React Native

In React Native, this library's `react-native` export resolves the digest
implementation to one backed by
[`expo-crypto`](https://docs.expo.dev/versions/latest/sdk/crypto/) (it imports
`expo-crypto` directly -- no `crypto.subtle` polyfill or global shim required).

`expo-crypto` is declared as an (optional) peer dependency, so just make sure it
is installed in your app:

```
npx expo install expo-crypto
```

If `expo-crypto` is missing, `createHeaderValue` / `verifyHeaderValue` will fail
to resolve their digest dependency at bundle time.

## Contribute

Please follow the existing code style.

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from Digital
Bazaar: support@digitalbazaar.com

## License

[BSD-3-Clause](LICENSE.md) © 2019-2025 Digital Bazaar

[Web Crypto API]:
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
