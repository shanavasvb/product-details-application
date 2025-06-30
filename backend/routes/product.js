const express = require('express');
const router = express.Router();
const {
    getFilters,
    getProducts,
    getProductById,
    searchByBarcodes,
    getProductDetails
} = require('../controllers/productController');

router.get('/filters', getFilters);
router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/search-by-barcodes', searchByBarcodes);
router.get('/details/:id', getProductDetails);

module.exports = router;