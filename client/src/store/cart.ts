import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Define the shape of a single cart item
export interface CartItem {
  productId: string | number; // Adjust based on your DB ID type (string or number)
  quantity: number;
}

// 2. Define the State properties
interface CartState {
  items: CartItem[];
}

// 3. Define the Action methods
interface CartActions {
  addItem: (productId: string | number, qty?: number) => void;
  removeItem: (productId: string | number) => void;
  setQty: (productId: string | number, quantity: number) => void;
  clear: () => void;
}

// 4. Combine State and Actions for Zustand
type CartStore = CartState & CartActions;

// 5. Pass <CartStore> to create() and type the persist middleware
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(productId, qty = 1) {
        const items = [...get().items];
        const i = items.findIndex((item) => item.productId === productId);
        
        if (i >= 0) {
          items[i] = { ...items[i], quantity: items[i].quantity + qty };
        } else {
          items.push({ productId, quantity: qty });
        }
        
        set({ items });
      },

      removeItem(productId) {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },

      setQty(productId, quantity) {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.productId !== productId) });
          return;
        }
        
        const items = get().items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        set({ items });
      },

      clear() {
        set({ items: [] });
      },
    }),
    { 
      name: "E-cart" // This will save to localStorage under this key
    }
  )
);