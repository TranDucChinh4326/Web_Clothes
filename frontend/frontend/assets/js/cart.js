const cartContainer = document.querySelector("#cart-items");
const totalContainer = document.querySelector("#cart-total");

function renderCart() {
  const cartItems = readCart();
  let total = 0;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p>Giỏ hàng đang trống.</p>";
    totalContainer.textContent = formatPrice(0);
    return;
  }

  cartContainer.innerHTML = cartItems.map((item) => {
    const product = getProductById(item.productId);
    const lineTotal = product.price * item.quantity;
    total += lineTotal;

    return `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong>
          <p>Size ${item.size} · Số lượng ${item.quantity}</p>
        </div>
        <div class="cart-actions">
          <strong>${formatPrice(lineTotal)}</strong>
          <button class="btn" type="button" data-remove="${item.productId}" data-size="${item.size}">Xóa</button>
        </div>
      </div>
    `;
  }).join("");

  totalContainer.textContent = formatPrice(total);
}

cartContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");

  if (!removeButton) {
    return;
  }

  removeFromCart(Number(removeButton.dataset.remove), removeButton.dataset.size);
  renderCart();
});

renderCart();
