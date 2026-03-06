import { supabase } from '../../services/supabase';

export const productsApi = {
  list: async (filters = {}) => {
    let query = supabase
      .from('products')
      .select(`*, farms(name, city), product_images(url, position)`)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.city)     query = query.eq('farms.city', filters.city);
    if (filters.search)   query = query.ilike('name', `%${filters.search}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select(`*, farms(id, name, city, owner_id), product_images(url, position)`)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  uploadImage: async (productId, file) => {
    const path = `${productId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(path);

    await supabase.from('product_images').insert({
      product_id: productId,
      url: publicUrl,
    });
    return publicUrl;
  },
};