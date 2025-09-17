import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`, // POST /api/users/auth
        method: 'POST',
        body: data,               // { email, password }
      }),
    }),
  }),
});
export const { useLoginMutation } = usersApiSlice;
