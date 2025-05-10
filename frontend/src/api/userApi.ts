import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LoginRequest } from '@shared/apiTypes'

import { setIsAuth, setIsAdmin } from '../store/reducers/AuthSlice'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    checkAuth: builder.query<void, void>({
      query: () => '/isAuth',

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(setIsAuth(true))
        } catch {
          dispatch(setIsAuth(false))
        }
      },
    }),

    checkAdmin: builder.query<void, void>({
      query: () => '/isAdmin',

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(setIsAdmin(true))
        } catch {
          dispatch(setIsAdmin(false))
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
          dispatch(setIsAuth(true))
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
          dispatch(setIsAuth(false))
          dispatch(setIsAdmin(false))
        } catch {}
      },
    }),
  }),
})

export const { useCheckAuthQuery, useLoginMutation, useLogoutMutation, useCheckAdminQuery } = userApi
