const Product = require('../models/product');
const Category = require('../models/category');
const ProductLine = require('../models/productLine');
const Brand = require('../models/brand');
const ProductFeature = require('../models/productFeatureSchema');
const Specification = require('../models/specefication');

// Mark a product as deleted (soft delete)
const markProductDeleted = async (req, res) => {
  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { Is_Delete: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product marked as deleted', product: updated });
  } catch (error) {
    console.error('Error marking product as deleted:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trashed products froom database(Is_Delete : true)
const getTrashedProducts = async (req, res) => {
  try {
    const trashedProducts = await Product.find({ Is_Delete: true }).lean();

    const productIds = trashedProducts.map(p => p.Product_id);
    const categoryIds = trashedProducts.map(p => p.Category_id);
    const productLineIds = trashedProducts.map(p => p.ProductLine_id);
    const brandIds = trashedProducts.map(p => p.Brand_id);

    const [features, specs, categories, productLines, brands] = await Promise.all([
      ProductFeature.find({ Product_id: { $in: productIds } }).lean(),
      Specification.find({ Product_id: { $in: productIds } }).lean(),
      Category.find({ Category_id: { $in: categoryIds } }),
      ProductLine.find({ ProductLine_id: { $in: productLineIds } }),
      Brand.find({ Brand_id: { $in: brandIds } })
    ]);

    // Map lookup
    const featureMap = {};
    features.forEach(f => { featureMap[f.Product_id] = f.Features; });

    const specMap = {};
    specs.forEach(s => { specMap[s.Product_id] = s.Specification; });

    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.Category_id] = c.Category_name; });

    const productLineMap = {};
    productLines.forEach(p => { productLineMap[p.ProductLine_id] = p.ProductLine_name; });

    const brandMap = {};
    brands.forEach(b => { brandMap[b.Brand_id] = b.Brand_name; });

    // Enrich products
    const enrichedProducts = trashedProducts.map(product => ({
      ...product,
      Features: featureMap[product.Product_id] || [],
      Specification: specMap[product.Product_id] || {},
      Category_name: categoryMap[product.Category_id] || 'Unknown',
      ProductLine_name: productLineMap[product.ProductLine_id] || 'Unknown',
      Brand_name: brandMap[product.Brand_id] || 'Unknown'
    }));

    res.json(enrichedProducts);
  } catch (error) {
    console.error('Error fetching trashed products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// restore function
const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { Is_Delete: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product restored successfully', product });
  } catch (error) {
    console.error('Error restoring product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all filter options (categories, product lines, brands)
const getFilters = async (req, res) => {
  try {
    const categories = await Category.find();
    const productLines = await ProductLine.find();
    const brands = await Brand.find();

    console.log('Sending filters:', {
      categories,
      productLines,
      brands
    });

    res.json({ categories, productLines, brands });
  } catch (err) {
    console.error('Error in getFilters:', err);
    res.status(500).json({ message: 'Error loading filters' });
  }
};


// Get products with pagination and filters
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
  const query = { Is_Delete : false };

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
      _id: p._id, 
      id: p.Product_id,
      name: p.ProductName,
      quantity: p.Quantity,
      unit: p.Unit,
      // image: p.ImageURL || '', // Optional
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

// Get a single product by ID
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
      _id: product._id,          
      Product_id: product.Product_id, 
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

/**
 * Search products by an array of barcodes
 * @param {Object} req - Express request object with barcodes array in body
 * @param {Object} res - Express response object
 */
const searchByBarcodes = async (req, res) => {
  try {
    const { barcodes } = req.body;

    // Validate input
    if (!barcodes || !Array.isArray(barcodes) || barcodes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid array of barcodes'
      });
    }

    // Find products by barcode
    const products = await Product.find({
      Barcode: { $in: barcodes }
    }).lean();

    // Map product data and associated entities
    const brandIds = [...new Set(products.map(p => p.Brand_id).filter(Boolean))];
    const categoryIds = [...new Set(products.map(p => p.Category_id).filter(Boolean))];
    const productLineIds = [...new Set(products.map(p => p.ProductLine_id).filter(Boolean))];

    const [brands, categories, productLines] = await Promise.all([
      Brand.find({ Brand_id: { $in: brandIds } }),
      Category.find({ Category_id: { $in: categoryIds } }),
      ProductLine.find({ ProductLine_id: { $in: productLineIds } })
    ]);

    const brandMap = brands.reduce((acc, b) => ({ ...acc, [b.Brand_id]: b }), {});
    const categoryMap = categories.reduce((acc, c) => ({ ...acc, [c.Category_id]: c }), {});
    const productLineMap = productLines.reduce((acc, p) => ({ ...acc, [p.ProductLine_id]: p }), {});

    const formattedProducts = products.map(product => ({
      _id: product._id,
      id: product.Product_id,
      name: product.ProductName,
      barcode: product.Barcode,
      description: product.Description || '',
      quantity: product.Quantity,
      unit: product.Unit,
      category: {
        id: product.Category_id,
        name: categoryMap[product.Category_id]?.Category_name || ''
      },
      brand: {
        id: product.Brand_id,
        name: brandMap[product.Brand_id]?.Brand_name || ''
      },
      productLine: {
        id: product.ProductLine_id,
        name: productLineMap[product.ProductLine_id]?.ProductLine_name || ''
      }
    }));

    // Find which barcodes were not found
    const foundBarcodes = products.map(product => product.Barcode);
    const notFoundBarcodes = barcodes.filter(barcode => !foundBarcodes.includes(barcode));

    res.json({
      success: true,
      count: formattedProducts.length,
      data: formattedProducts,
      notFound: notFoundBarcodes,
      notFoundCount: notFoundBarcodes.length
    });
  } catch (error) {
    console.error('Error searching products by barcodes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while searching products'
    });
  }
};

/**
 * Get detailed product information including features and specifications
 * @param {Object} req - Express request object with product ID
 * @param {Object} res - Express response object
 */
const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get associated data
    const [brand, category, productLine, featureDoc, specificationDoc] = await Promise.all([
      Brand.findOne({ Brand_id: product.Brand_id }),
      Category.findOne({ Category_id: product.Category_id }),
      ProductLine.findOne({ ProductLine_id: product.ProductLine_id }),
      ProductFeature.findOne({ Product_id: product.Product_id }).lean(),
      Specification.findOne({ Product_id: product.Product_id }).lean()
    ]);

    const productDetails = {
      _id: product._id,
      id: product.Product_id,
      name: product.ProductName,
      barcode: product.Barcode,
      description: product.Description || '',
      quantity: product.Quantity,
      unit: product.Unit,
      category: category ? {
        id: category.Category_id,
        name: category.Category_name
      } : null,
      brand: brand ? {
        id: brand.Brand_id,
        name: brand.Brand_name
      } : null,
      productLine: productLine ? {
        id: productLine.ProductLine_id,
        name: productLine.ProductLine_name
      } : null,
      features: featureDoc?.Features || [],
      specifications: specificationDoc?.Specification || {}
    };

    res.json({
      success: true,
      data: productDetails
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching product details'
    });
  }
};

module.exports = {
  getFilters,
  getProducts,
  getProductById,
  searchByBarcodes,
  getProductDetails,
  markProductDeleted,
  getTrashedProducts,
  restoreProduct
};