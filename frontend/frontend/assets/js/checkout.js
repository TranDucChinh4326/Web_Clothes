const checkoutForm = document.querySelector("#checkout-form");
const orderNotice = document.querySelector("#order-notice");

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cartItems = readCart();

  if (cartItems.length === 0) {
    orderNotice.textContent = "Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi đặt hàng.";
    orderNotice.className = "notice error";
    return;
  }

  clearCart();
  checkoutForm.reset();
  orderNotice.textContent = "Đặt hàng thành công. Clothique sẽ liên hệ xác nhận trong thời gian sớm nhất.";
  orderNotice.className = "notice success";
});
