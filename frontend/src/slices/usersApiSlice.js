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
    // Register (POST /api/users) — body: { name, email, password }
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`, //route for register in the backend (it doesn't have /register)
        method: "POST",
        body: data,
      }),
    }),
    //update user profile info
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`, // e.g., /api/users/profile
        method: "PUT",
        body: data, // { _id, name, email, password? }
      }),
    }),
    getUsers: builder.query({
      query: () => USERS_URL, // GET /api/users
      keepUnusedDataFor: 5, // small cache window
      providesTags: ["Users"], // lets delete/edit invalidate the list later
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"], // optional if you plan to call refetch() manually
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
} = usersApiSlice;
