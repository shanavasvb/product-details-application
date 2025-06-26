// productFeatureSchema.js schema
const mongoose = require('mongoose');

const productFeatureSchema = new mongoose.Schema({
  Product_id: {
    type: String,
    required: true  // ensures each feature is linked to a product
  },
  Features: {
    type: [String], // an array of feature strings
    required: true  // ensures we don't save empty feature sets by mistake
  }
}, {
  collection: 'productFeatures'
});

module.exports = mongoose.model('ProductFeature', productFeatureSchema);
