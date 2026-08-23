import type {
  CartItem,
  CartItemInput,
  CartItemType,
} from "@/features/cart/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const getItemKey = (projectId: number, id: number, itemType: CartItemType) =>
  `${projectId}-${itemType}-${id}`;

interface CartState {
  items: CartItem[];
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (projectId: number, id: number, itemType: CartItemType) => void;
  incrementQuantity: (
    projectId: number,
    id: number,
    itemType: CartItemType,
    amount?: number,
  ) => void;
  decrementQuantity: (
    projectId: number,
    id: number,
    itemType: CartItemType,
    amount?: number,
  ) => void;
  clearProjectCart: (projectId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const amount = Math.max(1, quantity);
          const key = getItemKey(item.projectId, item.id, item.itemType);
          const existing = state.items.find(
            (cartItem) =>
              getItemKey(cartItem.projectId, cartItem.id, cartItem.itemType) ===
              key,
          );

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                getItemKey(
                  cartItem.projectId,
                  cartItem.id,
                  cartItem.itemType,
                ) === key
                  ? { ...cartItem, quantity: cartItem.quantity + amount }
                  : cartItem,
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity: amount }] };
        }),
      removeItem: (projectId, id, itemType) =>
        set((state) => ({
          items: state.items.filter(
            (cartItem) =>
              getItemKey(cartItem.projectId, cartItem.id, cartItem.itemType) !==
              getItemKey(projectId, id, itemType),
          ),
        })),
      incrementQuantity: (projectId, id, itemType, amount = 1) =>
        set((state) => ({
          items: state.items.map((cartItem) =>
            getItemKey(cartItem.projectId, cartItem.id, cartItem.itemType) ===
            getItemKey(projectId, id, itemType)
              ? { ...cartItem, quantity: cartItem.quantity + amount }
              : cartItem,
          ),
        })),
      decrementQuantity: (projectId, id, itemType, amount = 1) =>
        set((state) => ({
          items: state.items.flatMap((cartItem) => {
            if (
              getItemKey(cartItem.projectId, cartItem.id, cartItem.itemType) !==
              getItemKey(projectId, id, itemType)
            ) {
              return [cartItem];
            }

            const nextQuantity = cartItem.quantity - amount;

            return nextQuantity <= 0
              ? []
              : [{ ...cartItem, quantity: nextQuantity }];
          }),
        })),
      clearProjectCart: (projectId) =>
        set((state) => ({
          items: state.items.filter(
            (cartItem) => cartItem.projectId !== projectId,
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
);

export default useCartStore;

export const selectProjectItems =
  (projectId: number) =>
  (state: CartState): CartItem[] =>
    state.items.filter((cartItem) => cartItem.projectId === projectId);

export const selectProjectTotalQuantity =
  (projectId: number) =>
  (state: CartState): number =>
    state.items
      .filter((cartItem) => cartItem.projectId === projectId)
      .reduce((total, item) => total + item.quantity, 0);

export const selectProjectTotalPrice =
  (projectId: number) =>
  (state: CartState): number =>
    state.items
      .filter((cartItem) => cartItem.projectId === projectId)
      .reduce((total, item) => total + item.price * item.quantity, 0);
