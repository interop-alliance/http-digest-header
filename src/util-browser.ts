/*!
 * Copyright (c) 2021-2025 Digital Bazaar, Inc. All rights reserved.
 */

// `Uint8Array.prototype.toBase64` is a newer (TC39) method not yet in the
// ES2022 lib types; treat it as optionally present and fall back when absent.
type Base64Capable = Uint8Array & {
  toBase64?: (options?: {
    alphabet?: 'base64url'
    omitPadding?: boolean
  }) => string
}

export function base64Encode(bytes: Uint8Array): string {
  const maybe = bytes as Base64Capable
  if (maybe.toBase64) {
    return maybe.toBase64()
  }
  return btoa(Array.from(bytes, b => String.fromCodePoint(b)).join(''))
}

export function base64urlEncode(bytes: Uint8Array): string {
  const maybe = bytes as Base64Capable
  if (maybe.toBase64) {
    return maybe.toBase64({ alphabet: 'base64url', omitPadding: true })
  }
  return base64Encode(bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replaceAll('=', '')
}
