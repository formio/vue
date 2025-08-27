import { vi, beforeEach, afterEach } from 'vitest'
/**
 * Test-only mock for @ungap/structured-clone.
 *
 * Why:
 * - Vue Test Utils + Vitest wrap values in Vue reactive proxies.
 *  @ungap/structured-clone process it with errors (problem related only to tests)
 * - Using a lightweight clone here avoids those issues and speeds up tests.
 *
 */
vi.mock('@ungap/structured-clone', () => ({
  default: vi.fn((obj) => JSON.parse(JSON.stringify(obj)))
}))

// Global error handler to suppress Vue warnings in tests
const originalConsoleWarn = console.warn

beforeEach(() => {
  console.warn = vi.fn()
})

afterEach(() => {
  console.warn = originalConsoleWarn
  vi.clearAllMocks()
})
