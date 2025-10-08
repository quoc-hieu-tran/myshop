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
    getUserDetails: builder.query({
      query: (userId) => `${USERS_URL}/${userId}`, // GET /api/users/:id
      keepUnusedDataFor: 5,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation({
      // send the whole data object; it contains userId and fields
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`, // PUT /api/users/:id
        method: "PUT",
        body: data, // { userId, name, email, isAdmin }
      }),
      // invalidate both the single user and the list so UIs refresh
      invalidatesTags: (result, error, data) => [{ type: "User", id: data.userId }, "Users"],
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
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} = usersApiSlice;
