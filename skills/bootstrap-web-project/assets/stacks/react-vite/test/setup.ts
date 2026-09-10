import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Testing Library cannot register automatic cleanup while `globals` is off.
afterEach(() => {
  cleanup()
})
