/**
 * Creates a value suitable for the HTTP `Digest` header.
 *
 * @param {object} options - The options to use.
 * @param {string|object|Blob|Uint8Array} [options.data] - The data to be
 *   hashed (a request or response body).
 * @param {string} [options.algorithm] - Hash algorithm to use.
 *   (e.g. 'sha256').
 * @param {boolean} [options.useMultihash=true] - Whether to encode via
 *   multihash; if false, the hash will be base64-encoded (non-url).
 *
 * @returns {Promise<string>} Resolves to `Digest` header value.
 */
export function createHeaderValue({ data, algorithm, useMultihash }?: {
    data?: string | object | Blob | Uint8Array;
    algorithm?: string;
    useMultihash?: boolean;
}): Promise<string>;
/**
 * Verifies the HTTP `Digest` header value against the given HTTP body `data`.
 *
 * @param {object} options - The options to use.
 * @param {string|object|Blob|Uint8Array} options.data - The data to be
 *   verified (a request or response body).
 * @param {string} options.headerValue - The digest header value to verify
 *   the data against.
 *
 * @returns {Promise<{verified: boolean, error?: Error}>}
 */
export function verifyHeaderValue({ data, headerValue }: {
    data: string | object | Blob | Uint8Array;
    headerValue: string;
}): Promise<{
    verified: boolean;
    error?: Error;
}>;
