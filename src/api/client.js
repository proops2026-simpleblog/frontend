const BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Thin fetch wrapper around the gateway.
 *
 * - Attaches `Authorization: Bearer <token>` when a token is passed in.
 * - On a non-2xx response, throws an ApiError carrying the gateway's
 *   standardized { error, message, statusCode, timestamp } payload so
 *   callers can render `message` directly without a client-side
 *   error-code mapping table.
 */
export class ApiError extends Error {
  constructor(payload, status) {
    super(payload?.message || 'Request failed')
    this.name = 'ApiError'
    this.statusCode = payload?.statusCode ?? status
    this.error = payload?.error
    this.timestamp = payload?.timestamp
    this.payload = payload
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (networkErr) {
    throw new ApiError(
      {
        error: 'NetworkError',
        message: 'Could not reach the server. Please check your connection and try again.',
        statusCode: 0,
      },
      0,
    )
  }

  if (response.status === 204) {
    return null
  }

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    throw new ApiError(data, response.status)
  }

  return data
}

export const api = {
  get: (path, token) => request(path, { method: 'GET', token }),
  post: (path, body, token) => request(path, { method: 'POST', body, token }),
  patch: (path, body, token) => request(path, { method: 'PATCH', body, token }),
  delete: (path, token) => request(path, { method: 'DELETE', token }),
}
