import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";
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
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details, // PayPal payment result
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => PAYPAL_URL, // returns { clientId }
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => `${ORDERS_URL}/mine`, // or /myorders depending on your backend
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL, // '/api/orders'
        // method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`, // e.g. '/api/orders/:id/deliver'
        method: "PUT",
      }),
    }),

    // more endpoints (getOrderDetails, payOrder, listMyOrders, etc.) will be added later
  }),
});
export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = ordersApiSlice;
