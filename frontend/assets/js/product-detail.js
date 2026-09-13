const detailContainer = document.querySelector("#product-detail");
const relatedContainer = document.querySelector("#related-products");
const breadcrumbName = document.querySelector("#breadcrumb-product-name");

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id")) || 1;
const product = getProductById(productId) || products[0];

if (breadcrumbName) {
  breadcrumbName.textContent = product.name;
}
document.title = `${product.name} | Clothique`;

let selectedSize = "M";
let currentQuantity = 1;

function renderDetail() {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const featuresHTML = product.features && product.features.length
    ? `
      <div class="features-list">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 4px; color: var(--ink);">Đặc điểm nổi bật:</h4>
        ${product.features.map(f => `
          <div class="feature-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${f}</span>
          </div>
        `).join("")}
      </div>
    `
    : "";

  const colorsHTML = product.colors && product.colors.length
    ? `
      <div class="selector-group">
        <div class="selector-label">
          <span>Màu sắc:</span>
        </div>
        <div class="color-dots" style="margin-top: 2px;">
          ${product.colors.map((c, i) => `
            <span class="color-dot" style="width: 24px; height: 24px; cursor: pointer; background-color: ${c}; outline: ${i === 0 ? '2px solid var(--ink)' : 'none'}; outline-offset: 2px;"></span>
          `).join("")}
        </div>
      </div>
    `
    : "";

  detailContainer.innerHTML = `
    <div class="detail-layout">
      <!-- Left: Gallery -->
      <div class="detail-gallery">
        <div class="detail-main-image">
          <img src="${product.image}" alt="${product.name}" id="main-product-img" />
        </div>
      </div>

      <!-- Right: Details -->
      <div class="detail-info">
        <div class="detail-header">
          <span class="product-tag tag-new">${product.tag || "Bộ sưu tập mới"}</span>
          <p class="product-category">${product.categoryName || "Thời trang thiết kế"}</p>
          <h1>${product.name}</h1>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span style="font-weight: 600; color: var(--ink);">${product.rating || "5.0"}</span>
            <span>(${product.reviewsCount || 100}+ đánh giá từ khách hàng)</span>
          </div>
        </div>

        <div class="detail-price-box">
          <span class="price">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ""}
          ${discountPercent > 0 ? `<span class="discount-badge">Tiết kiệm ${discountPercent}%</span>` : ""}
        </div>

        <p class="detail-desc">${product.description}</p>

        ${colorsHTML}

        <!-- Size Selector -->
        <div class="selector-group">
          <div class="selector-label">
            <span>Kích cỡ:</span>
            <a href="#" style="color: var(--muted); font-size: 13px; text-decoration: underline;">Bảng hướng dẫn chọn size</a>
          </div>
          <div class="size-options" id="size-options">
            <button type="button" class="size-pill" data-size="S">S</button>
            <button type="button" class="size-pill active" data-size="M">M</button>
            <button type="button" class="size-pill" data-size="L">L</button>
            <button type="button" class="size-pill" data-size="XL">XL</button>
          </div>
        </div>

        <!-- Quantity Stepper -->
        <div class="selector-group">
          <div class="selector-label">
            <span>Số lượng:</span>
          </div>
          <div class="quantity-stepper">
            <button type="button" id="btn-qty-minus">−</button>
            <span id="display-qty">1</span>
            <button type="button" id="btn-qty-plus">+</button>
          </div>
        </div>

        <!-- Actions -->
        <div class="detail-actions">
          <button class="btn secondary lg" id="btn-add-cart" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Thêm vào giỏ hàng
          </button>
          <button class="btn primary lg" id="btn-buy-now" type="button">
            Mua ngay
          </button>
        </div>

        <!-- Product Features List -->
        ${featuresHTML}

        <!-- Service Trust Badges -->
        <div style="border-top: 1px solid var(--line); padding-top: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
          <div style="padding: 12px; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius-sm);">
            <p style="font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 2px;">Miễn phí ship</p>
            <span style="font-size: 12px; color: var(--muted);">Đơn từ 500.000₫</span>
          </div>
          <div style="padding: 12px; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius-sm);">
            <p style="font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 2px;">Đổi trả 30 ngày</p>
            <span style="font-size: 12px; color: var(--muted);">Tận nhà miễn phí</span>
          </div>
          <div style="padding: 12px; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius-sm);">
            <p style="font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 2px;">Đồng kiểm tra</p>
            <span style="font-size: 12px; color: var(--muted);">Ưng ý mới nhận</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach size selector listeners
  const sizePills = detailContainer.querySelectorAll(".size-pill");
  sizePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      sizePills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      selectedSize = pill.dataset.size;
    });
  });

  // Quantity stepper listeners
  const btnMinus = detailContainer.querySelector("#btn-qty-minus");
  const btnPlus = detailContainer.querySelector("#btn-qty-plus");
  const displayQty = detailContainer.querySelector("#display-qty");

  btnMinus.addEventListener("click", () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      displayQty.textContent = currentQuantity;
    }
  });

  btnPlus.addEventListener("click", () => {
    currentQuantity++;
    displayQty.textContent = currentQuantity;
  });

  // Add to cart listener
  detailContainer.querySelector("#btn-add-cart").addEventListener("click", () => {
    addToCart(product.id, selectedSize, currentQuantity);
  });

  // Buy now listener
  detailContainer.querySelector("#btn-buy-now").addEventListener("click", () => {
    addToCart(product.id, selectedSize, currentQuantity);
    window.location.href = "checkout.html";
  });
}

function renderRelatedProducts() {
  if (!relatedContainer) return;
  const relatedList = products.filter(p => p.id !== product.id).slice(0, 4);

  relatedContainer.innerHTML = relatedList.map((item) => {
    const discountPercent = item.originalPrice
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0;

    return `
      <article class="product-card">
        <div class="product-thumb-wrap">
          <span class="product-tag tag-new">${item.tag || "Gợi ý"}</span>
          <a href="product-detail.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </a>
          <button class="quick-add-btn" type="button" data-quick-add="${item.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Thêm nhanh
          </button>
        </div>

        <div class="product-content">
          <span class="product-category">${item.categoryName || "Thời trang"}</span>
          <a href="product-detail.html?id=${item.id}">
            <h3 class="product-title">${item.name}</h3>
          </a>

          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span>${item.rating || "5.0"}</span>
          </div>

          <div class="product-price-row">
            <span class="price">${formatPrice(item.price)}</span>
            ${item.originalPrice ? `<span class="original-price">${formatPrice(item.originalPrice)}</span>` : ""}
            ${discountPercent > 0 ? `<span class="discount-badge">-${discountPercent}%</span>` : ""}
          </div>
        </div>
      </article>
    `;
  }).join("");

  relatedContainer.addEventListener("click", (event) => {
    const quickAddBtn = event.target.closest("[data-quick-add]");
    if (quickAddBtn) {
      event.preventDefault();
      const pId = Number(quickAddBtn.dataset.quickAdd);
      addToCart(pId, "M", 1);
    }
  });
}

renderDetail();
renderRelatedProducts();
