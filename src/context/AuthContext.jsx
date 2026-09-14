import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const AuthContext = createContext(null)

/**
 * Auth state is kept ONLY in memory (React state), never in localStorage or
 * sessionStorage. This is a deliberate security trade-off documented in
 * IRD-004: a page refresh loses the session because there is nowhere
 * persistent (and thus XSS-exfiltratable) that the JWT is written to.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const login = useCallback(({ token: newToken, user: newUser }) => {
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
