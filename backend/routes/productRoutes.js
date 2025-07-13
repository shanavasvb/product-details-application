const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products by Category ID
router.get('/by-category/:categoryId', async (req, res) => {
  try {
      const categoryId = req.params.categoryId?.trim(); // trim for safet
      const products = await Product.find({
      Category_id: categoryId
      });
      res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});

// Get products by productLine ID
router.get('/by-productLine/:productLineId', async (req, res) => {
  try {
      const productLineId = req.params.productLineId?.trim(); // trim for safet
      const products = await Product.find({
      ProductLine_id: productLineId
      });
      res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});

// Get product by product ID
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  // Validate the format of the productId
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

// POST /api/products/fetchByBarcode
router.post('/api/products/fetchByBarcode', async (req, res) => {
  const { barcode } = req.body;
  try {
    const product = await Product.findOne({ barcode });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json(null); // or { error: 'Not found' }
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;