import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { expectNoAccessibilityViolations } from '../../test/accessibility'
import { App } from './App'

describe('App', () => {
  it('greets the user through a labelled form and announces the result', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('textbox', { name: 'Your name' }), 'Ada')
    await user.click(screen.getByRole('button', { name: 'Greet' }))

    expect(screen.getByRole('status')).toHaveTextContent('Hello, Ada.')
  })

  it('offers keyboard users a skip link as the first focusable element', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.tab()

    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus()
  })

  it('has no detectable accessibility violations before and after interaction', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await expectNoAccessibilityViolations(container)

    await user.type(screen.getByRole('textbox', { name: 'Your name' }), 'Ada')
    await user.click(screen.getByRole('button', { name: 'Greet' }))

    await expectNoAccessibilityViolations(container)
  })
})
