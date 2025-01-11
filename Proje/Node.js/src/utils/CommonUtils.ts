import { Cart, Product } from '../interface';
export function getCombinedArray(cart: Cart[], productArray: Product[]) {
  let combinedArray = [];
  for (let i = 0; i < cart.length; i++) {
    combinedArray.push({
      ...cart[i],
      ...productArray.find((itemInner) => itemInner.id === cart[i].id),
    });
    cart;
  }
  return combinedArray;
}

export function getPrice(cart: Cart[]) {
  let amount = 0;
  cart.forEach((item) => {
    amount += item.price * item.count;
  });

  return amount * 100;
}
