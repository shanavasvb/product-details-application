// routes/draftRoutes.js
const express = require('express');
const router = express.Router();
const Draft = require('../models/draft'); // Adjust path as needed

// // GET - Load existing draft for a specific product and employee
// router.get('/:productId/:employeeId', async (req, res) => {
//   try {
//     const { productId, employeeId } = req.params;
    
//     console.log(`Fetching draft for productId: ${productId}, employeeId: ${employeeId}`);

//     // Fixed: Use Draft (capital D) consistently
//     const drafts = await Draft.find({ productId, employeeId })
//       .sort({ lastSaved: -1 })
//       .limit(1);

//     console.log('Found drafts:', drafts);

//     if (!drafts.length) {
//       return res.status(404).json({ message: 'Draft not found' });
//     }

//     // Return the most recent draft
//     res.json(drafts[0]);
//   } catch (error) {
//     console.error('Error loading draft:', error);
//     res.status(500).json({ message: 'Server error loading draft', error: error.message });
//   }
// });

// create a new draft (by employee)
router.post('/', async (req, res) => {
  try {
    const { productId, employeeId, draftData, saveType } = req.body;
    
    const newDraft = new Draft({
      productId,
      employeeId,
      draftData,
      saveType: saveType || 'auto',
      lastSaved: new Date(),
      isPublished: false
    });
    
    const savedDraft = await newDraft.save();
    res.status(201).json(savedDraft);
  } catch (error) {
    console.error('Error creating draft:', error);
    res.status(500).json({ message: 'Server error creating draft', error: error.message });
  }
});

// PUT - Update existing draft
router.put('/:draftId', async (req, res) => {
  try {
    const { draftId } = req.params;
    const { draftData, saveType } = req.body;
    
    const updatedDraft = await Draft.findByIdAndUpdate(
      draftId,
      {
        draftData,
        saveType: saveType || 'auto',
        lastSaved: new Date()
      },
      { new: true }
    );
    
    if (!updatedDraft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    res.json(updatedDraft);
  } catch (error) {
    console.error('Error updating draft:', error);
    res.status(500).json({ message: 'Server error updating draft', error: error.message });
  }
});

// PUT - Approve draft (Fixed route to match frontend)
router.put('/:draftId/approve', async (req, res) => {
  try {
    const { draftId } = req.params;
    const Product = require('../models/product'); // Adjust path as needed
    
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    // Update the actual product with draft data
    const updatedProduct = await Product.findOneAndUpdate(
      { Product_id: draft.productId },
      {
        Barcode: draft.draftData.Barcode,
        Brand_id: draft.draftData.Brand_id,
        Category_id: draft.draftData.Category_id,
        ProductLine_id: draft.draftData.ProductLine_id,
        ProductName: draft.draftData.ProductName,
        Description: draft.draftData.Description,
        Quantity: draft.draftData.Quantity,
        Unit: draft.draftData.Unit,
        Features: draft.draftData.Features,
        Specification: draft.draftData.Specification,
        Review_Status: 'Approved'
      },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Mark draft as published
    draft.isPublished = true;
    await draft.save();
    
    res.json({ 
      message: 'Draft approved and product updated', 
      product: updatedProduct,
      draft: draft 
    });
  } catch (error) {
    console.error('Error approving draft:', error);
    res.status(500).json({ message: 'Server error approving draft', error: error.message });
  }
});

// PUT - Reject draft (Fixed route to match frontend)
router.put('/:draftId/reject', async (req, res) => {
  try {
    const { draftId } = req.params;
    const { rejectionReason } = req.body;
    
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    // Mark as rejected but keep the record for history
    draft.isPublished = false;
    draft.rejectionReason = rejectionReason || 'No reason provided';
    draft.rejectedAt = new Date();
    await draft.save();
    
    res.json({ 
      message: 'Draft rejected successfully',
      rejectionReason: rejectionReason || 'No reason provided'
    });
  } catch (error) {
    console.error('Error rejecting draft:', error);
    res.status(500).json({ message: 'Server error rejecting draft', error: error.message });
  }
});

// GET - Get all drafts for admin review
router.get('/admin/pending', async (req, res) => {
  try {
    const pendingDrafts = await Draft.find({ 
      saveType: 'manual',
      isPublished: false 
    })
    .populate('employeeId', 'name email') // Populate employee details
    .sort({ lastSaved: -1 });
    
    res.json(pendingDrafts);
  } catch (error) {
    console.error('Error loading pending drafts:', error);
    res.status(500).json({ message: 'Server error loading pending drafts', error: error.message });
  }
});

// GET - Get drafts by employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const drafts = await Draft.find({ employeeId: employeeId })
      .sort({ lastSaved: -1 });
    
    res.json(drafts);
  } catch (error) {
    console.error('Error loading employee drafts:', error);
    res.status(500).json({ message: 'Server error loading employee drafts', error: error.message });
  }
});

// DELETE - Delete draft
router.delete('/:draftId', async (req, res) => {
  try {
    const { draftId } = req.params;
    
    const deletedDraft = await Draft.findByIdAndDelete(draftId);
    if (!deletedDraft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Error deleting draft:', error);
    res.status(500).json({ message: 'Server error deleting draft', error: error.message });
  }
});

module.exports = router;