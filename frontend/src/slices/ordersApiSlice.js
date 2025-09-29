import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";
export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      // order = { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice }
      query: (order) => ({
        url: ORDERS_URL, // '/api/orders'
        method: "POST",
        body: { ...order }, // spread the order payload
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        // method: 'GET', (not needed; GET by default)
      }),
      keepUnusedDataFor: 5, // seconds
    }),

    // more endpoints (getOrderDetails, payOrder, listMyOrders, etc.) will be added later
  }),
});
export const { useCreateOrderMutation, useGetOrderDetailsQuery } = ordersApiSlice;
