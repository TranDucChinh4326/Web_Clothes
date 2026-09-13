const checkoutForm = document.querySelector("#checkout-form");
const orderNotice = document.querySelector("#order-notice");
const previewContainer = document.querySelector("#checkout-items-preview");
const subtotalEl = document.querySelector("#checkout-subtotal");
const shippingEl = document.querySelector("#checkout-shipping");
const totalEl = document.querySelector("#checkout-total");
const paymentCards = document.querySelectorAll(".payment-method-card");

function renderCheckoutPreview() {
  const cartItems = readCart();
  let subtotal = 0;

  if (cartItems.length === 0) {
    if (previewContainer) {
      previewContainer.innerHTML = "<p style='color: var(--muted); font-size: 14px;'>Giỏ hàng đang trống.</p>";
    }
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (shippingEl) shippingEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }

  if (previewContainer) {
    previewContainer.innerHTML = cartItems.map((item) => {
      const product = getProductById(item.productId) || {
        name: "Sản phẩm",
        price: 0,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80"
      };

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      return `
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--line-light);">
          <img src="${product.image}" alt="${product.name}" style="width: 48px; height: 60px; object-fit: cover; border-radius: var(--radius-xs);" />
          <div style="flex-grow: 1;">
            <p style="font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 2px;">${product.name}</p>
            <span style="font-size: 12px; color: var(--muted);">Size: ${item.size} × ${item.quantity}</span>
          </div>
          <span style="font-size: 13px; font-weight: 700; color: var(--ink);">${formatPrice(lineTotal)}</span>
        </div>
      `;
    }).join("");
  }

  const isFreeShip = subtotal >= 500000;
  const shippingFee = isFreeShip ? 0 : 30000;
  const total = subtotal + shippingFee;

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = isFreeShip ? "Miễn phí" : formatPrice(shippingFee);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

// Payment method card selection
paymentCards.forEach((card) => {
  card.addEventListener("click", () => {
    paymentCards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    const radio = card.querySelector("input[type='radio']");
    if (radio) radio.checked = true;
  });
});

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const cartItems = readCart();

    if (cartItems.length === 0) {
      orderNotice.textContent = "Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi đặt hàng.";
      orderNotice.className = "notice error";
      showToast("Giỏ hàng đang trống. Vui lòng chọn sản phẩm!", "error");
      return;
    }

    const orderId = `CL${Date.now().toString().slice(-8)}`;
    clearCart();
    renderCheckoutPreview();
    checkoutForm.reset();

    orderNotice.innerHTML = `
      <div style="background: var(--success-bg); border: 1px solid #bbf7d0; border-radius: var(--radius-sm); padding: 16px; margin-top: 16px;">
        <h4 style="color: #166534; font-size: 16px; font-weight: 700; margin-bottom: 6px;">🎉 Đặt hàng thành công!</h4>
        <p style="color: #15803d; font-size: 13px; margin-bottom: 12px;">Mã đơn hàng của bạn là <strong>#${orderId}</strong>. Nhân viên chăm sóc khách hàng của Clothique sẽ liên hệ xác nhận trong ít phút.</p>
        <a href="index.html" class="btn primary" style="min-height: 38px; font-size: 13px;">Tiếp tục mua sắm</a>
      </div>
    `;
    orderNotice.className = "notice";
    showToast("Chúc mừng! Bạn đã đặt hàng thành công.", "success");
  });
}

renderCheckoutPreview();
