// Produce category icon & asset mapping helper
export function getProduceMeta(itemName) {
  const name = (itemName || '').toLowerCase();
  if (name.includes('tomato')) {
    return { category: 'Vegetables', icon: 'bi-basket', img: '/assets/Images/tomato.jpg', color: 'text-danger' };
  }
  if (name.includes('potato')) {
    return { category: 'Vegetables', icon: 'bi-basket', img: '/assets/Images/potato.jpg', color: 'text-warning' };
  }
  if (name.includes('spinach')) {
    return { category: 'Vegetables', icon: 'bi-flower2', img: '/assets/Images/spinach.jpg', color: 'text-success' };
  }
  if (name.includes('chili') || name.includes('chilies')) {
    return { category: 'Vegetables', icon: 'bi-fire', img: '/assets/Images/chili.jpg', color: 'text-danger' };
  }
  if (name.includes('mango')) {
    return { category: 'Fruits', icon: 'bi-apple', img: '/assets/Images/mango.jpg', color: 'text-warning' };
  }
  if (name.includes('banana')) {
    return { category: 'Fruits', icon: 'bi-apple', img: '/assets/Images/banana.jpg', color: 'text-warning' };
  }
  if (name.includes('mint')) {
    return { category: 'Herbs', icon: 'bi-flower1', img: '/assets/Images/mint.jpg', color: 'text-success' };
  }
  if (name.includes('yogurt') || name.includes('dairy')) {
    return { category: 'Dairy', icon: 'bi-cup-hot', img: '/assets/Images/yogurt.jpg', color: 'text-primary' };
  }
  if (name.includes('bread') || name.includes('bakery')) {
    return { category: 'Bakery', icon: 'bi-cake2', img: '/assets/Images/bread.jpeg', color: 'text-warning' };
  }
  if (name.includes('egg') || name.includes('poultry') || name.includes('meat')) {
    return { category: 'Meat', icon: 'bi-shop', img: '/assets/Images/eggs.png', color: 'text-danger' };
  }
  if (name.includes('spice') || name.includes('masala')) {
    return { category: 'Spices', icon: 'bi-fire', img: '/assets/Images/masala.png', color: 'text-danger' };
  }
  if (name.includes('honey') || name.includes('pantry')) {
    return { category: 'Pantry', icon: 'bi-flower3', img: '/assets/Images/mango.png', color: 'text-warning' };
  }
  return { category: 'Produce', icon: 'bi-basket', img: '', color: 'text-success' };
}
