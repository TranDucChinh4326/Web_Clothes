const detailContainer = document.querySelector("#product-detail");
const params = new URLSearchParams(window.location.search);
const product = getProductById(params.get("id")) || products[0];

detailContainer.innerHTML = `
  <img src="${product.image}" alt="${product.name}" />
  <section>
    <p class="eyebrow">Clothique Selection</p>
    <h1>${product.name}</h1>
    <p class="price">${formatPrice(product.price)}</p>
    <p>${product.description}</p>
    <label>Kích cỡ
      <select id="size-select">
        <option>S</option>
        <option>M</option>
        <option>L</option>
        <option>XL</option>
      </select>
    </label>
    <button class="btn primary full" id="add-to-cart" type="button">Thêm vào giỏ hàng</button>
    <p class="notice" id="cart-notice" aria-live="polite"></p>
  </section>
`;

document.querySelector("#add-to-cart").addEventListener("click", () => {
  const size = document.querySelector("#size-select").value;
  addToCart(product.id, size, 1);

  const notice = document.querySelector("#cart-notice");
  notice.textContent = "Đã thêm sản phẩm vào giỏ hàng.";
  notice.className = "notice success";
});
