const cartContainer = document.querySelector("#cart-items");
const subtotalContainer = document.querySelector("#cart-subtotal");
const shippingContainer = document.querySelector("#cart-shipping");
const totalContainer = document.querySelector("#cart-total");
const shippingProgressText = document.querySelector("#shipping-progress-text");
const shippingProgressFill = document.querySelector("#shipping-progress-fill");
const btnClearCart = document.querySelector("#btn-clear-cart");
const promoInput = document.querySelector("#promo-code-input");
const btnApplyPromo = document.querySelector("#btn-apply-promo");
const discountRow = document.querySelector("#discount-row");
const discountContainer = document.querySelector("#cart-discount");
const btnCheckout = document.querySelector("#btn-checkout");

let discountRatio = 0; // 0.1 for 10%

function renderCart() {
  const cartItems = readCart();
  let subtotal = 0;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align: center; padding: 48px 16px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--muted-light); margin-bottom: 12px;">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <h3 style="font-size: 18px; margin-bottom: 8px;">Giỏ hàng của bạn đang trống</h3>
        <p style="color: var(--muted); font-size: 14px; margin-bottom: 24px;">Hãy khám phá các thiết kế mới nhất của Clothique để chọn trang phục ưng ý nhé.</p>
        <a class="btn primary" href="products.html">Khám phá sản phẩm</a>
      </div>
    `;

    if (subtotalContainer) subtotalContainer.textContent = formatPrice(0);
    if (shippingContainer) shippingContainer.textContent = formatPrice(0);
    if (totalContainer) totalContainer.textContent = formatPrice(0);
    if (shippingProgressFill) shippingProgressFill.style.width = "0%";
    if (shippingProgressText) shippingProgressText.textContent = "Mua thêm để nhận ưu đãi giao hàng miễn phí";
    if (btnCheckout) {
      btnCheckout.classList.add("disabled");
      btnCheckout.style.pointerEvents = "none";
      btnCheckout.style.opacity = "0.5";
    }
    return;
  }

  if (btnCheckout) {
    btnCheckout.classList.remove("disabled");
    btnCheckout.style.pointerEvents = "auto";
    btnCheckout.style.opacity = "1";
  }

  cartContainer.innerHTML = cartItems.map((item) => {
    const product = getProductById(item.productId) || {
      id: item.productId,
      name: "Sản phẩm",
      price: 0,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80"
    };

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    return `
      <div class="cart-item-row">
        <div class="cart-item-img">
          <a href="product-detail.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}" />
          </a>
        </div>

        <div class="cart-item-info">
          <h4><a href="product-detail.html?id=${product.id}">${product.name}</a></h4>
          <p class="cart-item-meta">Size: <strong style="color: var(--ink);">${item.size}</strong> • Đơn giá: ${formatPrice(product.price)}</p>
          <div class="cart-item-stepper">
            <div class="quantity-stepper">
              <button type="button" data-delta="-1" data-id="${item.productId}" data-size="${item.size}">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-delta="1" data-id="${item.productId}" data-size="${item.size}">+</button>
            </div>
          </div>
        </div>

        <div class="cart-item-price-actions">
          <div class="cart-item-total">${formatPrice(lineTotal)}</div>
          <button class="remove-btn" type="button" data-remove="${item.productId}" data-size="${item.size}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Xóa
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Shipping calculation
  const isFreeShip = subtotal >= 500000;
  const shippingFee = isFreeShip ? 0 : 30000;

  // Free shipping progress
  const progressPercent = Math.min(100, Math.round((subtotal / 500000) * 100));
  if (shippingProgressFill) shippingProgressFill.style.width = `${progressPercent}%`;

  if (shippingProgressText) {
    if (isFreeShip) {
      shippingProgressText.innerHTML = `🎉 Tuyệt vời! Bạn đã đủ điều kiện nhận <strong>Miễn phí vận chuyển</strong>!`;
    } else {
      const remaining = 500000 - subtotal;
      shippingProgressText.innerHTML = `Mua thêm <strong>${formatPrice(remaining)}</strong> để được <strong>Miễn phí vận chuyển toàn quốc</strong>!`;
    }
  }

  // Discount
  const discountAmount = Math.round(subtotal * discountRatio);
  if (discountRow) {
    if (discountRatio > 0) {
      discountRow.style.display = "flex";
      discountContainer.textContent = `-${formatPrice(discountAmount)}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  const finalTotal = subtotal - discountAmount + shippingFee;

  if (subtotalContainer) subtotalContainer.textContent = formatPrice(subtotal);
  if (shippingContainer) shippingContainer.textContent = isFreeShip ? "Miễn phí" : formatPrice(shippingFee);
  if (totalContainer) totalContainer.textContent = formatPrice(finalTotal);
}

// Stepper & remove click handling
if (cartContainer) {
  cartContainer.addEventListener("click", (event) => {
    // Stepper
    const stepperBtn = event.target.closest("[data-delta]");
    if (stepperBtn) {
      const pId = Number(stepperBtn.dataset.id);
      const size = stepperBtn.dataset.size;
      const delta = Number(stepperBtn.dataset.delta);
      updateCartItemQuantity(pId, size, delta);
      renderCart();
      return;
    }

    // Remove
    const removeBtn = event.target.closest("[data-remove]");
    if (removeBtn) {
      const pId = Number(removeBtn.dataset.remove);
      const size = removeBtn.dataset.size;
      removeFromCart(pId, size);
      renderCart();
      return;
    }
  });
}

// Clear cart
if (btnClearCart) {
  btnClearCart.addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn làm trống giỏ hàng?")) {
      clearCart();
      renderCart();
    }
  });
}

// Promo code
if (btnApplyPromo && promoInput) {
  btnApplyPromo.addEventListener("click", () => {
    const code = promoInput.value.trim().toUpperCase();
    if (code === "CLOTHIQUE10") {
      discountRatio = 0.1;
      showToast("Áp dụng mã ưu đãi CLOTHIQUE10 thành công (-10%)!", "success");
      renderCart();
    } else if (code === "") {
      showToast("Vui lòng nhập mã giảm giá", "info");
    } else {
      showToast("Mã giảm giá không hợp lệ hoặc đã hết hạn", "error");
    }
  });
}

renderCart();
