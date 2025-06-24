const express = require('express');
const router = express.Router();
const { getFilters, getProducts, getProductById } = require('../controllers/productController');

router.get('/filters', getFilters);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;


