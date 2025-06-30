const express = require('express');
const router = express.Router();
const Brand = require('../models/brand');

router.get('/search', async (req, res) => {
  const q = req.query.q;
  const results = await Brand.find({ Brand_name: { $regex: q, $options: 'i' } });
  res.json(results);
});

router.post('/', async (req, res) => {
  const { Brand_name } = req.body;
  const existing = await Brand.findOne({ Brand_name });
  if (existing) return res.status(409).json({ message: 'Already exists', _id: existing._id });

  const newBrand = new Brand({ Brand_name });
  await newBrand.save();
  res.status(201).json(newBrand);
});

module.exports = router;
