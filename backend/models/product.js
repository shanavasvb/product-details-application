const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  Barcode:String,
  Product_id: String,
  Brand_id:String,
  Category_id:String,
  ProductLine_id:String,
  ProductName: String,
  Description: String,
  Unit: String,
  Quantity: String
});

module.exports = mongoose.model('Product', productSchema);
