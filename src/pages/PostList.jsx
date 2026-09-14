import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../api/client.js'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => {
      // Category filter is a nicety; ignore failures here silently.
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const query = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : ''
    api
      .get(`/posts${query}`)
      .then(setPosts)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load posts.'))
      .finally(() => setLoading(false))
  }, [categoryId])

  return (
    <div>
      <h2>Posts</h2>

      <label>
        Filter by category:{' '}
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>Loading...</p>}

      {!loading && posts.length === 0 && !error && <p className="muted">No posts yet.</p>}

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <h3>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </h3>
          <p className="muted">Published: {post.publishedAt ?? 'n/a'}</p>
        </div>
      ))}
    </div>
  )
}
