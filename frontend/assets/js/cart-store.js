const CART_KEY = "clothique_cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

function addToCart(productId, size = "M", quantity = 1) {
  const cartItems = readCart();
  const existingItem = cartItems.find((item) => item.productId === productId && item.size === size);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({ productId, size, quantity });
  }

  saveCart(cartItems);
  updateCartCount();
}

function removeFromCart(productId, size) {
  const nextItems = readCart().filter((item) => item.productId !== productId || item.size !== size);
  saveCart(nextItems);
  updateCartCount();
}

function clearCart() {
  saveCart([]);
  updateCartCount();
}

function updateCartCount() {
  const cartCount = document.querySelector("[data-cart-count]");

  if (!cartCount) {
    return;
  }

  const totalItems = readCart().reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

document.addEventListener("DOMContentLoaded", updateCartCount);
