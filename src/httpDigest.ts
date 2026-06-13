/*!
 * Copyright (c) 2019-2025 Digital Bazaar, Inc. All rights reserved.
 */
import { base64Encode, base64urlEncode } from './util.js'
import { sha256 } from './digest.js'

type DigestData = string | object | Blob | Uint8Array

/**
 * Creates a value suitable for the HTTP `Digest` header.
 *
 * @param options - The options to use.
 * @param options.data - The data to be hashed (a request or response body).
 * @param options.algorithm - Hash algorithm to use (e.g. 'sha256').
 * @param options.useMultihash - Whether to encode via multihash; if false, the
 *   hash will be base64-encoded (non-url).
 *
 * @returns Resolves to `Digest` header value.
 */
export async function createHeaderValue({
  data,
  algorithm = 'sha256',
  useMultihash = true
}: {
  data?: DigestData
  algorithm?: string
  useMultihash?: boolean
} = {}): Promise<string> {
  const { key, encodedDigest } = await _createHeaderValueComponents({
    data,
    algorithm,
    useMultihash
  })
  return `${key}=${encodedDigest}`
}

/**
 * Verifies the HTTP `Digest` header value against the given HTTP body `data`.
 *
 * @param options - The options to use.
 * @param options.data - The data to be verified (a request or response body).
 * @param options.headerValue - The digest header value to verify the data
 *   against.
 *
 * @returns Resolves to the verification result.
 */
export async function verifyHeaderValue({
  data,
  headerValue
}: {
  data: DigestData
  headerValue: string
}): Promise<{ verified: boolean; error?: Error }> {
  try {
    const { key, algorithm, encodedDigest } = _parseHeaderValue(headerValue)
    const { encodedDigest: expectedDigest } =
      await _createHeaderValueComponents({
        data,
        algorithm,
        useMultihash: key === 'mh'
      })
    return { verified: encodedDigest === expectedDigest }
  } catch (error) {
    return { verified: false, error: error as Error }
  }
}

async function _createHeaderValueComponents({
  data,
  algorithm = 'sha256',
  useMultihash = true
}: {
  data?: DigestData
  algorithm?: string
  useMultihash?: boolean
}): Promise<{ key: string; encodedDigest: string }> {
  if (algorithm !== 'sha256') {
    throw new Error(`Algorithm "${algorithm}" is not supported.`)
  }
  const digest = await _getDigest({ data, algorithm })
  if (useMultihash) {
    return { key: 'mh', encodedDigest: _createMultihash({ digest }) }
  }
  return { key: 'SHA-256', encodedDigest: base64Encode(digest) }
}

function _createMultihash({ digest }: { digest: Uint8Array }): string {
  // format as multihash digest
  // sha2-256: 0x12, length: 32 (0x20), digest value
  const mh = new Uint8Array(34)
  mh[0] = 0x12
  mh[1] = 0x20
  mh.set(digest, 2)
  // encode multihash using multibase, base64url: `u`
  return `u${base64urlEncode(mh)}`
}

function _parseHeaderValue(headerValue: string): {
  key: string
  algorithm: string
  encodedDigest?: string
} {
  // `String.prototype.split` always yields at least the part before the first
  // `=` at index 0, so `key` is always a string; `digestValue` may be absent.
  const [key = '', digestValue] = headerValue.split(/=(.+)/)

  let encodedDigest: string | undefined
  let algorithm: string
  if (key === 'mh') {
    if (digestValue === undefined) {
      throw new Error(`Only base64url-encoded, sha-256 multihash is supported.`)
    }
    encodedDigest = digestValue

    // if `encodedDigest` starts with `uEi`, then it is a base64url-encoded
    // sha-256 multihash
    if (encodedDigest.startsWith('uEi')) {
      algorithm = 'sha256'
    } else {
      throw new Error(`Only base64url-encoded, sha-256 multihash is supported.`)
    }
  } else {
    // per RFC 9651, the digest value could be a structured field value,
    // expressed as a base64-encoded byte array wrapped in colons
    encodedDigest = digestValue?.replace(/^:(.*):$/, '$1')

    algorithm = key.replace('-', '').toLowerCase()
    if (algorithm !== 'sha256') {
      throw new Error(`Algorithm "${algorithm}" is not supported.`)
    }
  }
  return { key, algorithm, encodedDigest }
}

async function _getDigest({
  data,
  algorithm
}: {
  data?: DigestData
  algorithm: string
}): Promise<Uint8Array> {
  const normalized = await _normalizeData(data)
  if (algorithm === 'sha256') {
    return sha256(normalized)
  }
  throw new Error(`Algorithm "${algorithm}" is not unsupported.`)
}

// normalize all inputs to a `Uint8Array` for hashing
async function _normalizeData(
  data?: DigestData
): Promise<Uint8Array | ArrayBuffer> {
  if (data instanceof Uint8Array) {
    return data
  }
  if (data instanceof Blob) {
    // `Blob.bytes()` is only available in node.js 22+;
    // fallback to `Blob.arrayBuffer()`
    return data.bytes?.() ?? data.arrayBuffer()
  }
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  return new TextEncoder().encode(str)
}
