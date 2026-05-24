/*!
 * Copyright (c) 2021-2025 Digital Bazaar, Inc. All rights reserved.
 */
const {crypto} = globalThis;

export async function sha256(data) {
  return new Uint8Array(await crypto.subtle.digest({name: 'SHA-256'}, data));
}
