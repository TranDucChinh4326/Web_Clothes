const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Không tìm thấy API." });
});

app.listen(port, () => {
  console.log(`Clothique API is running on port ${port}`);
});
