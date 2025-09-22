import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  // If we refreshed the page, keep the logged-in user if present
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called after a successful login to persist user data
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    //client-side logout
    logout: (state) => {
      state.userInfo = null; // clear Redux
      localStorage.removeItem("userInfo"); // clear localStorage
    },
  },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
