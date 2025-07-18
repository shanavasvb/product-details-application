const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/by-category/:categoryId', async (req, res) => {
  try {
      const categoryId = req.params.categoryId?.trim(); 
      const products = await Product.find({
      Category_id: categoryId
      });
      res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});


router.get('/by-productLine/:productLineId', async (req, res) => {
  try {
      const productLineId = req.params.productLineId?.trim(); 
      const products = await Product.find({
      ProductLine_id: productLineId
      });
      res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});


router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log("✅ Product found:", product.ProductName || product.name || product._id);
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product by ID:", err);
    res.status(500).json({ message: 'Error fetching product by ID' });
  }
});

router.post('/api/products/fetchByBarcode', async (req, res) => {
  const { barcode } = req.body;
  try {
    const product = await Product.findOne({ barcode });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json(null); 
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
