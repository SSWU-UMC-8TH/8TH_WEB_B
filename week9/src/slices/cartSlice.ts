import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItem } from "../types/cart";

// 🔑 cartItems는 CartItem[] 타입
export interface CartState {
  cartItems: CartItem[];   // ✅ 배열 타입
  amount: number;
  total: number;
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 음반 수량 증가
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);

      if (item) {
        item.amount += 1;
      }
    },

    // 음반 수량 감소
    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);

      if (item) {
        if (item.amount > 1) {
          // 수량이 1보다 크면 -1 감소
          item.amount -= 1;
        } else {
          // 수량이 1일 때 감소하면, removeItem처럼 제거
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.id !== itemId
          );
        }
      }
    },

    // 수동으로 항목 제거
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== itemId
      );
    },

    // 장바구니 비우기
    clearCart: (state) => {
      state.cartItems = [];
    },

    // 총 수량/총 가격 계산
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },
});

export const {
  increase,
  decrease,
  removeItem,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

const cartReducer = cartSlice.reducer;
export default cartReducer;
