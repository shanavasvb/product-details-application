const mongoose = require('mongoose');

const productSpecSchema = new mongoose.Schema({
  id: String,
  Product_id: String,
  Specification: {
    type: Map, // allows dynamic key-value pairs
    of: String // all values are strings (e.g., "500g", "Tamarind", etc.)
  }
}, {
  collection: 'specifications'
});

module.exports = mongoose.model('ProductSpec', productSpecSchema);
