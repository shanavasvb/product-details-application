const express = require('express');
const router = express.Router();
const Category = require('../models/category'); 


router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { Category_name } = req.body;

    if (!Category_name) {
      return res.status(400).json({ error: 'Category_name is required' });
    }

    const latestCategory = await Category.findOne().sort({ Category_id: -1 });  

    let newCategoryId = 'C001';

    if (latestCategory && latestCategory.Category_id) {
      const latestNumber = parseInt(latestCategory.Category_id.replace('C', ''));
      const nextNumber = latestNumber + 1;
      newCategoryId = 'C' + String(nextNumber).padStart(3, '0');  
    }

    const newCategory = new Category({
      Category_name,
      Category_id: newCategoryId
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Category_name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { Category_name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const results = await Category.find({
      Category_name: { $regex: new RegExp(query, 'i') } 
    });

    res.json(results);
  } catch (err) {
    console.error('Error searching categories:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;