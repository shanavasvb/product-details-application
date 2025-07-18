const express = require('express');
const router = express.Router();
const ProductLine = require('../models/productLine'); 

router.get('/', async (req, res) => {
  try {
    const productLines = await ProductLine.find();
    res.json(productLines);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { ProductLine_name, Category_id } = req.body;

    if (!ProductLine_name || !Category_id) {
      return res.status(400).json({ error: 'ProductLine_name and Category_id are required' });
    }

    const allProductLines = await ProductLine.find();

    let maxNumber = 0;

    allProductLines.forEach(pl => {
      const number = parseInt(pl.ProductLine_id.replace('PL', ''));
      if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
      }
    });

    const nextNumber = maxNumber + 1;
    const newproductLineId = 'PL' + String(nextNumber).padStart(3, '0');

    const newProductLine = new ProductLine({
      ProductLine_name,
      ProductLine_id: newproductLineId,
      Category_id,
    });

    await newProductLine.save();
    res.status(201).json(newProductLine);
  } catch (err) {
    console.error('Error creating productLine:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ProductLine_name } = req.body;

    const updatedProductLine = await ProductLine.findByIdAndUpdate(
      id,
      { ProductLine_name },
      { new: true }
    );

    if (!updatedProductLine) {
      return res.status(404).json({ error: 'ProductLine not found' });
    }

    res.json(updatedProductLine);
  } catch (err) {
    console.error('Error updating productLine:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});


router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const results = await ProductLine.find({
      ProductLine_name: { $regex: new RegExp(query, 'i') } 
    });

    res.json(results);
  } catch (err) {
    console.error('Error searching ProductLine:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;