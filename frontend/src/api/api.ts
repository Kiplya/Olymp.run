import axios from 'axios'

export const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

export const api = {
  get: async <T>(url: string) => {
    const res = await apiInstance.get<T>(url)
    return { status: res.status, body: res.data }
  },

  post: async <TResponse, TBody>(url: string, body: TBody) => {
    const res = await apiInstance.post<TResponse>(url, body)
    return { status: res.status, body: res.data }
  },

  put: async <TResponse, TBody>(url: string, body: TBody) => {
    const res = await apiInstance.put<TResponse>(url, body)
    return { status: res.status, body: res.data }
  },

  delete: async <T>(url: string) => {
    const res = await apiInstance.delete<T>(url)
    return { status: res.status, body: res.data }
  },
}
