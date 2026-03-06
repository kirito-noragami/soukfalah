import { supabase } from '../../services/supabase';

export const cartApi = {
  get: async () => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`*, products(id, name, price_dh, unit, accent)`)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  add: async (productId, quantity = 1) => {
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({ product_id: productId, quantity }, { onConflict: 'user_id,product_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity <= 0) return cartApi.remove(itemId);
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  remove: async (itemId) => {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
    if (error) throw error;
  },

  clear: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', session?.user?.id);
    if (error) throw error;
  },
};