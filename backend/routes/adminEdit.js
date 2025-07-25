const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const CategoryModel = require('../models/category');
const ProductLineModel = require('../models/productLine');
const Brand = require('../models/brand');
const Specification = require('../models/specefication');
const Feature = require('../models/productFeatureSchema');

router.put('/:id', async (req, res) => {
  try {
    const {
      ProductName,
      Category,
      ProductLine,
      Brand: BrandName,
      Quantity,
      Unit,
      Barcode,
      Description,
      Features,
      Specification: SpecsObj
    } = req.body;

    const updatedFields = {
      ProductName,
      Quantity,
      Unit,
      Barcode,
      Description,
      Review_Status: 'Approved'
    };

    // ---- Resolve or Create Category ----
    let category = await CategoryModel.findOne({ Category_name: Category });
    if (!category) {
      const latest = await CategoryModel.findOne().sort({ Category_id: -1 });
      const newId = 'C' + String((parseInt(latest?.Category_id?.slice(1) || 0) + 1).toString().padStart(3, '0'));
      category = new CategoryModel({ Category_name: Category, Category_id: newId });
      await category.save();
    }
    updatedFields.Category_id = category.Category_id;

    // ---- Resolve or Create Product Line ----
    let productLine = await ProductLineModel.findOne({ ProductLine_name: ProductLine });
    if (!productLine) {
      const latest = await ProductLineModel.findOne().sort({ ProductLine_id: -1 });
      const newId = 'PL' + String((parseInt(latest?.ProductLine_id?.slice(2) || 0) + 1).toString().padStart(3, '0'));
      productLine = new ProductLineModel({
        ProductLine_name: ProductLine,
        ProductLine_id: newId,
        Category_id: category.Category_id
      });
      await productLine.save();
    }
    updatedFields.ProductLine_id = productLine.ProductLine_id;

    // ---- Resolve or Create Brand ----
    let brand = await Brand.findOne({ Brand_name: BrandName });
    if (!brand) {
      const latest = await Brand.findOne().sort({ Brand_id: -1 });
      const newId = 'B' + String((parseInt(latest?.Brand_id?.slice(1) || 0) + 1).toString().padStart(3, '0'));
      brand = new Brand({ Brand_name: BrandName, Brand_id: newId });
      await brand.save();
    }
    updatedFields.Brand_id = brand.Brand_id;

    // ---- Update Product ----
    const updatedProduct = await Product.findOneAndUpdate({ _id: req.params.id },updatedFields,{ new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productId = updatedProduct.Product_id;

    // ---- Update or Insert Features (replace old with new) ----
    if (Array.isArray(Features)) {
      const existing = await Feature.findOne({ Product_id: productId });

      if (existing) {
        const existingFeatures = existing.Features || [];

        const updatedFeatures = [];

        for (let i = 0; i < Features.length; i++) {
          if (i < existingFeatures.length) {
            // Replace existing feature
            updatedFeatures.push(Features[i]);
          } else {
            // Add new feature
            updatedFeatures.push(Features[i]);
          }
        }
        existing.Features = updatedFeatures;
        await existing.save();
      } else {
        await new Feature({
          Product_id: productId,
          Features: Features
        }).save();
      }
    }

    // add or replace the specifications entered by admin
    if (SpecsObj && typeof SpecsObj === 'object') {
        let existingSpec = await Specification.findOne({ Product_id: productId });

        if (existingSpec) {
            for (const [key, value] of Object.entries(SpecsObj)) {
            existingSpec.Specification.set(key, value);  
            }
            await existingSpec.save();
        } else {
            await new Specification({
            Product_id: productId,
            Specification: SpecsObj
            }).save();
        }
    }


    res.json({
      message: 'Product and related data updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error while updating product' });
  }
});

module.exports = router;
