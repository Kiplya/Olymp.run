import { FC, ReactNode } from 'react'

import Loader from './Loader'

import { useCheckAuthQuery } from '../api/userApi'

interface ApiControllerProps {
  children: ReactNode
}

const ApiController: FC<ApiControllerProps> = ({ children }) => {
  const { isLoading } = useCheckAuthQuery()
  return <>{isLoading ? <Loader /> : children}</>
}

export default ApiController
