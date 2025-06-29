const express = require('express');
const router = express.Router();
const Brand = require('../models/brand');

router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const brands = await Brand.find({ Brand_name: { $regex: q, $options: 'i' } }).limit(10);
  res.json(brands);
});

module.exports = router;
