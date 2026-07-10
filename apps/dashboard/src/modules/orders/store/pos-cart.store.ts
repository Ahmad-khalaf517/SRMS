import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PosCartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
};

type PosCartState = {
  items: PosCartItem[];
  addItem: (item: Omit<PosCartItem, 'quantity'> & { quantity?: number }) => void;
  decrementItem: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateNotes: (menuItemId: string, notes?: string) => void;
  clearCart: () => void;
  resetAfterSubmit: () => void;
  getSubtotal: () => number;
};

export const usePosCartStore = create<PosCartState>()(
  devtools(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set(
          (state) => {
            const existing = state.items.find((current) => current.menuItemId === item.menuItemId);
            if (existing) {
              return {
                items: state.items.map((current) =>
                  current.menuItemId === item.menuItemId
                    ? { ...current, quantity: current.quantity + (item.quantity ?? 1) }
                    : current,
                ),
              };
            }

            return {
              items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
            };
          },
          false,
          'posCart/addItem',
        ),
      decrementItem: (menuItemId) =>
        set(
          (state) => ({
            items: state.items
              .map((item) =>
                item.menuItemId === menuItemId ? { ...item, quantity: item.quantity - 1 } : item,
              )
              .filter((item) => item.quantity > 0),
          }),
          false,
          'posCart/decrementItem',
        ),
      removeItem: (menuItemId) =>
        set(
          (state) => ({
            items: state.items.filter((item) => item.menuItemId !== menuItemId),
          }),
          false,
          'posCart/removeItem',
        ),
      updateQuantity: (menuItemId, quantity) =>
        set(
          (state) => ({
            items: state.items.map((item) =>
              item.menuItemId === menuItemId
                ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
                : item,
            ),
          }),
          false,
          'posCart/updateQuantity',
        ),
      updateNotes: (menuItemId, notes) =>
        set(
          (state) => ({
            items: state.items.map((item) =>
              item.menuItemId === menuItemId
                ? { ...item, notes: notes?.trim() || undefined }
                : item,
            ),
          }),
          false,
          'posCart/updateNotes',
        ),
      clearCart: () => set({ items: [] }, false, 'posCart/clearCart'),
      resetAfterSubmit: () => set({ items: [] }, false, 'posCart/resetAfterSubmit'),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'pos-cart-store' },
  ),
);
