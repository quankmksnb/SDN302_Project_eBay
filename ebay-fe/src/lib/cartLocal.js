export const getCartLocal = () => {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
};

export const saveCartLocal = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

export const addToCartLocal = (product, quantity = 1) => {
  const cart = getCartLocal();
  const index = cart.findIndex((p) => p.productId === product._id);
  if (index > -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  }
  saveCartLocal(cart);
};
