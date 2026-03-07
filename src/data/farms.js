export const farms = [
  {
  id: 'farm-midelt-apples',
  name: 'Vergers Midelt Atlas',
  location: 'Outskirts of Midelt',
  accent: '#7ea35f',
  coordinates: {
    lat: 32.7044,
    lng: -4.7421
  },
  products: [{
    name: 'Apples',
    price: '11 DH',
    unit: 'kg'
  }, {
    name: 'Golden Apples',
    price: '13 DH',
    unit: 'kg'
  }, {
    name: 'Pears',
    price: '14 DH',
    unit: 'kg'
  }]
}, ];
export const findFarmById = id => {
  if (!id) {
    return undefined;
  }
  return farms.find(farm => farm.id === id);
};