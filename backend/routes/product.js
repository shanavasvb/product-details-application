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

// ADD DEBUG MIDDLEWARE
router.use((req, res, next) => {
    console.log(`🔍 Product Route: ${req.method} ${req.originalUrl}`);
    next();
});


router.post('/search-by-barcodes', searchByBarcodes);
router.get('/filters', getFilters);
router.get('/trashed', getTrashedProducts);
router.get('/details/:id', getProductDetails);


router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/mark-deleted/:id', markProductDeleted);
router.put('/restore/:id', restoreProduct);

module.exports = router;