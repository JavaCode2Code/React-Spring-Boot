import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Todos from './pages/Todos.jsx'

export default function App() {
  return (
    <div className="container">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/todos">Todos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </div>
  )
}
