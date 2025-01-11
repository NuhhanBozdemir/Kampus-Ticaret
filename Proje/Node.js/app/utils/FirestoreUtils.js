"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAmountAndCart = exports.completeOrder = exports.createOrder = exports.deleteCart = exports.storeStripeCustomerId = exports.getStripeCustomerId = exports.PRODUCT_COLLECTION = exports.ORDER_COLLECTION = exports.CART_COLLECTION = exports.CUSTOMERS_COLLECTION = void 0;
const admin = require("firebase-admin");
const CommonUtils_1 = require("./CommonUtils");
exports.CUSTOMERS_COLLECTION = 'customers';
exports.CART_COLLECTION = 'cart';
exports.ORDER_COLLECTION = 'orders';
exports.PRODUCT_COLLECTION = 'product';
async function getProducts(ids) {
    const products = await admin
        .firestore()
        .collection(exports.PRODUCT_COLLECTION)
        .where('id', 'in', ids)
        .get();
    return products.docs.map((doc) => doc.data());
}
const getCart = async (user) => {
    const cartCollection = admin
        .firestore()
        .collection(exports.CUSTOMERS_COLLECTION)
        .doc(user.uid)
        .collection(exports.CART_COLLECTION);
    const cartsFir = await cartCollection.get();
    const cart = cartsFir.docs.map((doc) => doc.data());
    return { cart, cartCollection };
};
const getStripeCustomerId = async (user) => {
    const customer = await admin
        .firestore()
        .collection(exports.CUSTOMERS_COLLECTION)
        .doc(user.uid)
        .get();
    return customer.data();
};
exports.getStripeCustomerId = getStripeCustomerId;
const storeStripeCustomerId = async (customerId, userUid) => {
    await admin.firestore().collection(exports.CUSTOMERS_COLLECTION).doc(userUid).set({
        customer_id: customerId,
    });
};
exports.storeStripeCustomerId = storeStripeCustomerId;
const deleteCart = async (userUid) => {
    const snapshot = await admin
        .firestore()
        .collection(exports.CUSTOMERS_COLLECTION)
        .doc(userUid)
        .collection(exports.CART_COLLECTION)
        .get();
    snapshot.docs.forEach((doc) => {
        doc.ref.delete();
    });
};
exports.deleteCart = deleteCart;
const createOrder = (cart, paymentId, userUid, amount) => {
    const order = admin.firestore().collection(exports.ORDER_COLLECTION).doc(paymentId);
    order.set({ user_uid: userUid, status: 'initiated', amount: amount });
    const orderCart = order.collection(exports.CART_COLLECTION);
    cart.forEach((product) => {
        orderCart
            .doc(product.id.toString())
            .set({ price: product.price, count: product.count });
    });
};
exports.createOrder = createOrder;
const completeOrder = async (paymentId) => {
    const order = admin.firestore().collection(exports.ORDER_COLLECTION).doc(paymentId);
    order.update({ status: 'Success' });
    const userUid = await (await order.get()).data().user_uid;
    await (0, exports.deleteCart)(userUid);
};
exports.completeOrder = completeOrder;
const getAmountAndCart = async (user) => {
    const { cart } = await getCart(user);
    const products = await getProducts(cart.map((data) => data.id));
    const combinedCart = (0, CommonUtils_1.getCombinedArray)(cart, products);
    return { amount: (0, CommonUtils_1.getPrice)(combinedCart), cart: combinedCart };
};
exports.getAmountAndCart = getAmountAndCart;
//# sourceMappingURL=FirestoreUtils.js.map