const express = require('express');
const router = express.Router();
const Draft = require('../models/draft');
const User = require('../models/User');

// Get all drafts with employee info
router.get('/', async (req, res) => {
  try {
    const drafts = await Draft.find()
      .populate('employeeId', 'name email') 
      .sort({ lastSaved: -1 }); //  puthiyath adyam vanna pole sort cheyyum
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a draft by ID
router.delete('/:id', async (req, res) => {
  try {
    await Draft.findByIdAndDelete(req.params.id);
    res.json({ message: 'Draft deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
