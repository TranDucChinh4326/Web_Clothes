const featuredContainer = document.querySelector("#featured-products");

function createProductCardHTML(product) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const tagClass = product.tag === "BÃ¡n cháº¡y" || product.tag === "Hot deal" ? "tag-hot" : "tag-new";

  const colorsHTML = product.colors && product.colors.length
    ? `<div class="color-dots">${product.colors.map(c => `<span class="color-dot" style="background-color: ${c}"></span>`).join("")}</div>`
    : "";

  return `
    <article class="product-card">
      <div class="product-thumb-wrap">
        <span class="product-tag ${tagClass}">${product.tag || "Má»›i"}</span>
        <a href="product-detail.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </a>
        <button class="quick-add-btn" type="button" data-quick-add="${product.id}" title="ThÃªm nhanh vÃ o giá» hÃ ng">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          ThÃªm nhanh
        </button>
      </div>

      <div class="product-content">
        <span class="product-category">${product.categoryName || "Thá»i trang"}</span>
        <a href="product-detail.html?id=${product.id}">
          <h3 class="product-title">${product.name}</h3>
        </a>

        <div class="product-rating">
          <span class="stars">â˜…â˜…â˜…â˜…â˜…</span>
          <span>${product.rating || "5.0"} (${product.reviewsCount || 40})</span>
        </div>

        <div class="product-price-row">
          <span class="price">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ""}
          ${discountPercent > 0 ? `<span class="discount-badge">-${discountPercent}%</span>` : ""}
        </div>

        ${colorsHTML}
      </div>
    </article>
  `;
}

if (featuredContainer && typeof products !== "undefined") {
  featuredContainer.innerHTML = products.slice(0, 4).map(createProductCardHTML).join("");

  featuredContainer.addEventListener("click", (event) => {
    const quickAddBtn = event.target.closest("[data-quick-add]");
    if (quickAddBtn) {
      event.preventDefault();
      const productId = Number(quickAddBtn.dataset.quickAdd);
      addToCart(productId, "M", 1);
    }
  });
}
