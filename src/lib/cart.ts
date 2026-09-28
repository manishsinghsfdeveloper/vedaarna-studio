/**
 * Cart store — client-side only.
 *
 * Cart is persisted to localStorage so it survives page reloads.
 * Each browser session gets a stable `sessionId` (UUID) that lets the
 * Medusa backend correlate abandoned-cart data with a guest visitor.
 *
 * When a customer logs in their email is attached to the cart metadata
 * so orders@vedaarnastudio.com emails and marketing campaigns can be
 * matched to a known customer record.
 *
 * Usage:
 *   import { useCart } from "@/lib/cart";
 *   const { items, addItem, removeItem, updateQty, clearCart, totalQty, subtotal } = useCart();
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
  /** Stable browser-session identifier — sent to backend with every cart event */
  sessionId: string;
  /** Set after customer logs in — links guest cart to a known customer */
  customerEmail: string | null;
}

type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "qty"> }
  | { type: "REMOVE"; slug: string; size: string }
  | { type: "SET_QTY"; slug: string; size: string; qty: number }
  | { type: "CLEAR" }
  | { type: "SET_CUSTOMER"; email: string }
  | { type: "LOAD"; state: CartState };

export interface CartContextValue {
  items: CartItem[];
  sessionId: string;
  customerEmail: string | null;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (slug: string, size: string) => void;
  updateQty: (slug: string, size: string, qty: number) => void;
  clearCart: () => void;
  setCustomer: (email: string) => void;
  totalQty: number;
  subtotal: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const STORAGE_KEY = "vs_cart";

function loadFromStorage(): CartState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CartState;
  } catch {
    return null;
  }
}

function saveToStorage(state: CartState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or private browsing — silently ignore
  }
}

function initialState(): CartState {
  return { items: [], sessionId: uuid(), customerEmail: null };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return action.state;

    case "ADD": {
      const key = `${action.item.slug}::${action.item.size}`;
      const existing = state.items.find((i) => `${i.slug}::${i.size}` === key);
      const items = existing
        ? state.items.map((i) => (`${i.slug}::${i.size}` === key ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { ...action.item, qty: 1 }];
      return { ...state, items };
    }

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => !(i.slug === action.slug && i.size === action.size)),
      };

    case "SET_QTY": {
      if (action.qty <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => !(i.slug === action.slug && i.size === action.size)),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.slug === action.slug && i.size === action.size ? { ...i, qty: action.qty } : i,
        ),
      };
    }

    case "CLEAR":
      return { ...state, items: [] };

    case "SET_CUSTOMER":
      return { ...state, customerEmail: action.email };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// React context + hook
// ---------------------------------------------------------------------------

import { createElement } from "react";

export const CartContext = createContext<CartContextValue>({
  items: [],
  sessionId: "",
  customerEmail: null,
  addItem: () => undefined,
  removeItem: () => undefined,
  updateQty: () => undefined,
  clearCart: () => undefined,
  setCustomer: () => undefined,
  totalQty: 0,
  subtotal: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, null, () => initialState());

  // Rehydrate from localStorage on first client render
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      dispatch({ type: "LOAD", state: saved });
    }
  }, []);

  // Persist every change
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const addItem = useCallback((item: Omit<CartItem, "qty">) => {
    dispatch({ type: "ADD", item });
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    dispatch({ type: "REMOVE", slug, size });
  }, []);

  const updateQty = useCallback((slug: string, size: string, qty: number) => {
    dispatch({ type: "SET_QTY", slug, size, qty });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const setCustomer = useCallback((email: string) => {
    dispatch({ type: "SET_CUSTOMER", email });
  }, []);

  const totalQty = useMemo(() => state.items.reduce((sum, i) => sum + i.qty, 0), [state.items]);

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [state.items],
  );

  const value: CartContextValue = {
    items: state.items,
    sessionId: state.sessionId,
    customerEmail: state.customerEmail,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    setCustomer,
    totalQty,
    subtotal,
  };

  return createElement(CartContext.Provider, { value }, children);
}

export function useCart(): CartContextValue {
  return useContext(CartContext);
}
