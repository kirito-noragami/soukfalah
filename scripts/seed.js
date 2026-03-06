// run once via scripts/seed.js
import 'dotenv/config';
import { supabase } from '../src/services/supabase.js';
import { products } from '../src/data/products.js';
import { farms } from '../src/data/farms.js';

// Seed farms first (you'll need to create a test farmer user in Supabase Auth first)
const FARMER_ID = 'your-test-farmer-uuid';

for (const farm of farms) {
  await supabase.from('farms').insert({
    name: farm.name,
    city: farm.location,
    accent: farm.accent,
  });
}

for (const product of products) {
  const price = parseFloat(product.price);
  await supabase.from('products').insert({
    name: product.name,
    description: product.description,
    category: product.category,
    price_dh: price,
    unit: product.unit,
    available_kg: product.available,
    accent: product.accent,
    badge: product.badge ?? null,
    status: 'active',
  });
}