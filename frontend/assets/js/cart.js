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
        <h3 style="font-size: 18px; margin-bottom: 8px;">Giá» hÃ ng cá»§a báº¡n Ä‘ang trá»‘ng</h3>
        <p style="color: var(--muted); font-size: 14px; margin-bottom: 24px;">HÃ£y khÃ¡m phÃ¡ cÃ¡c thiáº¿t káº¿ má»›i nháº¥t cá»§a Clothique Ä‘á»ƒ chá»n trang phá»¥c Æ°ng Ã½ nhÃ©.</p>
        <a class="btn primary" href="products.html">KhÃ¡m phÃ¡ sáº£n pháº©m</a>
      </div>
    `;

    if (subtotalContainer) subtotalContainer.textContent = formatPrice(0);
    if (shippingContainer) shippingContainer.textContent = formatPrice(0);
    if (totalContainer) totalContainer.textContent = formatPrice(0);
    if (shippingProgressFill) shippingProgressFill.style.width = "0%";
    if (shippingProgressText) shippingProgressText.textContent = "Mua thÃªm Ä‘á»ƒ nháº­n Æ°u Ä‘Ã£i giao hÃ ng miá»…n phÃ­";
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
      name: "Sáº£n pháº©m",
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
          <p class="cart-item-meta">Size: <strong style="color: var(--ink);">${item.size}</strong> â€¢ ÄÆ¡n giÃ¡: ${formatPrice(product.price)}</p>
          <div class="cart-item-stepper">
            <div class="quantity-stepper">
              <button type="button" data-delta="-1" data-id="${item.productId}" data-size="${item.size}">âˆ’</button>
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
            XÃ³a
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
      shippingProgressText.innerHTML = `ðŸŽ‰ Tuyá»‡t vá»i! Báº¡n Ä‘Ã£ Ä‘á»§ Ä‘iá»u kiá»‡n nháº­n <strong>Miá»…n phÃ­ váº­n chuyá»ƒn</strong>!`;
    } else {
      const remaining = 500000 - subtotal;
      shippingProgressText.innerHTML = `Mua thÃªm <strong>${formatPrice(remaining)}</strong> Ä‘á»ƒ Ä‘Æ°á»£c <strong>Miá»…n phÃ­ váº­n chuyá»ƒn toÃ n quá»‘c</strong>!`;
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
  if (shippingContainer) shippingContainer.textContent = isFreeShip ? "Miá»…n phÃ­" : formatPrice(shippingFee);
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
    if (confirm("Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n lÃ m trá»‘ng giá» hÃ ng?")) {
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
      showToast("Ãp dá»¥ng mÃ£ Æ°u Ä‘Ã£i CLOTHIQUE10 thÃ nh cÃ´ng (-10%)!", "success");
      renderCart();
    } else if (code === "") {
      showToast("Vui lÃ²ng nháº­p mÃ£ giáº£m giÃ¡", "info");
    } else {
      showToast("MÃ£ giáº£m giÃ¡ khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n", "error");
    }
  });
}

renderCart();
