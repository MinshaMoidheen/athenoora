import { BASE_URL } from '@/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Party', 'CourseClass', 'Section'],
  endpoints: () => ({}),
})

export type { BaseQueryFn } from '@reduxjs/toolkit/query'


