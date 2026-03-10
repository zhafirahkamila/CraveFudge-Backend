const express = require("express");
const router = express.Router();
const db = require("../../db")
const response = require("../../response")

router.get("/products_type", (req, res) => {
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

module.exports = router;