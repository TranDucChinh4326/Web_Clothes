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
    <article class="product-card" data-reveal>
      <div class="product-thumb-wrap">
        <span class="product-tag ${tagClass}">${product.tag || "Má»›i"}</span>
        <a href="product-detail.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </a>
        <div class="card-actions-wrap">
          <button class="card-action-btn quick-view" type="button" data-quick-view="${product.id}" title="Xem nhanh">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Xem nhanh
          </button>
          <button class="card-action-btn quick-add" type="button" data-quick-add="${product.id}" title="ThÃªm vÃ o giá»">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            + Giá» hÃ ng
          </button>
        </div>
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

// Render Featured Products
if (featuredContainer && typeof products !== "undefined") {
  featuredContainer.innerHTML = products.slice(0, 4).map(createProductCardHTML).join("");
}

// Delegation for quick-add and quick-view
document.addEventListener("click", (event) => {
  // Quick Add
  const quickAddBtn = event.target.closest("[data-quick-add]");
  if (quickAddBtn) {
    event.preventDefault();
    const productId = Number(quickAddBtn.dataset.quickAdd);
    addToCart(productId, "M", 1);
    return;
  }

  // Quick View
  const quickViewBtn = event.target.closest("[data-quick-view]");
  if (quickViewBtn) {
    event.preventDefault();
    const productId = Number(quickViewBtn.dataset.quickView);
    openQuickViewModal(productId);
    return;
  }
});

// Quick View Modal System
function openQuickViewModal(productId) {
  const product = typeof getProductById === "function" ? getProductById(productId) : null;
  if (!product) return;

  let modalBackdrop = document.querySelector("#quick-view-backdrop");
  if (!modalBackdrop) {
    modalBackdrop = document.createElement("div");
    modalBackdrop.id = "quick-view-backdrop";
    modalBackdrop.className = "modal-backdrop";
    document.body.appendChild(modalBackdrop);
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  modalBackdrop.innerHTML = `
    <div class="quick-view-modal">
      <button class="modal-close-btn" type="button" aria-label="ÄÃ³ng">&times;</button>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center;">
        <div style="border-radius: var(--radius-md); overflow: hidden; height: 380px; background: var(--line-light);">
          <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div>
          <span class="badge badge-success" style="margin-bottom: 8px;">${product.tag || "Má»›i vá»"}</span>
          <p style="font-size: 13px; color: var(--muted); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">${product.categoryName || "Clothique"}</p>
          <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; line-height: 1.3;">${product.name}</h2>

          <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px;">
            <span style="font-size: 24px; font-weight: 800; color: var(--ink);">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span style="font-size: 15px; color: var(--muted-light); text-decoration: line-through;">${formatPrice(product.originalPrice)}</span>` : ""}
            ${discountPercent > 0 ? `<span class="discount-badge">-${discountPercent}%</span>` : ""}
          </div>

          <p style="font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 18px;">${product.description}</p>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px;">Chá»n kÃ­ch cá»¡:</label>
            <div style="display: flex; gap: 8px;" id="modal-size-select">
              <button type="button" class="size-pill" data-modal-size="S">S</button>
              <button type="button" class="size-pill active" data-modal-size="M">M</button>
              <button type="button" class="size-pill" data-modal-size="L">L</button>
              <button type="button" class="size-pill" data-modal-size="XL">XL</button>
            </div>
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn primary" id="modal-add-btn" style="flex: 1; min-height: 44px; font-size: 14px;" type="button">
              ThÃªm vÃ o giá» hÃ ng
            </button>
            <a href="product-detail.html?id=${product.id}" class="btn secondary" style="min-height: 44px; font-size: 14px;">
              Xem chi tiáº¿t â†—
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Show modal
  requestAnimationFrame(() => {
    modalBackdrop.classList.add("active");
  });

  let chosenSize = "M";
  const sizePills = modalBackdrop.querySelectorAll("[data-modal-size]");
  sizePills.forEach((p) => {
    p.addEventListener("click", () => {
      sizePills.forEach((sp) => sp.classList.remove("active"));
      p.classList.add("active");
      chosenSize = p.dataset.modalSize;
    });
  });

  // Modal Add to Cart
  const modalAddBtn = modalBackdrop.querySelector("#modal-add-btn");
  modalAddBtn.addEventListener("click", () => {
    addToCart(product.id, chosenSize, 1);
    closeModal();
  });

  // Close handlers
  const closeBtn = modalBackdrop.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", closeModal);

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  function closeModal() {
    modalBackdrop.classList.remove("active");
  }
}

// 1. Scroll Reveal Animations with IntersectionObserver
function initScrollReveal() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || revealElements.length === 0) {
    revealElements.forEach(el => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach((el) => observer.observe(el));
}

// 2. Floating Back-to-Top with Circular Scroll Progress
function initBackToTop() {
  let btn = document.querySelector(".back-to-top");
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "LÃªn Ä‘áº§u trang");
    btn.innerHTML = `
      <svg class="progress-ring" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" />
      </svg>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  const circle = btn.querySelector("circle");
  const totalLength = 138; // 2 * PI * 22 approx

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    if (scrollTop > 240) {
      btn.classList.add("active");
      const offset = totalLength - (scrollPercent * totalLength);
      circle.style.strokeDashoffset = offset;
    } else {
      btn.classList.remove("active");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 3. Flash Sale Countdown Timer
function initCountdownTimer() {
  const timerContainer = document.querySelector("#flash-sale-countdown");
  if (!timerContainer) return;

  // Set target to midnight or 8 hours from now
  let endTime = Date.now() + (7 * 3600 + 42 * 60 + 19) * 1000;

  function tick() {
    const diff = Math.max(0, endTime - Date.now());
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const pad = (n) => String(n).padStart(2, "0");

    const hEl = timerContainer.querySelector("[data-countdown-hours]");
    const mEl = timerContainer.querySelector("[data-countdown-mins]");
    const sEl = timerContainer.querySelector("[data-countdown-secs]");

    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);
    if (sEl) sEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initBackToTop();
  initCountdownTimer();
});
