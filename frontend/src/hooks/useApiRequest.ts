import { useState, useCallback } from 'react'

import { api } from '../api/api'

type HttpMethod = 'get' | 'post' | 'put' | 'delete'

type ApiRequestReturn<TResponse> = {
  data: TResponse | null
  isLoading: boolean
  error: string | null
  status: number | null
  request: () => Promise<void>
}

type ApiOptions<TResponse> = {
  onSuccess?: (data?: TResponse) => void
  onError?: (error: any) => void
  onFinally?: () => void
}

const useApiRequest = <TResponse, TBody = unknown>(
  config: { method: HttpMethod; apiUrl: string },
  body?: TBody,
  options?: ApiOptions<TResponse>,
): ApiRequestReturn<TResponse> => {
  const [data, setData] = useState<TResponse | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [status, setStatus] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { method, apiUrl } = config

  const request = useCallback(async () => {
    setData(null)
    setLoading(true)
    setError(null)
    setStatus(null)
    let response

    try {
      if (method === 'get' || method === 'delete') {
        response = await api[method]<TResponse>(apiUrl)
      } else {
        if (body == null) {
          throw new Error('API request body is null')
        }
        response = await api[method]<TResponse, TBody>(apiUrl, body)
      }

      setData(response.body)
      setStatus(response.status)

      options?.onSuccess?.(response.body)
    } catch (err: any) {
      setError(err?.message)
      setStatus(err?.status)

      console.warn(`${err?.message}\n${err?.body}`)
      options?.onError?.(err)
    } finally {
      setLoading(false)
      options?.onFinally?.()
    }
  }, [method, apiUrl, body, options])

  return { data, isLoading, status, error, request }
}

export default useApiRequest
