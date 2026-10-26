import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Todos() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const load = () =>
    api
      .listTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [])

  const run = async (action) => {
    setError('')
    try {
      await action()
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    run(async () => {
      await api.addTodo(title)
      setTitle('')
    })
  }

  return (
    <section>
      <h1>Todos</h1>

      <form onSubmit={onSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label className={t.done ? 'done' : ''}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => run(() => api.toggleTodo(t.id))}
              />
              {t.title}
            </label>
            <button
              className="link"
              onClick={() => run(() => api.deleteTodo(t.id))}
              aria-label={`Delete ${t.title}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
