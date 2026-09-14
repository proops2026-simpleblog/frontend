import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, ApiError } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function PostForm({ mode }) {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(mode === 'edit')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (mode !== 'edit') return
    setLoading(true)
    api
      .get(`/posts/${id}`)
      .then((post) => {
        setTitle(post.title)
        setBody(post.body)
        setCategoryId(post.categoryId ?? '')
        setStatus(post.status ?? '')
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load post.'))
      .finally(() => setLoading(false))
  }, [mode, id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.')
      return
    }

    const payload = {
      title,
      body,
      ...(categoryId ? { categoryId } : {}),
      ...(mode === 'edit' && status ? { status } : {}),
    }

    setSubmitting(true)
    try {
      const result =
        mode === 'create'
          ? await api.post('/posts', payload, token)
          : await api.patch(`/posts/${id}`, payload, token)
      navigate(`/posts/${result.id}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save post.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2>{mode === 'create' ? 'New Post' : 'Edit Post'}</h2>
      {error && <div className="error-box">{error}</div>}
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Title
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Body
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>
        <label>
          Category
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {mode === 'edit' && (
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
          </label>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : mode === 'create' ? 'Create post' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
