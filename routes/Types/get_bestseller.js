const express = require("express");
const router = express.Router();
const db = require("../../db")
const response = require("../../response")

router.get("/best_seller", (req, res) => {
  const sql = `SELECT p.*, b.type FROM products p JOIN best_seller b ON p.id = b.product_id`;

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return; 
    }
    response(200, results, "get all data from best seller", res)
  });
});

module.exports = router;