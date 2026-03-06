import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  // Safe fallback if used outside provider (prevents crashes)
  if (!ctx) return { items: [], total: 0, count: 0, addItem: () => {}, removeItem: () => {}, updateQty: () => {}, setQty: () => {}, clearCart: () => {} };
  return ctx;
};

const CART_KEY = 'soukfalah-cart';

const parsePrice = (value) => {
  const n = Number.parseFloat(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    const price = parsePrice(product.price);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { id: product.id, name: product.name, price, unit: product.unit, quantity, accent: product.accent, farmer: product.farmer?.name ?? '' }];
    });
  }, []);

  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);

  const updateQty = useCallback((id, delta) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  }, []);

  const setQty = useCallback((id, quantity) => {
    if (quantity <= 0) setItems((prev) => prev.filter((i) => i.id !== id));
    else setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, addItem, removeItem, updateQty, setQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;