const products = [
  {
    id: 1,
    name: "Áo sơ mi linen",
    category: "ao",
    price: 499000,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
    description: "Áo sơ mi linen thoáng nhẹ, phom regular fit, phù hợp đi làm và dạo phố."
  },
  {
    id: 2,
    name: "Quần tây slim",
    category: "quan",
    price: 649000,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    description: "Quần tây dáng slim, chất vải đứng phom và dễ phối với áo sơ mi hoặc áo thun."
  },
  {
    id: 3,
    name: "Váy midi satin",
    category: "vay",
    price: 799000,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    description: "Váy midi satin mềm mại, tạo chuyển động nhẹ và vẻ ngoài thanh lịch."
  },
  {
    id: 4,
    name: "Túi đeo vai da",
    category: "phu-kien",
    price: 459000,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    description: "Túi đeo vai nhỏ gọn, đủ chỗ cho vật dụng hằng ngày."
  }
];

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND"
});

function formatPrice(value) {
  return currency.format(value).replace(/\s₫/, "đ");
}

function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}
