const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const getProduct = require("./routes/Product/get_all");
const getProductByBS = require("./routes/Product/get_by_bestseller");
const getBestSeller = require("./routes/Types/get_bestseller");
const getCategories = require("./routes/Types/get_categories");
const getLinks = require("./routes/get_links");
// import db from "./db.js"
// import response from "./response.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getProduct);
app.use(getProductByBS);
app.use(getBestSeller);
app.use(getCategories);
app.use(getLinks);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Crave Fudge")
})

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server running on http://localhost:3000");
});

// GET all products
// app.get("/products", (req, res) => {
//   db.query("SELECT * FROM products", (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err });
//       return; 
//     }
//     response(200, results, "get all data from products", res)
//   });
// });

// GET all products with best_seller type if available
// app.get("/products_type", (req, res) => {
//   const sql = `
//     SELECT p.*, b.type 
//     FROM products p
//     LEFT JOIN best_seller b 
//     ON p.id = b.product_id
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err });
//       return;
//     }
//     response(200, results, "get all products with best_seller type if exists", res);
//   });
// });


// GET all categories
// app.get("/categories", (req, res) => {
//   db.query("SELECT * FROM categories", (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err });
//       return; 
//     }
//     response(200, results, "get all data from categories", res)
//   });
// });

// GET best sellers
// app.get("/best_seller", (req, res) => {
//   const sql = `SELECT p.*, b.type FROM products p JOIN best_seller b ON p.id = b.product_id`;

//   db.query(sql, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err });
//       return;
//     }
//     response(200, results, "get all data from best seller", res)
//   });
// });

// app.listen(process.env.PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
// });

// GET Links
// app.get("/links", (req, res) => {
//   db.query("SELECT * FROM links", (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err });
//       return;
//     }
//     response(200, results, "get all data from links", res);
//   })
// })