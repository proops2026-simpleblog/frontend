import { useState } from 'react'
import { api, ApiError } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function CategoryForm() {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name.trim()) {
      setError('Category name is required.')
      return
    }

    setSubmitting(true)
    try {
      const category = await api.post('/categories', { name }, token)
      setSuccess(`Category "${category.name}" created.`)
      setName('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create category.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>New Category</h2>
      {error && <div className="error-box">{error}</div>}
      {success && <p className="muted">{success}</p>}
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create category'}
        </button>
      </form>
    </div>
  )
}
