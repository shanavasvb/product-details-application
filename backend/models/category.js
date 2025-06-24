const mongoose=require('mongoose');

const categorySchema = new mongoose.Schema({
    // id: String,
    Category_id: String,
    Category_name: String
}, {
  collection: 'category' // 👈 Match EXACTLY what MongoDB shows in Atlas
});

module.exports = mongoose.model('Category',categorySchema);
