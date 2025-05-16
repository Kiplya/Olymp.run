import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TaskGetRequest, TaskGetResponse } from '@shared/apiTypes'

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),

  endpoints: (builder) => ({
    taskCreate: builder.mutation<void, FormData>({
      query: (credentials) => ({
        url: '/admin/taskCreate',
        method: 'POST',
        body: credentials,
      }),
    }),

    taskGetByDiffAndTitle: builder.query<TaskGetResponse[], TaskGetRequest>({
      query: ({ title, difficulty, limit }) => ({
        url: '/admin/taskGetByDiffAndTitle',
        params: {
          title,
          difficulty,
          limit,
        },
      }),
    }),

    taskGetByTitle: builder.query<TaskGetResponse[], TaskGetRequest>({
      query: ({ title, limit }) => ({
        url: '/admin/taskGetByTitle',
        params: {
          title,
          limit,
        },
      }),
    }),
  }),
})

export const { useTaskCreateMutation, useTaskGetByDiffAndTitleQuery, useTaskGetByTitleQuery } = taskApi
