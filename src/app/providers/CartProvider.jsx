/**
 * CartProvider — 100% Supabase cart.
 *
 * - Logged in  → cart_items table (per user, unique on user_id+product_id)
 * - Guest      → localStorage  (soukfalah-cart)
 * - On login   → guest cart is migrated into Supabase then localStorage is cleared
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from './AuthProvider';

const CartContext = createContext(null);

/* ─── localStorage helpers (guest-only fallback) ─────────────────────────── */
const CART_KEY  = 'soukfalah-cart';
const readLocal  = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } };
const writeLocal = (items) => { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {} };
const clearLocal = () => { try { localStorage.removeItem(CART_KEY); } catch {} };

const parsePrice = (v) => {
  const n = Number.parseFloat(String(v ?? 0).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/* ─── Map Supabase row → UI item shape ───────────────────────────────────── */
const fromRow = (row) => ({
  cartItemId: row.id,
  id:         row.products?.id    ?? row.product_id,
  product_id: row.product_id,
  name:       row.products?.name  ?? '?',
  price:      parsePrice(row.products?.price_dh),
  price_dh:   parsePrice(row.products?.price_dh),
  unit:       row.products?.unit  ?? 'kg',
  accent:     row.products?.accent ?? '#888',
  farmer:     row.products?.farms?.name ?? '',
  farmer_id:  row.products?.farms?.owner_id ?? null,
  farm_id:    row.products?.farm_id ?? null,
  quantity:   Number(row.quantity),
});

/* ─── Provider ───────────────────────────────────────────────────────────── */
const CartProvider = ({ children }) => {
  const { session } = useAuth();
  const userId    = session?.user?.id ?? null;
  const prevUid   = useRef(null);

  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(false);

  /* Load from Supabase */
  const loadSupabase = useCallback(async (uid) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(id, name, price_dh, unit, accent, farm_id, farms(id, name, owner_id))')
      .eq('user_id', uid)
      .order('created_at');
    if (!error && data) setItems(data.map(fromRow));
    else setItems([]);
    setLoading(false);
  }, []);

  /* Migrate guest localStorage cart into Supabase on first login */
  const migrateLocal = useCallback(async (uid) => {
    const localItems = readLocal();
    if (!localItems.length) return;
    const rows = localItems
      .filter(i => i.id && typeof i.id === 'string' && i.id.length === 36) // UUID only
      .map(i => ({ user_id: uid, product_id: i.id, quantity: i.quantity }));
    if (rows.length) {
      await supabase
        .from('cart_items')
        .upsert(rows, { onConflict: 'user_id,product_id', ignoreDuplicates: false });
    }
    clearLocal();
  }, []);

  /* React to auth state changes */
  useEffect(() => {
    if (userId && userId !== prevUid.current) {
      // New login — migrate then load
      migrateLocal(userId).then(() => loadSupabase(userId));
    } else if (!userId && prevUid.current) {
      // Logged out — show localStorage
      setItems(readLocal());
    } else if (userId) {
      // Reload on page refresh
      loadSupabase(userId);
    } else {
      setItems(readLocal());
    }
    prevUid.current = userId;
  }, [userId, loadSupabase, migrateLocal]);

  /* addItem */
  const addItem = useCallback(async (product, qty = 1) => {
    if (!product) return;
    const productId = product.id;

    if (userId) {
      const existing = items.find(i => i.product_id === productId || i.id === productId);
      const newQty   = existing ? existing.quantity + qty : qty;
      await supabase
        .from('cart_items')
        .upsert({ user_id: userId, product_id: productId, quantity: newQty },
                 { onConflict: 'user_id,product_id' });
      await loadSupabase(userId);
    } else {
      setItems(prev => {
        const ex   = prev.find(i => i.id === productId);
        const next = ex
          ? prev.map(i => i.id === productId ? { ...i, quantity: i.quantity + qty } : i)
          : [...prev, {
              cartItemId: `local-${productId}`,
              id:       productId,
              product_id: productId,
              name:     product.name,
              price:    parsePrice(product.price_dh ?? product.price),
              price_dh: parsePrice(product.price_dh ?? product.price),
              unit:     product.unit ?? 'kg',
              accent:   product.accent ?? '#888',
              farmer:   product.farmer?.name ?? '',
              farmer_id: product.farmer_id ?? null,
              quantity: qty,
            }];
        writeLocal(next);
        return next;
      });
    }
  }, [userId, items, loadSupabase]);

  /* removeItem — pass product.id */
  const removeItem = useCallback(async (productId) => {
    if (userId) {
      const item = items.find(i => i.id === productId || i.product_id === productId);
      if (item) {
        await supabase.from('cart_items').delete().eq('id', item.cartItemId);
        setItems(prev => prev.filter(i => i.cartItemId !== item.cartItemId));
      }
    } else {
      setItems(prev => {
        const next = prev.filter(i => i.id !== productId);
        writeLocal(next);
        return next;
      });
    }
  }, [userId, items]);

  /* updateQty — pass product.id and delta (+1 / -1) */
  const updateQty = useCallback(async (productId, delta) => {
    const item   = items.find(i => i.id === productId || i.product_id === productId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);

    if (userId) {
      // Optimistic update immediately so UI feels instant
      setItems(prev => prev.map(i =>
        i.cartItemId === item.cartItemId ? { ...i, quantity: newQty } : i
      ));
      await supabase.from('cart_items').update({ quantity: newQty }).eq('id', item.cartItemId);
      // Re-fetch to stay in sync with DB
      await loadSupabase(userId);
    } else {
      setItems(prev => {
        const next = prev.map(i => i.id === productId ? { ...i, quantity: newQty } : i);
        writeLocal(next);
        return next;
      });
    }
  }, [userId, items, loadSupabase]);

  /* clearCart */
  const clearCart = useCallback(async () => {
    if (userId) {
      await supabase.from('cart_items').delete().eq('user_id', userId);
    }
    setItems([]);
    clearLocal();
  }, [userId]);

  const total = items.reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, loading, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};

export default CartProvider;