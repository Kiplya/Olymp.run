import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext({
  isAuth: false,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false)

  const login = useCallback(() => {
    setIsAuth(true)
  }, [])
  const logout = useCallback(() => {
    setIsAuth(false)
  }, [])

  const value = useMemo(
    () => ({
      isAuth,
      login,
      logout,
    }),
    [isAuth, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
