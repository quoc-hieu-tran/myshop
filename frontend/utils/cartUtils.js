//turning numbers to decimal format
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};
//calculating total price of all items, plus tax, shipping fee
export const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => {
      return acc + item.price * item.qty;
    }, 0)
  );
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 100 : 0);
  state.taxPrice = addDecimals(Number(state.itemsPrice * 0.15));
  state.totalPrice = addDecimals(Number(state.itemsPrice) + Number(state.taxPrice) + Number(state.shippingPrice));

  localStorage.setItem(
    "cart",
    JSON.stringify({
      cartItems: state.cartItems,
      shippingAddress: state.shippingAddress,
      paymentMethod: state.paymentMethod,
    })
  );
  return state;
};
