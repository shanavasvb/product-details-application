//productController.js

const Product = require('../models/product');
const Category = require('../models/category');
const ProductLine = require('../models/productLine');
const Brand = require('../models/brand');
const ProductFeature = require('../models/features');
const Specification = require('../models/specifications');


const getFilters = async (req, res) => {
  try {
    const categories = await Category.find();
    const productLines = await ProductLine.find();
    const brands = await Brand.find();
    res.json({ categories, productLines, brands });
  } catch (err) {
    res.status(500).json({ message: 'Error loading filters' });
  }
};

const getProducts = async (req, res) => {
  const {
    search = '',
    category = '',
    productLine = '',
    brand = '',
    page = 1,
    limit = 20
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = {};

  if (search) query.ProductName = { $regex: search, $options: 'i' };
  if (category) query.Category_id = category;
  if (productLine) query.ProductLine_id = productLine;
  if (brand) query.Brand_id = brand;

  try {
    const totalCount = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const brandMap = {};
    const categoryMap = {};
    const productLineMap = {};

    // Preload all filter data once to avoid repeated queries
    const brands = await Brand.find();
    const categories = await Category.find();
    const productLines = await ProductLine.find();

    brands.forEach(b => brandMap[b.Brand_id] = b.Brand_name);
    categories.forEach(c => categoryMap[c.Category_id] = c.Category_name);
    productLines.forEach(p => productLineMap[p.ProductLine_id] = p.ProductLine_name);

    const formattedProducts = products.map(p => ({
      id: p.Product_id,
      name: p.ProductName,
      quantity: p.Quantity,
      unit: p.Unit,
    //   image: p.ImageURL || '', // Optional
      Brand_name: brandMap[p.Brand_id] || '',
      Category_name: categoryMap[p.Category_id] || '',
      ProductLine_name: productLineMap[p.ProductLine_id] || ''
    }));

    res.json({
      products: formattedProducts,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (err) {
    console.error('Fetch products failed:', err);
    res.status(500).json({ message: 'Error loading products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ Product_id: req.params.id }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const brand = await Brand.findOne({ Brand_id: product.Brand_id });
    const category = await Category.findOne({ Category_id: product.Category_id });
    const productLine = await ProductLine.findOne({ ProductLine_id: product.ProductLine_id });

    // Fetch features and specification
    const featureDoc = await ProductFeature.findOne({ Product_id: product.Product_id }).lean();
    const specificationDoc = await Specification.findOne({ Product_id: product.Product_id }).lean();

    res.json({
      Barcode: product.Barcode,
      ProductName: product.ProductName,
      Description: product.Description,
      Category: category?.Category_name || '',
      ProductLine: productLine?.ProductLine_name || '',
      Brand: brand?.Brand_name || '',
      Quantity: product.Quantity,
      Unit: product.Unit,
      Features: featureDoc?.Features || [],
      Specification: specificationDoc?.Specification || {}
    });
  } catch (err) {
    console.error('Failed to fetch product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getFilters, getProducts, getProductById };

