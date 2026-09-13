const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đủ thông tin đăng ký." });
  }

  return res.status(201).json({
    success: true,
    data: { id: Date.now(), name, email }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu." });
  }

  return res.json({
    success: true,
    data: { token: "demo-token", user: { id: 1, name: "Demo User", email } }
  });
});

module.exports = router;
