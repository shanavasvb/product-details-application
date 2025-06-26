// category.js schema
const mongoose=require('mongoose');

const categorySchema = new mongoose.Schema({
    // id: String,
    Category_id: String,
    Category_name: String
}, {
  collection: 'category'
});

module.exports = mongoose.model('Category',categorySchema);
