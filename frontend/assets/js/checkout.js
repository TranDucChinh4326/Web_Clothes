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
      previewContainer.innerHTML = "<p style='color: var(--muted); font-size: 14px;'>Giá» hÃ ng Ä‘ang trá»‘ng.</p>";
    }
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (shippingEl) shippingEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }

  if (previewContainer) {
    previewContainer.innerHTML = cartItems.map((item) => {
      const product = getProductById(item.productId) || {
        name: "Sáº£n pháº©m",
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
            <span style="font-size: 12px; color: var(--muted);">Size: ${item.size} Ã— ${item.quantity}</span>
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
  if (shippingEl) shippingEl.textContent = isFreeShip ? "Miá»…n phÃ­" : formatPrice(shippingFee);
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
      orderNotice.textContent = "Giá» hÃ ng Ä‘ang trá»‘ng. Vui lÃ²ng chá»n sáº£n pháº©m trÆ°á»›c khi Ä‘áº·t hÃ ng.";
      orderNotice.className = "notice error";
      showToast("Giá» hÃ ng Ä‘ang trá»‘ng. Vui lÃ²ng chá»n sáº£n pháº©m!", "error");
      return;
    }

    const orderId = `CL${Date.now().toString().slice(-8)}`;
    clearCart();
    renderCheckoutPreview();
    checkoutForm.reset();

    orderNotice.innerHTML = `
      <div style="background: var(--success-bg); border: 1px solid #bbf7d0; border-radius: var(--radius-sm); padding: 16px; margin-top: 16px;">
        <h4 style="color: #166534; font-size: 16px; font-weight: 700; margin-bottom: 6px;">ðŸŽ‰ Äáº·t hÃ ng thÃ nh cÃ´ng!</h4>
        <p style="color: #15803d; font-size: 13px; margin-bottom: 12px;">MÃ£ Ä‘Æ¡n hÃ ng cá»§a báº¡n lÃ  <strong>#${orderId}</strong>. NhÃ¢n viÃªn chÄƒm sÃ³c khÃ¡ch hÃ ng cá»§a Clothique sáº½ liÃªn há»‡ xÃ¡c nháº­n trong Ã­t phÃºt.</p>
        <a href="index.html" class="btn primary" style="min-height: 38px; font-size: 13px;">Tiáº¿p tá»¥c mua sáº¯m</a>
      </div>
    `;
    orderNotice.className = "notice";
    showToast("ChÃºc má»«ng! Báº¡n Ä‘Ã£ Ä‘áº·t hÃ ng thÃ nh cÃ´ng.", "success");
  });
}

renderCheckoutPreview();
