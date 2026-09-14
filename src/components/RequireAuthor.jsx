import { useAuth } from '../context/AuthContext.jsx'

/**
 * Gate for AUTHOR/ADMIN-only routes (/posts/new, /posts/:id/edit, /categories).
 *
 * This is a UX convenience only, not a security boundary — the gateway/API
 * enforces the real authorization. An anonymous or READER user just sees a
 * "not authorized" message instead of the form.
 */
export default function RequireAuthor({ children }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="error-box">
        You must be logged in as an author or admin to view this page.
      </div>
    )
  }

  if (user.role !== 'AUTHOR' && user.role !== 'ADMIN') {
    return <div className="error-box">Not authorized: this page requires the AUTHOR or ADMIN role.</div>
  }

  return children
}
