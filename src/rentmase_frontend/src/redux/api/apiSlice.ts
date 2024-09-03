
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '../../constants'


export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL,
    credentials: 'include'
   }),
  tagTypes: ['Services'],
  endpoints: (builder) => ({}),
})
