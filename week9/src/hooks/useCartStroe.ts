import { create } from "zustand";
import cartItems from "../constants/cartItems";
import type { CartItem } from "../types/cart";

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

const useCartStore = create<CartState>((set, get) => ({
  cartItems: cartItems,
  amount: 0,
  total: 0,

  increase: (id: string) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    }));
  },

  decrease: (id: string) => {
    set((state) => {
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        if (item.amount > 1) {
          return {
            cartItems: state.cartItems.map((cartItem) =>
              cartItem.id === id
                ? { ...cartItem, amount: cartItem.amount - 1 }
                : cartItem
            ),
          };
        } else {
          return {
            cartItems: state.cartItems.filter((cartItem) => cartItem.id !== id),
          };
        }
      }
      return {};
    });
  },

  removeItem: (id: string) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));
  },

  clearCart: () => {
    set(() => ({
      cartItems: [],
    }));
  },

  calculateTotals: () => {
    const { cartItems } = get();
    let amount = 0;
    let total = 0;

    cartItems.forEach((item) => {
      amount += item.amount;
      total += item.amount * item.price;
    });

    set(() => ({
      amount,
      total,
    }));
  },
}));

export default useCartStore;
