import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import RequireAuthor from './components/RequireAuthor.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PostList from './pages/PostList.jsx'
import PostDetail from './pages/PostDetail.jsx'
import PostForm from './pages/PostForm.jsx'
import CategoryForm from './pages/CategoryForm.jsx'

export default function App() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const canAuthor = user?.role === 'AUTHOR' || user?.role === 'ADMIN'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <Link to="/">Posts</Link>
        {canAuthor && <Link to="/posts/new">New Post</Link>}
        {canAuthor && <Link to="/categories">Categories</Link>}
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {isAuthenticated && (
          <span className="muted">
            {user.email} ({user.role})
          </span>
        )}
        {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
      </nav>

      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/new" element={<RequireAuthor><PostForm mode="create" /></RequireAuthor>} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/:id/edit" element={<RequireAuthor><PostForm mode="edit" /></RequireAuthor>} />
        <Route path="/categories" element={<RequireAuthor><CategoryForm /></RequireAuthor>} />
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </div>
  )
}
