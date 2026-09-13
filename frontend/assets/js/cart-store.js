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

  const product = typeof getProductById === "function" ? getProductById(productId) : null;
  const productName = product ? product.name : "Sản phẩm";
  showToast(`Đã thêm "${productName}" (Size ${size}) vào giỏ hàng!`, "success");
}

function updateCartItemQuantity(productId, size, delta) {
  const cartItems = readCart();
  const itemIndex = cartItems.findIndex((item) => item.productId === productId && item.size === size);

  if (itemIndex > -1) {
    cartItems[itemIndex].quantity += delta;
    if (cartItems[itemIndex].quantity <= 0) {
      cartItems.splice(itemIndex, 1);
      showToast("Đã xóa sản phẩm khỏi giỏ hàng", "info");
    }
    saveCart(cartItems);
    updateCartCount();
  }
}

function removeFromCart(productId, size) {
  const nextItems = readCart().filter((item) => item.productId !== productId || item.size !== size);
  saveCart(nextItems);
  updateCartCount();
  showToast("Đã xóa sản phẩm khỏi giỏ hàng", "info");
}

function clearCart() {
  saveCart([]);
  updateCartCount();
}

function updateCartCount() {
  const cartBadges = document.querySelectorAll("[data-cart-count]");
  const totalItems = readCart().reduce((sum, item) => sum + item.quantity, 0);

  cartBadges.forEach((badge) => {
    badge.textContent = totalItems;
    badge.classList.remove("bump");
    // Trigger reflow for animation restart
    void badge.offsetWidth;
    if (totalItems > 0) {
      badge.classList.add("bump");
    }
  });
}

function showToast(message, type = "success") {
  let toastContainer = document.querySelector("#toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
  if (type === "info") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
