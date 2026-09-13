const productList = document.querySelector("#product-list");
const categoryFilter = document.querySelector("#category-filter");

function renderProducts(category = "all") {
  const filteredProducts = category === "all"
    ? products
    : products.filter((product) => product.category === category);

  productList.innerHTML = filteredProducts.map((product) => `
    <article class="product-card">
      <a href="product-detail.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" />
      </a>
      <div class="content">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${formatPrice(product.price)}</p>
        <a class="btn" href="product-detail.html?id=${product.id}">Xem chi tiết</a>
      </div>
    </article>
  `).join("");
}

categoryFilter.addEventListener("change", (event) => {
  renderProducts(event.target.value);
});

renderProducts();
