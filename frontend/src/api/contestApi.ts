import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  ContestCreationRequest,
  ContestCreationResponse,
  ContestGetInfoRequest,
  ContestGetInfoResponse,
  ContestGetManyByParticipantResponse,
} from '@shared/apiTypes'

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

    contestGetManyByParticipant: builder.query<ContestGetManyByParticipantResponse, void>({
      query: () => ({
        url: '/auth/contestGetManyByParticipant',
      }),
    }),

    contestGetInfo: builder.query<ContestGetInfoResponse, ContestGetInfoRequest>({
      query: ({ contestId }) => ({
        url: '/contest/getInfo',
        params: {
          contestId,
        },
      }),
    }),
  }),
})

export const { useContestCreateMutation, useContestGetManyByParticipantQuery, useContestGetInfoQuery } = contestApi
