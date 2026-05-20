const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const getProduct = require("./routes/Product/get_all");
const getProductByBS = require("./routes/Product/get_by_bestseller");
const getBestSeller = require("./routes/Types/get_bestseller");
const getCategories = require("./routes/Types/get_categories");
const getLinks = require("./routes/get_links");

const authRoutes = require("./routes/auth/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

const errorHandler = require("./middlewares/error.middleware");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Crave Fudge");
});

app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);

app.use(getProduct);
app.use(getProductByBS);
app.use(getBestSeller);
app.use(getCategories);
app.use(getLinks);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
