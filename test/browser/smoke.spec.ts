/*!
 * Copyright (c) 2025 Digital Bazaar, Inc. All rights reserved.
 */
import { test, expect } from '@playwright/test'

// Smoke test: prove the bundle loads in-browser and a core API path works,
// exercising the browser `util` variant (no Node `Buffer`).
test('createHeaderValue + verifyHeaderValue work in-browser', async ({
  page
}) => {
  await page.goto('/test/index.html')

  const result = await page.evaluate(async () => {
    const { createHeaderValue, verifyHeaderValue } =
      await import('/src/index.ts')
    const data = '{"hello": "world"}'
    const headerValue = await createHeaderValue({
      data,
      algorithm: 'sha256',
      useMultihash: false
    })
    const multihash = await createHeaderValue({ data, useMultihash: true })
    const verified = await verifyHeaderValue({ data, headerValue })
    return { headerValue, multihash, verified }
  })

  expect(result.headerValue).toBe(
    'SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE='
  )
  expect(result.multihash).toBe(
    'mh=uEiBfjwT2o6iSqqu922zyc4lEk3c5YNSjJbEF_uRu70ME8Q'
  )
  expect(result.verified.verified).toBe(true)
})
