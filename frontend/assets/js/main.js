const featuredContainer = document.querySelector("#featured-products");

function productCard(product) {
  return `
    <article class="product-card">
      <a href="product-detail.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" />
      </a>
      <div class="content">
        <h3>${product.name}</h3>
        <p class="price">${formatPrice(product.price)}</p>
        <a class="btn" href="product-detail.html?id=${product.id}">Xem chi tiết</a>
      </div>
    </article>
  `;
}

if (featuredContainer) {
  featuredContainer.innerHTML = products.slice(0, 4).map(productCard).join("");
}
