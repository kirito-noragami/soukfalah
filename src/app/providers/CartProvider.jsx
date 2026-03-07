/**
 * Cart — module-level singleton store.
 * useCart() works from ANY component with zero Provider required.
 */
import { useCallback, useSyncExternalStore } from 'react';

const CART_KEY = 'soukfalah-cart';

// ─── localStorage helpers ─────────────────────────────────────────────────────
const parsePrice = (v) => {
  const n = Number.parseFloat(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const readCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
};

const writeCart = (items) => {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); }
  catch {}
};

// ─── Module store ─────────────────────────────────────────────────────────────
let _items  = readCart();
const _subs = new Set();
const _notify = () => _subs.forEach(fn => fn());

const _subscribe     = (cb) => { _subs.add(cb); return () => _subs.delete(cb); };
const _getSnap       = ()   => _items;
const _getServerSnap = ()   => [];

// ─── Cart actions ─────────────────────────────────────────────────────────────
export const cartAdd = (product, qty = 1) => {
  if (!product) return;
  const price    = parsePrice(product.price);
  const existing = _items.find(i => i.id === product.id);
  if (existing) {
    _items = _items.map(i =>
      i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
    );
  } else {
    _items = [
      ..._items,
      {
        id:       product.id,
        name:     product.name,
        price,
        unit:     product.unit,
        quantity: qty,
        accent:   product.accent ?? '#888',
        farmer:   product.farmer?.name ?? '',
      },
    ];
  }
  writeCart(_items);
  _notify();
};

export const cartRemove = (id) => {
  _items = _items.filter(i => i.id !== id);
  writeCart(_items);
  _notify();
};

export const cartUpdateQty = (id, delta) => {
  _items = _items.map(i =>
    i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
  );
  writeCart(_items);
  _notify();
};

export const cartClear = () => {
  _items = [];
  writeCart(_items);
  _notify();
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useCart = () => {
  const items = useSyncExternalStore(_subscribe, _getSnap, _getServerSnap);

  const addItem    = useCallback((p, q)  => cartAdd(p, q),      []);
  const removeItem = useCallback((id)    => cartRemove(id),      []);
  const updateQty  = useCallback((id, d) => cartUpdateQty(id, d),[]);
  const clearCart  = useCallback(()      => cartClear(),          []);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity,           0);

  return { items, total, count, addItem, removeItem, updateQty, clearCart };
};

// ─── Provider — passthrough, kept for compatibility with main.jsx ─────────────
const CartProvider = ({ children }) => children;
export default CartProvider;