
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    authenticate: builder.mutation({
      query: () => ({
        url: "/auth/get-access-token",
        method: "POST",
      }),
    }),
    logout : builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    topUpAirtime : builder.mutation({
      query: (data) => ({
        url: "/topup-airtime",
        method: "POST",
        body: data,
      }),
    }),
    getOperators: builder.query({
      query: () => "/get-operators"
    }),
    getCountryOperaters: builder.query({
      query: ({ countryCode }) => ({
        url: `/country-operators`, 
        params: { countryCode}, 
      }),
    }),
  }),
});

export const {
  useAuthenticateMutation,
  useLogoutMutation,
  useTopUpAirtimeMutation,
  useGetOperatorsQuery,
  useGetCountryOperatersQuery,
} = usersApiSlice;
