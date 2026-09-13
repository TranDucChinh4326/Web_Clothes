const products = [
  {
    id: 1,
    name: "Áo sơ mi linen cổ trụ",
    category: "ao",
    categoryName: "Áo sơ mi",
    price: 499000,
    originalPrice: 650000,
    rating: 4.9,
    reviewsCount: 128,
    tag: "Bán chạy",
    colors: ["#E8DFD8", "#2C3E50", "#FFFFFF"],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
    description: "Áo sơ mi linen cao cấp dệt từ 100% sợi lanh tự nhiên, thoáng mát, phom regular fit chuẩn mực tôn dáng cho cả môi trường công sở lẫn dạo phố cuối tuần.",
    features: [
      "100% sợi Linen tự nhiên được xử lý chống co rút",
      "Khuy xà cừ khắc chìm logo Clothique tinh tế",
      "Đường may cuộn chỉ đôi chắc chắn, chống sờn rách",
      "Thoáng khí gấp 3 lần cotton thông thường"
    ]
  },
  {
    id: 2,
    name: "Quần tây xếp ly dáng suông",
    category: "quan",
    categoryName: "Quần âu",
    price: 649000,
    originalPrice: 820000,
    rating: 4.8,
    reviewsCount: 94,
    tag: "Xu hướng",
    colors: ["#1E293B", "#8C7B6B", "#0F172A"],
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    description: "Quần tây thiết kế đường xếp ly đôi tạo độ rũ tự nhiên, cạp cao tôn dáng và chất vải tuýt-si nhập khẩu không nhăn, giữ phom hoàn hảo cả ngày dài.",
    features: [
      "Vải Tuýt-si pha sợi co giãn nhẹ chống nhăn tối đa",
      "Cạp phối tăng đơ thông minh tinh chỉnh 2-4cm",
      "Túi xẻ chéo sâu tiện lợi và túi hậu khuy cài an toàn",
      "Dáng Relaxed Slim thời thượng phù hợp nhiều vóc dáng"
    ]
  },
  {
    id: 3,
    name: "Váy đầm midi lụa satin",
    category: "vay",
    categoryName: "Váy thiết kế",
    price: 799000,
    originalPrice: 990000,
    rating: 5.0,
    reviewsCount: 86,
    tag: "Mới về",
    colors: ["#C5A880", "#1C1917", "#9E2A2B"],
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    description: "Váy midi lụa satin dệt chéo tạo hiệu ứng ánh ngọc trai quyến rũ, thiết kế cổ yếm hiện đại kết hợp đường cắt xéo vạt tôn đường cong thanh lịch.",
    features: [
      "Lụa Satin dệt sợi mịn cao cấp, mềm mượt lướt trên da",
      "Kỹ thuật may vạt xéo bias-cut ôm nhẹ tự nhiên",
      "Khóa kéo ẩn YKK đồng màu lưng váy liền mạch",
      "Phù hợp tiệc tối sang trọng lẫn dạ hội nhẹ nhàng"
    ]
  },
  {
    id: 4,
    name: "Túi xách da Crossbody cao cấp",
    category: "phu-kien",
    categoryName: "Phụ kiện da",
    price: 549000,
    originalPrice: 690000,
    rating: 4.9,
    reviewsCount: 152,
    tag: "Hot deal",
    colors: ["#3D2314", "#0F172A", "#D4A373"],
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    description: "Túi xách đeo chéo chất liệu da Microfiber hạt vân mịn bền bỉ gấp 2 lần da thật, khóa hợp kim mạ vàng champagne chống oxy hóa.",
    features: [
      "Chất liệu da Microfiber thân thiện môi trường, chống thấm nước",
      "Khóa nam châm hít chắc chắn mạ tĩnh điện cao cấp",
      "Dây đeo tùy chỉnh linh hoạt từ đeo vai sang đeo chéo",
      "Kích thước 22x15x7cm đựng vừa điện thoại, ví tiền và mỹ phẩm"
    ]
  },
  {
    id: 5,
    name: "Áo Blazer Wool Blend hiện đại",
    category: "ao",
    categoryName: "Áo khoác",
    price: 1190000,
    originalPrice: 1450000,
    rating: 4.9,
    reviewsCount: 73,
    tag: "Đặc quyền",
    colors: ["#334155", "#475569", "#E2E8F0"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    description: "Áo khoác Blazer phom oversize hiện đại phối ve nhọn cổ điển, chất liệu len pha mỏng nhẹ phù hợp thời tiết giao mùa bốn mùa trong năm.",
    features: [
      "Thành phần len tự nhiên pha sợi chống xù lông",
      "Lớp lót lụa habutai êm ái thoáng khí",
      "Đệm vai tự nhiên mềm mại định hình phom chuẩn",
      "Túi mổ hai bên và túi ngực đa năng"
    ]
  },
  {
    id: 6,
    name: "Quần Shorts Linen lưng thun",
    category: "quan",
    categoryName: "Quần thời trang",
    price: 420000,
    originalPrice: 520000,
    rating: 4.7,
    reviewsCount: 65,
    tag: "Ưu đãi",
    colors: ["#F5F5F0", "#264653", "#E76F51"],
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80",
    description: "Quần shorts linen phối dây rút năng động, phom rộng rãi tạo cảm giác thoải mái tối đa cho những chuyến du lịch nghỉ dưỡng hoặc ngày hè năng động.",
    features: [
      "Vải lanh tự nhiên giặt mềm pre-washed",
      "Lưng thun co giãn kết hợp dây rút kim loại bền đẹp",
      "Túi sườn sâu tiện ích đựng vừa smartphone màn hình lớn",
      "Độ dài vừa chạm gối trẻ trung, thanh lịch"
    ]
  },
  {
    id: 7,
    name: "Váy dệt kim cổ tim dập gân",
    category: "vay",
    categoryName: "Váy len dệt",
    price: 720000,
    originalPrice: 890000,
    rating: 4.8,
    reviewsCount: 47,
    tag: "Mới về",
    colors: ["#2B2D42", "#8D99AE", "#EDF2F4"],
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80",
    description: "Váy dệt kim rib knit co giãn mềm mại, cổ tim khoét sâu vừa phải tạo điểm nhấn xương quai xanh quyến rũ cùng đường xẻ tà sườn gợi cảm.",
    features: [
      "Sợi dệt kim Viscose mềm mại, co giãn đàn hồi 4 chiều",
      "Cấu trúc dập gân dọc thị giác giúp vóc dáng thon gọn",
      "Độ giữ nhiệt nhẹ nhàng, không gây kích ứng da",
      "Đường xẻ tà bên hông tạo bước đi nhẹ nhàng thanh thoát"
    ]
  },
  {
    id: 8,
    name: "Kính râm gọng kim loại Retro",
    category: "phu-kien",
    categoryName: "Kính mắt",
    price: 390000,
    originalPrice: 480000,
    rating: 4.9,
    reviewsCount: 110,
    tag: "Hot deal",
    colors: ["#E5B25D", "#111111", "#A0AEC0"],
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    description: "Kính râm gọng hợp kim titan thanh mảnh mang phong cách vintage cổ điển, tròng kính tráng gương phân cực chống tia cực tím UV400 tuyệt đối.",
    features: [
      "Tròng kính Polarized phân cực loại bỏ ánh sáng chói",
      "Bảo vệ 100% khỏi tia bức xạ UVA / UVB 400",
      "Gọng hợp kim siêu nhẹ chỉ 22g đeo cả ngày không hằn sống mũi",
      "Đi kèm bao da cao cấp và khăn lau sợi microfiber chuyên dụng"
    ]
  }
];

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND"
});

function formatPrice(value) {
  return currency.format(value).replace(/\s?₫/, "₫");
}

function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}
