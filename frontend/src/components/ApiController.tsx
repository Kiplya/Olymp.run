import { FC, ReactNode } from 'react'

import Loader from './Loader'

import { useCheckAdminQuery, useCheckAuthQuery } from '../api/userApi'
import useAppSelector from '../hooks/useAppSelector'

interface ApiControllerProps {
  children: ReactNode
}

const ApiController: FC<ApiControllerProps> = ({ children }) => {
  const isAuth = useAppSelector((state) => state.authSlice.isAuth)
  const { isLoading: isLoadingAuth } = useCheckAuthQuery()
  const { isLoading: isLoadingAdmin } = useCheckAdminQuery(undefined, {
    skip: !isAuth,
  })

  return <>{isLoadingAuth || isLoadingAdmin ? <Loader /> : children}</>
}

export default ApiController
