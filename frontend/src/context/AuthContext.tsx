import { createContext, ReactNode, useContext, useState } from 'react'

interface AuthContextType {
  isAuth: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used via AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false)
  const login = () => setIsAuth(true)
  const logout = () => setIsAuth(false)

  return <AuthContext.Provider value={{ isAuth, login, logout }}>{children}</AuthContext.Provider>
}
