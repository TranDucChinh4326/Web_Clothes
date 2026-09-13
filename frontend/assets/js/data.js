const products = [
  {
    id: 1,
    name: "Ão sÆ¡ mi linen cá»• trá»¥",
    category: "ao",
    categoryName: "Ão sÆ¡ mi",
    price: 499000,
    originalPrice: 650000,
    rating: 4.9,
    reviewsCount: 128,
    tag: "BÃ¡n cháº¡y",
    colors: ["#E8DFD8", "#2C3E50", "#FFFFFF"],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
    description: "Ão sÆ¡ mi linen cao cáº¥p dá»‡t tá»« 100% sá»£i lanh tá»± nhiÃªn, thoÃ¡ng mÃ¡t, phom regular fit chuáº©n má»±c tÃ´n dÃ¡ng cho cáº£ mÃ´i trÆ°á»ng cÃ´ng sá»Ÿ láº«n dáº¡o phá»‘ cuá»‘i tuáº§n.",
    features: [
      "100% sá»£i Linen tá»± nhiÃªn Ä‘Æ°á»£c xá»­ lÃ½ chá»‘ng co rÃºt",
      "Khuy xÃ  cá»« kháº¯c chÃ¬m logo Clothique tinh táº¿",
      "ÄÆ°á»ng may cuá»™n chá»‰ Ä‘Ã´i cháº¯c cháº¯n, chá»‘ng sá»n rÃ¡ch",
      "ThoÃ¡ng khÃ­ gáº¥p 3 láº§n cotton thÃ´ng thÆ°á»ng"
    ]
  },
  {
    id: 2,
    name: "Quáº§n tÃ¢y xáº¿p ly dÃ¡ng suÃ´ng",
    category: "quan",
    categoryName: "Quáº§n Ã¢u",
    price: 649000,
    originalPrice: 820000,
    rating: 4.8,
    reviewsCount: 94,
    tag: "Xu hÆ°á»›ng",
    colors: ["#1E293B", "#8C7B6B", "#0F172A"],
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    description: "Quáº§n tÃ¢y thiáº¿t káº¿ Ä‘Æ°á»ng xáº¿p ly Ä‘Ã´i táº¡o Ä‘á»™ rÅ© tá»± nhiÃªn, cáº¡p cao tÃ´n dÃ¡ng vÃ  cháº¥t váº£i tuÃ½t-si nháº­p kháº©u khÃ´ng nhÄƒn, giá»¯ phom hoÃ n háº£o cáº£ ngÃ y dÃ i.",
    features: [
      "Váº£i TuÃ½t-si pha sá»£i co giÃ£n nháº¹ chá»‘ng nhÄƒn tá»‘i Ä‘a",
      "Cáº¡p phá»‘i tÄƒng Ä‘Æ¡ thÃ´ng minh tinh chá»‰nh 2-4cm",
      "TÃºi xáº» chÃ©o sÃ¢u tiá»‡n lá»£i vÃ  tÃºi háº­u khuy cÃ i an toÃ n",
      "DÃ¡ng Relaxed Slim thá»i thÆ°á»£ng phÃ¹ há»£p nhiá»u vÃ³c dÃ¡ng"
    ]
  },
  {
    id: 3,
    name: "VÃ¡y Ä‘áº§m midi lá»¥a satin",
    category: "vay",
    categoryName: "VÃ¡y thiáº¿t káº¿",
    price: 799000,
    originalPrice: 990000,
    rating: 5.0,
    reviewsCount: 86,
    tag: "Má»›i vá»",
    colors: ["#C5A880", "#1C1917", "#9E2A2B"],
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    description: "VÃ¡y midi lá»¥a satin dá»‡t chÃ©o táº¡o hiá»‡u á»©ng Ã¡nh ngá»c trai quyáº¿n rÅ©, thiáº¿t káº¿ cá»• yáº¿m hiá»‡n Ä‘áº¡i káº¿t há»£p Ä‘Æ°á»ng cáº¯t xÃ©o váº¡t tÃ´n Ä‘Æ°á»ng cong thanh lá»‹ch.",
    features: [
      "Lá»¥a Satin dá»‡t sá»£i má»‹n cao cáº¥p, má»m mÆ°á»£t lÆ°á»›t trÃªn da",
      "Ká»¹ thuáº­t may váº¡t xÃ©o bias-cut Ã´m nháº¹ tá»± nhiÃªn",
      "KhÃ³a kÃ©o áº©n YKK Ä‘á»“ng mÃ u lÆ°ng vÃ¡y liá»n máº¡ch",
      "PhÃ¹ há»£p tiá»‡c tá»‘i sang trá»ng láº«n dáº¡ há»™i nháº¹ nhÃ ng"
    ]
  },
  {
    id: 4,
    name: "TÃºi xÃ¡ch da Crossbody cao cáº¥p",
    category: "phu-kien",
    categoryName: "Phá»¥ kiá»‡n da",
    price: 549000,
    originalPrice: 690000,
    rating: 4.9,
    reviewsCount: 152,
    tag: "Hot deal",
    colors: ["#3D2314", "#0F172A", "#D4A373"],
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    description: "TÃºi xÃ¡ch Ä‘eo chÃ©o cháº¥t liá»‡u da Microfiber háº¡t vÃ¢n má»‹n bá»n bá»‰ gáº¥p 2 láº§n da tháº­t, khÃ³a há»£p kim máº¡ vÃ ng champagne chá»‘ng oxy hÃ³a.",
    features: [
      "Cháº¥t liá»‡u da Microfiber thÃ¢n thiá»‡n mÃ´i trÆ°á»ng, chá»‘ng tháº¥m nÆ°á»›c",
      "KhÃ³a nam chÃ¢m hÃ­t cháº¯c cháº¯n máº¡ tÄ©nh Ä‘iá»‡n cao cáº¥p",
      "DÃ¢y Ä‘eo tÃ¹y chá»‰nh linh hoáº¡t tá»« Ä‘eo vai sang Ä‘eo chÃ©o",
      "KÃ­ch thÆ°á»›c 22x15x7cm Ä‘á»±ng vá»«a Ä‘iá»‡n thoáº¡i, vÃ­ tiá»n vÃ  má»¹ pháº©m"
    ]
  },
  {
    id: 5,
    name: "Ão Blazer Wool Blend hiá»‡n Ä‘áº¡i",
    category: "ao",
    categoryName: "Ão khoÃ¡c",
    price: 1190000,
    originalPrice: 1450000,
    rating: 4.9,
    reviewsCount: 73,
    tag: "Äáº·c quyá»n",
    colors: ["#334155", "#475569", "#E2E8F0"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    description: "Ão khoÃ¡c Blazer phom oversize hiá»‡n Ä‘áº¡i phá»‘i ve nhá»n cá»• Ä‘iá»ƒn, cháº¥t liá»‡u len pha má»ng nháº¹ phÃ¹ há»£p thá»i tiáº¿t giao mÃ¹a bá»‘n mÃ¹a trong nÄƒm.",
    features: [
      "ThÃ nh pháº§n len tá»± nhiÃªn pha sá»£i chá»‘ng xÃ¹ lÃ´ng",
      "Lá»›p lÃ³t lá»¥a habutai Ãªm Ã¡i thoÃ¡ng khÃ­",
      "Äá»‡m vai tá»± nhiÃªn má»m máº¡i Ä‘á»‹nh hÃ¬nh phom chuáº©n",
      "TÃºi má»• hai bÃªn vÃ  tÃºi ngá»±c Ä‘a nÄƒng"
    ]
  },
  {
    id: 6,
    name: "Quáº§n Shorts Linen lÆ°ng thun",
    category: "quan",
    categoryName: "Quáº§n thá»i trang",
    price: 420000,
    originalPrice: 520000,
    rating: 4.7,
    reviewsCount: 65,
    tag: "Æ¯u Ä‘Ã£i",
    colors: ["#F5F5F0", "#264653", "#E76F51"],
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80",
    description: "Quáº§n shorts linen phá»‘i dÃ¢y rÃºt nÄƒng Ä‘á»™ng, phom rá»™ng rÃ£i táº¡o cáº£m giÃ¡c thoáº£i mÃ¡i tá»‘i Ä‘a cho nhá»¯ng chuyáº¿n du lá»‹ch nghá»‰ dÆ°á»¡ng hoáº·c ngÃ y hÃ¨ nÄƒng Ä‘á»™ng.",
    features: [
      "Váº£i lanh tá»± nhiÃªn giáº·t má»m pre-washed",
      "LÆ°ng thun co giÃ£n káº¿t há»£p dÃ¢y rÃºt kim loáº¡i bá»n Ä‘áº¹p",
      "TÃºi sÆ°á»n sÃ¢u tiá»‡n Ã­ch Ä‘á»±ng vá»«a smartphone mÃ n hÃ¬nh lá»›n",
      "Äá»™ dÃ i vá»«a cháº¡m gá»‘i tráº» trung, thanh lá»‹ch"
    ]
  },
  {
    id: 7,
    name: "VÃ¡y dá»‡t kim cá»• tim dáº­p gÃ¢n",
    category: "vay",
    categoryName: "VÃ¡y len dá»‡t",
    price: 720000,
    originalPrice: 890000,
    rating: 4.8,
    reviewsCount: 47,
    tag: "Má»›i vá»",
    colors: ["#2B2D42", "#8D99AE", "#EDF2F4"],
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80",
    description: "VÃ¡y dá»‡t kim rib knit co giÃ£n má»m máº¡i, cá»• tim khoÃ©t sÃ¢u vá»«a pháº£i táº¡o Ä‘iá»ƒm nháº¥n xÆ°Æ¡ng quai xanh quyáº¿n rÅ© cÃ¹ng Ä‘Æ°á»ng xáº» tÃ  sÆ°á»n gá»£i cáº£m.",
    features: [
      "Sá»£i dá»‡t kim Viscose má»m máº¡i, co giÃ£n Ä‘Ã n há»“i 4 chiá»u",
      "Cáº¥u trÃºc dáº­p gÃ¢n dá»c thá»‹ giÃ¡c giÃºp vÃ³c dÃ¡ng thon gá»n",
      "Äá»™ giá»¯ nhiá»‡t nháº¹ nhÃ ng, khÃ´ng gÃ¢y kÃ­ch á»©ng da",
      "ÄÆ°á»ng xáº» tÃ  bÃªn hÃ´ng táº¡o bÆ°á»›c Ä‘i nháº¹ nhÃ ng thanh thoÃ¡t"
    ]
  },
  {
    id: 8,
    name: "KÃ­nh rÃ¢m gá»ng kim loáº¡i Retro",
    category: "phu-kien",
    categoryName: "KÃ­nh máº¯t",
    price: 390000,
    originalPrice: 480000,
    rating: 4.9,
    reviewsCount: 110,
    tag: "Hot deal",
    colors: ["#E5B25D", "#111111", "#A0AEC0"],
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    description: "KÃ­nh rÃ¢m gá»ng há»£p kim titan thanh máº£nh mang phong cÃ¡ch vintage cá»• Ä‘iá»ƒn, trÃ²ng kÃ­nh trÃ¡ng gÆ°Æ¡ng phÃ¢n cá»±c chá»‘ng tia cá»±c tÃ­m UV400 tuyá»‡t Ä‘á»‘i.",
    features: [
      "TrÃ²ng kÃ­nh Polarized phÃ¢n cá»±c loáº¡i bá» Ã¡nh sÃ¡ng chÃ³i",
      "Báº£o vá»‡ 100% khá»i tia bá»©c xáº¡ UVA / UVB 400",
      "Gá»ng há»£p kim siÃªu nháº¹ chá»‰ 22g Ä‘eo cáº£ ngÃ y khÃ´ng háº±n sá»‘ng mÅ©i",
      "Äi kÃ¨m bao da cao cáº¥p vÃ  khÄƒn lau sá»£i microfiber chuyÃªn dá»¥ng"
    ]
  }
];

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND"
});

function formatPrice(value) {
  return currency.format(value).replace(/\sâ‚«/, "Ä‘");
}

function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}
