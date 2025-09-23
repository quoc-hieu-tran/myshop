import { createSlice } from "@reduxjs/toolkit";
import { addDecimals, updateCart } from "../../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // a reducer function manipulates state based on the action
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id); //x is an item in cartItems
      if (existItem) {
        state.cartItems = state.cartItems.map((x) => (x._id === existItem._id ? item : x));
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state); //we call updateCart(state) to have the "cart" saved in localStorage
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload; // e.g., 'PayPal'
      updateCart(state);
    },
  },
});

export default cartSlice.reducer;
//destructuring set of action creators
export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;
