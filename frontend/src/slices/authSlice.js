import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  // If we refreshed the page, keep the logged-in user if present
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called after a successful login to persist user data
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // We'll add a proper logout later in the course
    // logout: (state) => { ... }
  },
});
export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
