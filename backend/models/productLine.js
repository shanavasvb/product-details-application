const mongoose = require('mongoose');

const productLineSchema = new mongoose.Schema({
  id: String,
  ProductLine_id: String,
  Category_id: String,
  ProductLine_name: String
}, {
  collection: 'productLines' // 👈 Use the exact collection name from MongoDB Atlas
});

module.exports = mongoose.model('ProductLine', productLineSchema);
