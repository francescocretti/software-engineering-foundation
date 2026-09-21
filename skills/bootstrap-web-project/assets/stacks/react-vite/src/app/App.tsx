import { useId, useState, type ReactElement, type SubmitEvent } from 'react'

export const App = (): ReactElement => {
  const nameId = useId()
  const [greeting, setGreeting] = useState('')

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const name = new FormData(event.currentTarget).get('name')
    setGreeting(typeof name === 'string' && name.trim() !== '' ? `Hello, ${name.trim()}.` : '')
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header>
        <p className="brand">Application</p>
      </header>
      <main id="main-content" tabIndex={-1}>
        <h1>Welcome</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor={nameId}>Your name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" required />
          <button type="submit">Greet</button>
        </form>
        <p role="status">{greeting}</p>
      </main>
    </>
  )
}
