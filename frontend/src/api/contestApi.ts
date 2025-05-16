import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ContestCreationRequest, ContestCreationResponse, ContestGetByParticipantResponse } from '@shared/apiTypes'

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),

  endpoints: (builder) => ({
    contestCreate: builder.mutation<ContestCreationResponse, ContestCreationRequest>({
      query: (credentials) => ({
        url: '/admin/contestCreate',
        method: 'POST',
        body: credentials,
      }),
    }),

    contestGetByParticipant: builder.query<ContestGetByParticipantResponse, void>({
      query: () => ({
        url: '/auth/contestGetByParticipant',
      }),
    }),
  }),
})

export const { useContestCreateMutation, useContestGetByParticipantQuery } = contestApi
