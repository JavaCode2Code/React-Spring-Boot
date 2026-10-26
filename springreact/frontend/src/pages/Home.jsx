import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Home() {
  const [message, setMessage] = useState('Loading…')

  useEffect(() => {
    api
      .hello()
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage(`Could not reach the API: ${err.message}`))
  }, [])

  return (
    <section>
      <h1>Spring Boot + React</h1>
      <p className="message">{message}</p>
    </section>
  )
}
