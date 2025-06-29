const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const categories = await Category.find({ Category_name: { $regex: q, $options: 'i' } }).limit(10);
  res.json(categories);
});

module.exports = router;
