const express = require("express");
const router = express.Router();
const db = require("../../db")
const response = require("../../response")

router.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return; 
    }
    response(200, results, "get all data from products", res)
  });
});

module.exports = router;