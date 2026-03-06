export const farms = [{
  id: 'farm-tangier',
  name: 'Rif Orchard',
  location: 'Tangier',
  accent: '#6f9c6b',
  position: {
    x: 30,
    y: 22
  },
  products: [{
    name: 'Citrus',
    price: '7 DH',
    unit: 'kg'
  }, {
    name: 'Olives',
    price: '14 DH',
    unit: 'kg'
  }]
}, {
  id: 'farm-rabat',
  name: 'Bouregreg Fields',
  location: 'Rabat',
  accent: '#8caf76',
  position: {
    x: 34,
    y: 34
  },
  products: [{
    name: 'Lettuce',
    price: '8 DH',
    unit: 'kg'
  }, {
    name: 'Herbs',
    price: '6 DH',
    unit: 'bunch'
  }]
}, {
  id: 'farm-casablanca',
  name: 'Atlantic Harvest',
  location: 'Casablanca',
  accent: '#7b9d73',
  position: {
    x: 36,
    y: 42
  },
  products: [{
    name: 'Tomatoes',
    price: '15 DH',
    unit: 'kg'
  }, {
    name: 'Peppers',
    price: '18 DH',
    unit: 'kg'
  }]
}, {
  id: 'farm-fes',
  name: 'Atlas Gardens',
  location: 'Fes',
  accent: '#9ab37b',
  position: {
    x: 54,
    y: 33
  },
  products: [{
    name: 'Apples',
    price: '12 DH',
    unit: 'kg'
  }, {
    name: 'Carrots',
    price: '9 DH',
    unit: 'kg'
  }]
}, {
  id: 'farm-marrakech',
  name: 'Palm Grove Farm',
  location: 'Marrakech',
  accent: '#7a8f64',
  position: {
    x: 46,
    y: 56
  },
  products: [{
    name: 'Oranges',
    price: '7 DH',
    unit: 'kg'
  }, {
    name: 'Dates',
    price: '22 DH',
    unit: 'kg'
  }]
}, {
  id: 'farm-agadir',
  name: 'Souss Valley',
  location: 'Agadir',
  accent: '#6f8560',
  position: {
    x: 35,
    y: 70
  },
  products: [{
    name: 'Berries',
    price: '20 DH',
    unit: 'kg'
  }, {
    name: 'Avocado',
    price: '25 DH',
    unit: 'kg'
  }]
}, {
  id: 'farm-oujda',
  name: 'Eastern Plateau',
  location: 'Oujda',
  accent: '#97ad6c',
  position: {
    x: 70,
    y: 40
  },
  products: [{
    name: 'Wheat',
    price: '6 DH',
    unit: 'kg'
  }, {
    name: 'Almonds',
    price: '28 DH',
    unit: 'kg'
  }]
}];
export const findFarmById = id => {
  if (!id) {
    return undefined;
  }
  return farms.find(farm => farm.id === id);
};