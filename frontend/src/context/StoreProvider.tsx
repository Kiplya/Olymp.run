import { ReactNode } from 'react'

import { AuthProvider } from './AuthContext'

const StoreProvider = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

export default StoreProvider
