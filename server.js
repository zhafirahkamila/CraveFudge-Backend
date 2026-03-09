import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js"
import response from "./response.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Crave Fudge")
})

// GET all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return; // <-- penting, biar gak kirim header lagi
    }
    // res.json(results);
    response(200, results, "get all data from products", res)
  });
});

// GET all products with best_seller type if available
app.get("/products_type", (req, res) => {
  const sql = `
    SELECT p.*, b.type 
    FROM products p
    LEFT JOIN best_seller b 
    ON p.id = b.product_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    response(200, results, "get all products with best_seller type if exists", res);
  });
});


// GET all categories
app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return; 
    }
    response(200, results, "get all data from categories", res)
  });
});

// GET best sellers
app.get("/best_seller", (req, res) => {
  const sql = `SELECT p.*, b.type FROM products p JOIN best_seller b ON p.id = b.product_id`;

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return; // <-- penting, biar gak kirim header lagi
    }
    response(200, results, "get all data from best seller", res)
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});

// GET Links
app.get("/links", (req, res) => {
  db.query("SELECT * FROM links", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    response(200, results, "get all data from links", res);
  })
})