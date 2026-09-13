const express = require("express");

const router = express.Router();

const sampleProducts = [
  { id: 1, name: "Áo sơ mi linen", category: "Áo", price: 499000, stock: 42 },
  { id: 2, name: "Quần tây slim", category: "Quần", price: 649000, stock: 18 },
  { id: 3, name: "Váy midi satin", category: "Váy", price: 799000, stock: 24 }
];

router.get("/", (req, res) => {
  res.json({ success: true, data: sampleProducts });
});

router.get("/:id", (req, res) => {
  const product = sampleProducts.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
  }

  return res.json({ success: true, data: product });
});

module.exports = router;
