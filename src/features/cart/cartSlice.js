import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  //   cart: [],
  cart: [{ pizzaId: 12, name: 'Mediterranean', qty: 2, unitPrice: 16, totalPrice: 32 }],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      // payload = pizza obj
      state.cart.push(action.payload);
    },
    removeItem(state, action) {
      // payload = pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      // payload = pizzaId
      const item = state.cart.find((pizza) => pizza.pizzaId === action.payload);
      item.qty++;
      item.totalPrice = item.qty * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      // payload = pizzaId
      const item = state.cart.find((pizza) => pizza.pizzaId === action.payload);
      item.qty--;
      item.totalPrice = item.qty * item.unitPrice;
    },
    clearCart(state, action) {
      state.cart = [];
    },
  },
});

export const { addItem, removeItem, increaseItemQuantity, decreaseItemQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
