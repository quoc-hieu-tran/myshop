import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //login mutation (POST /api/users/auth)
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`, // POST /api/users/auth
        method: "POST",
        body: data, // { email, password }
      }),
    }),
    // logout mutation (POST /api/users/logout)
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = usersApiSlice;
