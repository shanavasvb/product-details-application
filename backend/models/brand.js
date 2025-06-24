const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  Brand_id: String,
  Brand_name: String
}, {
  collection: 'brands' // 🔸 Match the collection name in MongoDB exactly
});

module.exports = mongoose.model('Brand', brandSchema);
