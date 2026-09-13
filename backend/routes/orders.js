const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  const { customer_name, phone, address, items } = req.body;

  if (!customer_name || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin đặt hàng." });
  }

  return res.status(201).json({
    success: true,
    data: {
      order_code: `CL${Date.now()}`,
      status: "pending"
    }
  });
});

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, order_code: "CL2026091301", customer_name: "Nguyễn Minh Anh", status: "pending", total: 1248000 }
    ]
  });
});

module.exports = router;
