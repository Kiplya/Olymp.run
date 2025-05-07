import { FC, ReactNode } from 'react'

import Loader from './Loader'

import useAxiosIntereceptors from '../hooks/useAxiosInterceptors'
import useCheckAuth from '../hooks/useCheckAuth'

interface ApiControllerProps {
  children: ReactNode
}

const ApiController: FC<ApiControllerProps> = ({ children }) => {
  useAxiosIntereceptors()
  const { isLoading } = useCheckAuth()
  return <>{isLoading ? <Loader /> : children}</>
}

export default ApiController
