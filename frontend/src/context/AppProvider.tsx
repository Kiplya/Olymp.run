import { ReactNode } from 'react'

import { AuthProvider } from './AuthContext'

const AppProvider = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

export default AppProvider
