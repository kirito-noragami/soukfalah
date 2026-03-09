import { supabase } from '../../services/supabase';

export const farmsApi = {
  /** All farms with their products */
  list: async () => {
    const { data, error } = await supabase
      .from('farms')
      .select(`
        *,
        products(id, name, price_dh, unit, category, accent, badge, available, status)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(normalizeFarm);
  },

  /** Single farm by id with full product details */
  getById: async (id) => {
    const { data, error } = await supabase
      .from('farms')
      .select(`
        *,
        profiles(id, full_name, avatar_url),
        products(id, name, price_dh, unit, category, accent, badge, available, description, status)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return normalizeFarm(data);
  },

  /** Farm owned by the current logged-in farmer */
  getMyFarm: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const { data, error } = await supabase
      .from('farms')
      .select(`
        *,
        profiles(id, full_name, avatar_url),
        products(id, name, price_dh, unit, category, accent, badge, available, description, status)
      `)
      .eq('owner_id', session.user.id)
      .single();
    if (error) return null;
    return normalizeFarm(data);
  },

  /** Create a new farm for the current farmer */
  create: async ({ name, city, description, accent, lat, lng }) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from('farms')
      .insert({
        owner_id: session.user.id,
        name,
        city,
        description,
        accent: accent || '#7ea35f',
        location: `POINT(${lng} ${lat})`,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Update farm details */
  update: async (farmId, updates) => {
    const payload = { ...updates };
    if (updates.lat && updates.lng) {
      payload.location = `POINT(${updates.lng} ${updates.lat})`;
      delete payload.lat;
      delete payload.lng;
    }
    const { data, error } = await supabase
      .from('farms')
      .update(payload)
      .eq('id', farmId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

/**
 * Normalize a Supabase farm row to the shape the UI expects:
 *  - farm.coordinates = { lat, lng }  (extracted from PostGIS location)
 *  - farm.products    shaped like the old products.js entries
 */
function normalizeFarm(farm) {
  if (!farm) return null;

  // Extract lat/lng from PostGIS point string  "POINT(lng lat)"  or coordinates object
  let coordinates = null;
  if (farm.location) {
    const match = String(farm.location).match(/POINT\(([^ ]+) ([^ )]+)\)/);
    if (match) {
      coordinates = { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }
  }

  const products = (farm.products || [])
    .filter(p => p.status === 'active')
    .map(p => ({
      id:       p.id,
      name:     p.name,
      price:    `${p.price_dh} DH`,
      price_dh: p.price_dh,
      unit:     p.unit,
      category: p.category,
      accent:   p.accent,
      badge:    p.badge,
      stock:    p.available,
      available: p.available,
      description: p.description,
    }));

  const profile = farm.profiles;

  return {
    id:          farm.id,
    name:        farm.name,
    city:        farm.city,
    location:    farm.city,       // keep .location as city string for search/display
    accent:      farm.accent || '#7ea35f',
    description: farm.description,
    coordinates,
    products,
    owner_id:    farm.owner_id,
    farmer: profile ? {
      name:     profile.full_name,
      avatar:   profile.avatar_url,
    } : null,
  };
}