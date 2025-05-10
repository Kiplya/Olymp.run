import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LoginRequest } from '@shared/apiTypes'

import { login, logout } from '../store/reducers/AuthSlice'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    checkAuth: builder.query<void, void>({
      query: () => '/auth',

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(login())
        } catch {
          dispatch(logout())
        }
      },
    }),

    login: builder.mutation<void, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(login())
        } catch {}
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(logout())
        } catch {}
      },
    }),
  }),
})

export const { useCheckAuthQuery, useLoginMutation, useLogoutMutation } = userApi
