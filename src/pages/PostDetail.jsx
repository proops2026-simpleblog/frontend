import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api, ApiError } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function PostDetail() {
  const { id } = useParams()
  const { user, token, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const [commentBody, setCommentBody] = useState('')
  const [commentError, setCommentError] = useState(null)
  const [submittingComment, setSubmittingComment] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    api
      .get(`/posts/${id}`)
      .then(setPost)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load post.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const isOwner = isAuthenticated && post && user?.id === post.authorId
  const isAdmin = user?.role === 'ADMIN'
  const canEdit = isOwner || isAdmin

  async function handleCommentSubmit(e) {
    e.preventDefault()
    setCommentError(null)

    if (!commentBody.trim()) {
      setCommentError('Comment cannot be empty.')
      return
    }

    setSubmittingComment(true)
    try {
      await api.post(`/posts/${id}/comments`, { body: commentBody }, token)
      setCommentBody('')
      load()
    } catch (err) {
      setCommentError(err instanceof ApiError ? err.message : 'Failed to post comment.')
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <div className="error-box">{error}</div>
  if (!post) return null

  return (
    <div>
      <p>
        <Link to="/">&larr; Back to posts</Link>
      </p>
      <h2>{post.title}</h2>
      {canEdit && (
        <p>
          <button onClick={() => navigate(`/posts/${post.id}/edit`)}>Edit post</button>
        </p>
      )}
      <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
      <p className="muted">Status: {post.status}</p>

      <h3>Comments</h3>
      {post.comments?.length ? (
        post.comments.map((c) => (
          <div className="comment" key={c.id}>
            <p>{c.body}</p>
            <p className="muted">{c.createdAt}</p>
          </div>
        ))
      ) : (
        <p className="muted">No comments yet.</p>
      )}

      {isAuthenticated ? (
        <form className="stack" onSubmit={handleCommentSubmit}>
          {commentError && <div className="error-box">{commentError}</div>}
          <label>
            Add a comment
            <textarea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} required />
          </label>
          <button type="submit" disabled={submittingComment}>
            {submittingComment ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      ) : (
        <p className="muted">
          <Link to="/login">Log in</Link> to leave a comment.
        </p>
      )}
    </div>
  )
}
