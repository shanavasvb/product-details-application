const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Draft = require('../models/draft');
const User = require('../models/User');
const Category = require('../models/category');
const ProductLine = require('../models/productLine');
const Brand = require('../models/brand');
const Product = require('../models/product'); 
const Specification = require('../models/specefication');
const ProductFeature = require('../models/productFeatureSchema');
const Notification = require('../models/notifications');

// GET - All drafts (Admin overview)
router.get('/', async (req, res) => {
  try {
    const drafts = await Draft.find()
      .populate('employeeId', 'name email')
      .sort({ lastSaved: -1 });

    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - All pending drafts (Admin review)
router.get('/admin/pending', async (req, res) => {
  try {
    const pendingDrafts = await Draft.find({ 
      saveType: 'manual',
      isPublished: false 
    })
    .populate('employeeId', 'name email')
    .sort({ lastSaved: -1 });

    res.json(pendingDrafts);
  } catch (error) {
    res.status(500).json({ message: 'Server error loading pending drafts', error: error.message });
  }
});

// GET - Drafts for a specific employee (with optional saveType filter)
const { ObjectId } = require('mongoose').Types;

router.get('/employee/:id', async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  console.log('Received request for employee:', id, 'with type:', type);

  try {
    const query = { employeeId: new ObjectId(id) };
    if (type) query.saveType = type;

    console.log("Constructed query:", query);

    const drafts = await Draft.find(query).sort({ lastSaved: -1 });

    res.status(200).json(drafts);
  } catch (err) {
    console.error('Error fetching drafts:', err);
    res.status(500).json({ error: 'Failed to fetch drafts', message: err.message });
  }
});

// GET - Fetch draft by productId and employeeId (Query params)
router.get('/fetch', async (req, res) => {
  const { productId, employeeId } = req.query;

  if (!productId || !employeeId) {
    return res.status(400).json({ message: 'Missing productId or employeeId' });
  }

  try {
    const draft = await Draft.findOne({ productId, employeeId }).populate('employeeId', 'name email');

    if (!draft) {
      return res.status(404).json({ message: 'Draft not found for given product and employee' });
    }

    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching draft', error: error.message });
  }
});

// GET - Fetch draft by productId and employeeId (used in notifications)
router.get('/:productId/:employeeId', async (req, res) => {
  const { productId, employeeId } = req.params;

  try {
    const draft = await Draft.findOne({ productId, employeeId }).populate('employeeId', 'name email');

    if (!draft) {
      return res.status(404).json({ message: 'Draft not found for given product and employee' });
    }

    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching draft', error: error.message });
  }
});

// POST - Create a new draft
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

    // when edit is saved as 'submitted', product status changes to pending by comparing using barcode or product id
    if (saveType === 'submitted') {
      const updated = await Product.findOneAndUpdate(
        { Product_id: productId },
        { Review_Status: 'Pending' }
      );

      if (!updated && draftData?.Barcode) {
        await Product.findOneAndUpdate(
          { Barcode: draftData.Barcode },
          { Review_Status: 'Pending' }
        );
      }
    }

    const savedDraft = await newDraft.save();
    res.status(201).json(savedDraft);
  } catch (error) {
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
    
    // when edit is saved as 'submitted', product status changes to pending by comparing using barcode or product id
    if (saveType === 'submitted') {
      const draftData = updatedDraft.draftData;

      const updated = await Product.findOneAndUpdate(
        { Product_id: updatedDraft.productId },
        { Review_Status: 'Pending' }
      );

      if (!updated && draftData?.Barcode) {
        await Product.findOneAndUpdate(
          { Barcode: draftData.Barcode },
          { Review_Status: 'Pending' }
        );
      }
    }


    res.json(updatedDraft);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating draft', error: error.message });
  }
});

// PUT - Approve draft
router.put('/:draftId/approve', async (req, res) => {
  try {
    const { draftId } = req.params;
    const draft = await Draft.findById(draftId);

    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    const draftData = draft.draftData;
    const barcode = draftData.Barcode;

    // Find existing product by barcode
    const existingProduct = await Product.findOne({ Barcode: barcode });

    if (!existingProduct) {
      return res.status(404).json({ message: 'No product found with matching barcode' });
    }

    const productId = existingProduct.Product_id;
    const Dbarcode = existingProduct.Barcode;

    // Helper to get or create Category, Brand, ProductLine
    const getOrCreateId = async (Model, idField, nameField, nameValue) => {
      let existing = await Model.findOne({ [nameField]: nameValue });
      if (!existing) {
        const newId = `${idField}_${Date.now()}`;
        const newEntry = new Model({ [idField]: newId, [nameField]: nameValue });
        await newEntry.save();
        return newId;
      }
      return existing[idField];
    };

    const Category_id = await getOrCreateId(Category, 'Category_id', 'Category_name', draftData.Category);
    const Brand_id = await getOrCreateId(Brand, 'Brand_id', 'Brand_name', draftData.Brand);
    const ProductLine_id = await getOrCreateId(ProductLine, 'ProductLine_id', 'ProductLine_name', draftData.ProductLine);

    // Update product
    await Product.findOneAndUpdate(
      { Barcode: Dbarcode },
      {
        Product_id: productId,
        ProductName: draftData.ProductName,
        Barcode: draftData.Barcode,
        Description: draftData.Description,
        Quantity: draftData.Quantity,
        Unit: draftData.Unit,
        Review_Status: 'Reviewed',
        Is_Delete: false,
        Category_id,
        Brand_id,
        ProductLine_id
      },
      { upsert: true, new: true }
    );

    // Update or insert features
    await ProductFeature.findOneAndUpdate(
      { Product_id: productId },
      {
        Product_id: productId,
        Features: draftData.Features || []
      },
      { upsert: true, new: true }
    );

    // Update or insert specifications
    await Specification.findOneAndUpdate(
      { Product_id: productId },
      {
        Product_id: productId,
        Specification: draftData.Specification || {}
      },
      { upsert: true, new: true }
    );

    // Delete the draft after approval
    await Draft.findByIdAndDelete(draftId);

    // Delete the related notification
    await Notification.findOneAndDelete({
      relatedId: draft.productId,
      senderId: draft.employeeId.toString(),
      type: 'editing'
    });

    res.status(200).json({ message: 'Draft approved and product updated by barcode match' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error approving draft', error: error.message });
  }
});

// PUT - Reject draft
router.put('/:draftId/reject', async (req, res) => {
  try {
    const { draftId } = req.params;

    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    const draftData = draft.draftData;
    const barcode = draftData.Barcode;

    // Find existing product by barcode
    const existingProduct = await Product.findOne({ Barcode: barcode });
    if (!existingProduct) {
      return res.status(404).json({ message: 'No product found with matching barcode' });
    }

    const Dbarcode = existingProduct.Barcode;

    // Update the product's Review_Status to "Reviewed"
    await Product.findOneAndUpdate(
      { Barcode: Dbarcode },
      { Review_Status: "Reviewed" }
    );

    // Delete the draft
    await Draft.findByIdAndDelete(draftId);

    // Delete the related notification
    await Notification.findOneAndDelete({
      relatedId: draft.productId,
      senderId: draft.employeeId.toString(),
      type: 'editing'
    });

    res.json({ message: 'Draft rejected, product marked as Reviewed, and draft/notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error rejecting draft', error: error.message });
  }
});

module.exports = router;