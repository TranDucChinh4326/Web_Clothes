const productList = document.querySelector("#product-list");
const categoryPills = document.querySelectorAll(".filter-pill");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const emptyState = document.querySelector("#empty-state");
const resetFilterBtn = document.querySelector("#reset-filter-btn");
const productCountLabel = document.querySelector("#product-count-label");

let activeCategory = "all";
let searchQuery = "";
let sortMode = "featured";

// Check URL query param for category
const urlParams = new URLSearchParams(window.location.search);
const paramCategory = urlParams.get("category");
if (paramCategory) {
  activeCategory = paramCategory;
  categoryPills.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === activeCategory);
  });
}

function renderProductList() {
  let filtered = [...products];

  // 1. Filter by category
  if (activeCategory !== "all") {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }

  // 2. Filter by search query
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // 3. Sort
  if (sortMode === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortMode === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortMode === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Update counter label
  if (productCountLabel) {
    productCountLabel.textContent = `Hiá»ƒn thá»‹ ${filtered.length} sáº£n pháº©m phÃ¹ há»£p`;
  }

  if (filtered.length === 0) {
    productList.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  productList.innerHTML = filtered.map((product) => {
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
          <button class="quick-add-btn" type="button" data-quick-add="${product.id}">
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
  }).join("");
}

// Category filter
categoryPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    categoryPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.dataset.category;
    renderProductList();
  });
});

// Search filter
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProductList();
  });
}

// Sort filter
if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    sortMode = e.target.value;
    renderProductList();
  });
}

// Reset filter
if (resetFilterBtn) {
  resetFilterBtn.addEventListener("click", () => {
    activeCategory = "all";
    searchQuery = "";
    sortMode = "featured";
    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "featured";
    categoryPills.forEach((p) => p.classList.toggle("active", p.dataset.category === "all"));
    renderProductList();
  });
}

// Quick add to cart
if (productList) {
  productList.addEventListener("click", (event) => {
    const quickAddBtn = event.target.closest("[data-quick-add]");
    if (quickAddBtn) {
      event.preventDefault();
      const productId = Number(quickAddBtn.dataset.quickAdd);
      addToCart(productId, "M", 1);
    }
  });
}

// Initial render
renderProductList();
