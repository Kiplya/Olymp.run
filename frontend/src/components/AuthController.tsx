import { FC, ReactNode } from 'react'

import Loader from './Loader'

import { useCheckAdminQuery, useCheckAuthQuery } from '../api/userApi'

interface AuthControllerProps {
  children: ReactNode
}

const AuthController: FC<AuthControllerProps> = ({ children }) => {
  const { isLoading: isAuthLoading } = useCheckAuthQuery()
  const { isLoading: isAdminLoading } = useCheckAdminQuery()

  return <>{isAuthLoading || isAdminLoading ? <Loader /> : children}</>
}

export default AuthController
