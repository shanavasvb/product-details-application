const express = require('express');
const router = express.Router();
const ProductLine = require('../models/productLine');

router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const lines = await ProductLine.find({ ProductLine_name: { $regex: q, $options: 'i' } }).limit(10);
  res.json(lines);
});

module.exports = router;
