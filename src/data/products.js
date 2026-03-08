export const products = [{
  id: 'fresh-tomatoes',
  name: 'Organic Tomatoes',
  price: '15 DH',
  unit: 'kg',
  location: 'Marrakech',
  accent: '#d96a54',
  badge: 'Seasonal',
  category: 'Vegetables',
  available: 150,
  harvestDate: 'Apr 14, 2024',
  farmer: {
    name: 'Hamid Merabet',
    location: 'Marrakech'
  },
  description: 'Fresh, organic tomatoes harvested at peak ripeness from our farm in Marrakech. Juicy and full of flavor, they are perfect for salads, sauces, and daily cooking. Grown with sustainable practices, free of pesticides and chemicals.',
  gallery: ['#d96a54', '#c84e3e', '#f1b49b', '#e7c09f']
}, {
  id: 'organic-apples',
  name: 'Organic Apples',
  price: '12 DH',
  unit: 'kg',
  location: 'Agadir',
  accent: '#d9b96f',
  category: 'Fruits',
  available: 200,
  harvestDate: 'Apr 10, 2024',
  farmer: {
    name: 'Amina Idrissi',
    location: 'Agadir'
  },
  description: 'Crisp and naturally sweet apples grown in the Agadir valley. These apples are hand-picked, washed, and packed to keep their crunch and aroma intact.',
  gallery: ['#d9b96f', '#cda255', '#f3dba0', '#edd1a5']
}, {
  id: 'crisp-lettuce',
  name: 'Crisp Lettuce',
  price: '8 DH',
  unit: 'kg',
  location: 'Fes',
  accent: '#7fa96b',
  badge: 'Picked Today',
  category: 'Vegetables',
  available: 90,
  harvestDate: 'Apr 16, 2024',
  farmer: {
    name: 'Youssef Naji',
    location: 'Fes'
  },
  description: 'Tender lettuce leaves freshly harvested in Fes. Ideal for salads and sandwiches, with a light crunch and bright color.',
  gallery: ['#7fa96b', '#6b9857', '#b8d6a8', '#d3e5c6']
}, {
  id: 'ripe-strawberries',
  name: 'Ripe Strawberries',
  price: '20 DH',
  unit: 'kg',
  location: 'Rabat',
  accent: '#d86a89',
  category: 'Fruits',
  available: 65,
  harvestDate: 'Apr 12, 2024',
  farmer: {
    name: 'Sara El Amrani',
    location: 'Rabat'
  },
  description: 'Sweet, fragrant strawberries from Rabat farms. Perfect for desserts, smoothies, or a fresh snack.',
  gallery: ['#d86a89', '#c55071', '#f1a4b9', '#f6c2cf']
}, {
  id: 'farm-eggs',
  name: 'Farm Fresh Eggs',
  price: '1.50 DH',
  unit: 'egg',
  location: 'Casablanca',
  accent: '#e1c089',
  category: 'Others',
  available: 240,
  availableUnit: 'eggs',
  harvestDate: 'Apr 15, 2024',
  farmer: {
    name: 'Nadia Bentayeb',
    location: 'Casablanca'
  },
  description: 'Free-range eggs collected daily from our Casablanca farm. Rich yolks and firm whites, ideal for baking or breakfast.',
  gallery: ['#e1c089', '#d1a86a', '#f4debf', '#f1e1c7']
}, {
  id: 'fresh-potatoes',
  name: 'Fresh Potatoes',
  price: '10 DH',
  unit: 'kg',
  location: 'Meknes',
  accent: '#c9a96f',
  category: 'Vegetables',
  available: 300,
  harvestDate: 'Apr 9, 2024',
  farmer: {
    name: 'Hassan Ait',
    location: 'Meknes'
  },
  description: 'Golden potatoes with a smooth skin and fluffy texture. Great for roasting, mashing, or frying.',
  gallery: ['#c9a96f', '#b58c55', '#e8cfa1', '#eddab6']
}, {
  id: 'sweet-oranges',
  name: 'Sweet Oranges',
  price: '7 DH',
  unit: 'kg',
  location: 'Tangier',
  accent: '#e9a24a',
  category: 'Fruits',
  available: 180,
  harvestDate: 'Apr 8, 2024',
  farmer: {
    name: 'Omar Bekkali',
    location: 'Tangier'
  },
  description: 'Bright, juicy oranges from Tangier groves. Naturally sweet and full of vitamin C.',
  gallery: ['#e9a24a', '#d88a33', '#f5c07e', '#f8d5a2']
}, {
  id: 'organic-carrots',
  name: 'Organic Carrots',
  price: '9 DH',
  unit: 'kg',
  location: 'Tetouan',
  accent: '#e08b4f',
  category: 'Vegetables',
  available: 130,
  harvestDate: 'Apr 13, 2024',
  farmer: {
    name: 'Leila Rami',
    location: 'Tetouan'
  },
  description: 'Crunchy organic carrots with a sweet finish. Perfect for salads, soups, or roasting.',
  gallery: ['#e08b4f', '#cf7a3f', '#f2b78a', '#f4caa6']
}, {
  id: 'red-peppers',
  name: 'Red Bell Peppers',
  price: '18 DH',
  unit: 'kg',
  location: 'Chefchaouen',
  accent: '#cf4b3b',
  category: 'Vegetables',
  available: 110,
  harvestDate: 'Apr 11, 2024',
  farmer: {
    name: 'Karim El Hanafi',
    location: 'Chefchaouen'
  },
  description: 'Glossy red peppers with a sweet, mild flavor. Add them to grilled dishes, salads, or sautes.',
  gallery: ['#cf4b3b', '#b83d2f', '#f2a08f', '#f7c2b6']
}
// ── Midelt Atlas farm products (linked to farm-midelt-apples) ─────────────────
, {
  id: 'midelt-apples',
  name: 'Atlas Apples',
  price: '11 DH',
  unit: 'kg',
  location: 'Midelt',
  accent: '#c8b45a',
  badge: 'Mountain Grown',
  category: 'Fruits',
  available: 320,
  harvestDate: 'Oct 10, 2024',
  farmId: 'farm-midelt-apples',
  farmer: { name: 'Youssef Atlas', location: 'Midelt', username: 'farmer' },
  description: 'Crisp, aromatic apples grown at 1500 m in the Atlas mountains. Cold nights and warm days make them naturally sweet with a satisfying crunch. Pesticide-free and hand-picked.',
  gallery: ['#c8b45a', '#b09e4a', '#e0ceaa', '#dfc88e'],
}, {
  id: 'midelt-golden-apples',
  name: 'Golden Apples',
  price: '13 DH',
  unit: 'kg',
  location: 'Midelt',
  accent: '#dfc55c',
  badge: 'Premium',
  category: 'Fruits',
  available: 180,
  harvestDate: 'Oct 15, 2024',
  farmId: 'farm-midelt-apples',
  farmer: { name: 'Youssef Atlas', location: 'Midelt', username: 'farmer' },
  description: 'A golden variety with a honeyed, mild sweetness. Excellent for fresh eating and desserts. Thin-skinned and juicy.',
  gallery: ['#dfc55c', '#c9ad40', '#f2dea0', '#f5e8b5'],
}, {
  id: 'midelt-pears',
  name: 'Atlas Pears',
  price: '14 DH',
  unit: 'kg',
  location: 'Midelt',
  accent: '#a8c87e',
  category: 'Fruits',
  available: 140,
  harvestDate: 'Sep 28, 2024',
  farmId: 'farm-midelt-apples',
  farmer: { name: 'Youssef Atlas', location: 'Midelt', username: 'farmer' },
  description: 'Buttery, fragrant pears from the Atlas highlands. Harvested at peak ripeness for the perfect balance of sweetness and texture.',
  gallery: ['#a8c87e', '#8db466', '#cce0ac', '#d8e8c0'],
}, {
  id: 'midelt-walnuts',
  name: 'Mountain Walnuts',
  price: '45 DH',
  unit: 'kg',
  location: 'Midelt',
  accent: '#a87c50',
  badge: 'High Protein',
  category: 'Nuts',
  available: 90,
  harvestDate: 'Nov 5, 2024',
  farmId: 'farm-midelt-apples',
  farmer: { name: 'Youssef Atlas', location: 'Midelt', username: 'farmer' },
  description: 'Wild-cultivated mountain walnuts with a rich, earthy flavour. Cracked fresh per order. High in omega-3 and antioxidants.',
  gallery: ['#a87c50', '#916641', '#c9a882', '#d9bfa3'],
}, {
  id: 'midelt-honey',
  name: 'Atlas Blossom Honey',
  price: '80 DH',
  unit: 'jar',
  location: 'Midelt',
  accent: '#d4a843',
  badge: 'Raw & Pure',
  category: 'Others',
  available: 60,
  harvestDate: 'Aug 20, 2024',
  farmId: 'farm-midelt-apples',
  farmer: { name: 'Youssef Atlas', location: 'Midelt', username: 'farmer' },
  description: 'Raw, unfiltered honey from Atlas mountain wildflowers. Deep amber colour with complex floral notes. 500g jar, harvested twice a year.',
  gallery: ['#d4a843', '#bf902e', '#ecca7a', '#f4dfa0'],
}];

export const findProductById = id => {
  if (!id) return undefined;
  return products.find(product => product.id === id);
};

/** All products belonging to a specific farm */
export const findProductsByFarmId = farmId => {
  if (!farmId) return [];
  return products.filter(p => p.farmId === farmId);
};