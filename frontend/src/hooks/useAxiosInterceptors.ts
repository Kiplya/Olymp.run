import { ResponseStatus } from '@shared/apiTypes'
import { AxiosError } from 'axios'

import { useEffect } from 'react'

import { apiInstance } from '../api/api'
import { useAuth } from '../context/AuthContext'

const useAxiosIntereceptors = () => {
  const { isAuth, logout } = useAuth()

  useEffect(() => {
    const interceptor = apiInstance.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        const status = error?.status
        const message = error?.message
        let body = error?.response?.data
        if (body) {
          body = JSON.stringify(body)
        }

        if (status === ResponseStatus.UNAUTHORIZED && isAuth) {
          logout()
        } else if (status === ResponseStatus.UNAUTHORIZED && !isAuth) {
          return Promise.resolve({ status: ResponseStatus.NO_CONTENT, body: {} })
        }

        return Promise.reject({ status, message, body })
      },
    )

    return () => {
      apiInstance.interceptors.response.eject(interceptor)
    }
  }, [isAuth, logout])
}

export default useAxiosIntereceptors
