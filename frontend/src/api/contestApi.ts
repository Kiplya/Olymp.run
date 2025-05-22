import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  ContestCreationRequest,
  ContestCreationResponse,
  ContestGetInfoRequest,
  ContestGetInfoResponse,
  ContestGetManyByParticipantResponse,
  SolutionSubmitRequest,
  SolutionSubmitResponse,
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

    contestSolutionSubmit: builder.mutation<SolutionSubmitResponse, SolutionSubmitRequest>({
      query: (credentials) => ({
        url: '/contest/solutionSubmit',
        method: 'POST',
        body: credentials,
        params: {
          contestId: credentials.contestId,
          taskId: credentials.taskId,
        },
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

export const {
  useContestCreateMutation,
  useContestGetManyByParticipantQuery,
  useContestGetInfoQuery,
  useContestSolutionSubmitMutation,
} = contestApi
