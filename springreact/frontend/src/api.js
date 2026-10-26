// Relative URLs work in both modes:
//  - dev: Vite proxies /api to http://localhost:8080
//  - prod: React and the API are served by the same Spring Boot app
// If you deploy the frontend separately, set VITE_API_URL (e.g. https://api.example.com).
const BASE = import.meta.env.VITE_API_URL ?? ''

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body.error) message = body.error
    } catch {
      /* response had no JSON body */
    }
    throw new Error(message)
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  hello: () => request('/api/hello'),
  listTodos: () => request('/api/todos'),
  addTodo: (title) =>
    request('/api/todos', { method: 'POST', body: JSON.stringify({ title }) }),
  toggleTodo: (id) => request(`/api/todos/${id}/toggle`, { method: 'PUT' }),
  deleteTodo: (id) => request(`/api/todos/${id}`, { method: 'DELETE' }),
}
