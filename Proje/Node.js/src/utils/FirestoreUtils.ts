import admin = require('firebase-admin');
import { Cart, Product } from '../interface';
import { getCombinedArray, getPrice } from './CommonUtils';

export const CUSTOMERS_COLLECTION = 'customers';
export const CART_COLLECTION = 'cart';
export const ORDER_COLLECTION = 'orders';
export const PRODUCT_COLLECTION = 'product';

async function getProducts(ids: string[]): Promise<Product[]> {
  const products = await admin
    .firestore()
    .collection(PRODUCT_COLLECTION)
    .where('id', 'in', ids)
    .get();
  return products.docs.map((doc) => doc.data()) as Product[];
}

const getCart = async (
  user: any
): Promise<{ cart: Cart[]; cartCollection: any }> => {
  const cartCollection = admin
    .firestore()
    .collection(CUSTOMERS_COLLECTION)
    .doc(user.uid)
    .collection(CART_COLLECTION);
  const cartsFir = await cartCollection.get();
  const cart = cartsFir.docs.map((doc) => doc.data()) as Cart[];
  return { cart, cartCollection };
};

export const getStripeCustomerId = async (user) => {
  const customer = await admin
    .firestore()
    .collection(CUSTOMERS_COLLECTION)
    .doc(user.uid)
    .get();
  return customer.data();
};
export const storeStripeCustomerId = async (
  customerId: string,
  userUid: string
) => {
  await admin.firestore().collection(CUSTOMERS_COLLECTION).doc(userUid).set({
    customer_id: customerId,
  });
};

export const deleteCart = async (userUid: string) => {
  const snapshot = await admin
    .firestore()
    .collection(CUSTOMERS_COLLECTION)
    .doc(userUid)
    .collection(CART_COLLECTION)
    .get();
  snapshot.docs.forEach((doc) => {
    doc.ref.delete();
  });
};

export const createOrder = (
  cart: Cart[],
  paymentId: string,
  userUid: string,
  amount: number
) => {
  const order = admin.firestore().collection(ORDER_COLLECTION).doc(paymentId);
  order.set({ user_uid: userUid, status: 'initiated', amount: amount });

  const orderCart = order.collection(CART_COLLECTION);
  cart.forEach((product) => {
    orderCart
      .doc(product.id.toString())
      .set({ price: product.price, count: product.count });
  });
};

export const completeOrder = async (paymentId: string) => {
  const order = admin.firestore().collection(ORDER_COLLECTION).doc(paymentId);
  order.update({ status: 'Success' });
  const userUid = await (await order.get()).data().user_uid;
  await deleteCart(userUid);
};

export const getAmountAndCart = async (user) => {
  const { cart } = await getCart(user);
  const products = await getProducts(cart.map((data) => data.id));
  const combinedCart = getCombinedArray(cart, products);
  return { amount: getPrice(combinedCart), cart: combinedCart };
};
