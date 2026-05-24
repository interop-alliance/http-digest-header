/*!
 * Copyright (c) 2021-2025 Digital Bazaar, Inc. All rights reserved.
 */
import * as Crypto from 'expo-crypto';

export async function sha256(data) {
  return new Uint8Array(
    await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data));
}
