const express = require('express');
const router = express.Router();
const {
    getFilters,
    getProducts,
    getProductById,
    searchByBarcodes,
    getProductDetails,
    markProductDeleted,
    getTrashedProducts,
    restoreProduct
} = require('../controllers/productController');

router.put('/mark-deleted/:id', markProductDeleted);
router.get('/trashed', getTrashedProducts);
router.put('/restore/:id', restoreProduct);
router.get('/filters', getFilters);
router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/search-by-barcodes', searchByBarcodes);
router.get('/details/:id', getProductDetails);

module.exports = router;