import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Vitest sets this; the browser dev server (Playwright via `pnpm run dev`)
// does not. In the browser, swap the Node `util` implementation (which uses
// `Buffer`) for the browser one, mirroring the package.json `browser` field,
// so the smoke test exercises the real browser code path. Node tests keep the
// Node implementation.
const isVitest = !!process.env.VITEST

export default defineConfig({
  resolve: isVitest
    ? {}
    : {
        alias: {
          './util.js': fileURLToPath(
            new URL('./src/util-browser.ts', import.meta.url)
          )
        }
      },
  test: {
    include: ['test/node/**/*.test.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts']
    }
  }
})
