const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Brand = require('../models/brand');
const Category = require('../models/category');
const ProductLine = require('../models/productLine');
const Specification = require('../models/specefication');
const Freatures = require('../models/productFeatureSchema');


router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  if (!productId || productId.length !== 24) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const [brand, category, productLine, specification, features] = await Promise.all([
        Brand.findOne({ Brand_id: product.Brand_id }).lean(),
        Category.findOne({ Category_id: product.Category_id }).lean(),
        ProductLine.findOne({ ProductLine_id: product.ProductLine_id }).lean(),
        Specification.findOne({ Product_id: product.Product_id }).lean(),
        Freatures.findOne({ Product_id: product.Product_id }).lean()
      ]);


    const enriched = {
      Barcode: product.Barcode,
      "Product Name": product.ProductName || product['Product Name'],
      Brand: brand?.Brand_name || 'N/A',
      Description: product.Description || 'N/A',
      Category: category?.Category_name || 'N/A',
      ProductLine: productLine?.ProductLine_name || 'N/A',
      Quantity: `${product.Quantity} ${product.Unit}`,
       Features: features?.Features || [],
      Specification: specification?.Specification || {},
      "Product Image": "",
      "Product Ingredient Image": "",
      "Data Source": "AI Enhanced",
      Timestamp: new Date().toISOString()
    };

    res.json(enriched);
  } catch (err) {
    console.error("Error in enriched product route:", err);
    res.status(500).json({ message: 'Error fetching enriched product details' });
  }
});

module.exports = router;

