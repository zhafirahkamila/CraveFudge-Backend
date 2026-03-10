const express = require("express");
const router = express.Router();
const db = require("../../db")
const response = require("../../response")

router.get("/categories", (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return; 
    }
    response(200, results, "get all data from categories", res)
  });
});

module.exports = router;