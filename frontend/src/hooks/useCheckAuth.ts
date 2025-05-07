import { Endpoints, ResponseStatus } from '@shared/apiTypes'
import { useEffect } from 'react'

import useApiRequest from './useApiRequest'

import { useAuth } from '../context/AuthContext'

const useCheckAuth = () => {
  const { isLoading, status, request } = useApiRequest(Endpoints.AUTH)
  const { login } = useAuth()
  useEffect(() => {
    request()
  }, [request])

  useEffect(() => {
    if (status === ResponseStatus.SUCCESS) {
      login()
    }
  }, [status, login])

  return { isLoading }
}

export default useCheckAuth
