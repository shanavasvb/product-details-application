const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', //refers to the user collection to fetch the details of employee who made the edits on the product details if needesd.
    required: true
  },
  draftData: {
    Barcode: String,
    Product_id: String,
    Brand_id: String,
    Category_id: String,
    ProductLine_id: String,
    ProductName: String,
    Description: String,
    Quantity: Number,
    Unit: String,
    Features: {
        type: [String],
        default: []
    },
    Specification: {
        type: Map,
        of: String,
        default: new Map()
    }
  },
  lastSaved: {
    type: Date,
    default: Date.now
  },
  saveType : String, //represents auto save or manual save 
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'draft',
});

module.exports = mongoose.model('Draft', draftSchema);
