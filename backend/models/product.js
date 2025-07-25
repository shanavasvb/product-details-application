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
  Quantity: String,
  Review_Status : String,
  Is_Delete: 
    { 
      type : Boolean,
      default : false  
    },
  Deleted_On : Date,
  Deleted_By : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //refers to the user collection to fetch the details of employee who made the edits on the product details if needesd.
      required: false
    },
});

module.exports = mongoose.model('products', productSchema);
