const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const ProductLine = require('../models/productLine');
const Brand = require('../models/brand');
const ProductFeature = require('../models/productFeatureSchema');
const Specification = require('../models/specefication');
const User = require('../models/User');
const { spawn } = require('child_process');
const path = require('path');

// =============================================================================
// BASIC PRODUCT OPERATIONS
// =============================================================================

/**
 * Get all filter options (categories, product lines, brands)
 * @route GET /api/v1/product/filters
 */
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

/**
 * Get products with pagination and filters
 * @route GET /api/v1/product
 */
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
  const query = { Is_Delete: false };

  if (search) query.ProductName = { $regex: search, $options: 'i' };
  if (category) query.Category_id = category;
  if (productLine) query.ProductLine_id = productLine;
  if (brand) query.Brand_id = brand;

  try {
    const totalCount = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ ProductName: 1 })
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
      Brand_name: brandMap[p.Brand_id] || '',
      Category_name: categoryMap[p.Category_id] || '',
      ProductLine_name: productLineMap[p.ProductLine_id] || '',
      Review_Status: p.Review_Status || ''
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

/**
 * Get a single product by ID
 * @route GET /api/v1/product/:id
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id }).lean();
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
      Specification: specificationDoc?.Specification || {},
      Review_Status: product.Review_Status || ''
    });
  } catch (err) {
    console.error('Failed to fetch product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get detailed product information with enriched data
 * @route GET /api/v1/product/:id/details
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
      specifications: specificationDoc?.Specification || {},
      Review_Status: product.Review_Status || ''
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

// =============================================================================
// PRODUCT LIFECYCLE OPERATIONS
// =============================================================================

/**
 * Mark a product as deleted (soft delete)
 * @route DELETE /api/v1/product/:id
 */
const markProductDeleted = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        Is_Delete: true,
        Deleted_By: userId,
        Deleted_On: new Date(),
      },
      { new: true, upsert: false }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted', product: updated });
  } catch (error) {
    console.error('Error marking product as deleted:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get trashed products from database (Is_Delete: true)
 * @route GET /api/v1/product/trash
 */
const getTrashedProducts = async (req, res) => {
  try {
    const trashedProducts = await Product.find({ Is_Delete: true }).lean();

    const productIds = trashedProducts.map(p => p.Product_id);
    const categoryIds = trashedProducts.map(p => p.Category_id);
    const productLineIds = trashedProducts.map(p => p.ProductLine_id);
    const brandIds = trashedProducts.map(p => p.Brand_id);

    const deletedByIds = trashedProducts
      .map(p => p.Deleted_By)
      .filter(Boolean)
      .map(id => new mongoose.Types.ObjectId(id));

    const [features, specs, categories, productLines, brands, users] = await Promise.all([
      ProductFeature.find({ Product_id: { $in: productIds } }).lean(),
      Specification.find({ Product_id: { $in: productIds } }).lean(),
      Category.find({ Category_id: { $in: categoryIds } }).lean(),
      ProductLine.find({ ProductLine_id: { $in: productLineIds } }).lean(),
      Brand.find({ Brand_id: { $in: brandIds } }).lean(),
      User.find({ _id: { $in: deletedByIds } }).select('_id name').lean()
    ]);

    const featureMap = Object.fromEntries(features.map(f => [f.Product_id, f.Features]));
    const specMap = Object.fromEntries(specs.map(s => [s.Product_id, s.Specification]));
    const categoryMap = Object.fromEntries(categories.map(c => [c.Category_id, c.Category_name]));
    const productLineMap = Object.fromEntries(productLines.map(p => [p.ProductLine_id, p.ProductLine_name]));
    const brandMap = Object.fromEntries(brands.map(b => [b.Brand_id, b.Brand_name]));
    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u.name]));

    const enrichedProducts = trashedProducts.map(product => ({
      ...product,
      Features: featureMap[product.Product_id] || [],
      Specification: specMap[product.Product_id] || {},
      Category_name: categoryMap[product.Category_id] || 'Unknown',
      ProductLine_name: productLineMap[product.ProductLine_id] || 'Unknown',
      Brand_name: brandMap[product.Brand_id] || 'Unknown',
      Deleted_By_Name: userMap[product.Deleted_By?.toString()] || 'Unknown',
      Deleted_On: product.Deleted_On || null
    }));

    res.json(enrichedProducts);
  } catch (error) {
    console.error('Error fetching trashed products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Restore a deleted product
 * @route PUT /api/v1/product/:id/restore
 */
const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        Is_Delete: false,
        $unset: {
          Deleted_On: 1,
          Deleted_By: 1
        }
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product restored successfully', product });
  } catch (error) {
    console.error('Error restoring product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================================================================
// BARCODE SEARCH & AI INTEGRATION
// =============================================================================

/**
 * Enhanced Search products by an array of barcodes with Python script integration
 * @route POST /api/v1/product/search-by-barcodes
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

    console.log(`[${new Date().toISOString()}] Searching for ${barcodes.length} barcodes:`, barcodes);

    // Step 1: Search existing products in database
    const existingProducts = await Product.find({
      Barcode: { $in: barcodes },
      Is_Delete: { $ne: true }
    }).lean();

    console.log(`Found ${existingProducts.length} existing products in database`);

    // Step 2: Identify barcodes not found in database
    const foundBarcodes = existingProducts.map(product => product.Barcode);
    const notFoundBarcodes = barcodes.filter(barcode => !foundBarcodes.includes(barcode));

    let newlyFetchedProducts = [];
    let finalNotFound = [];

    // Step 3: If there are unfound barcodes, use Python script to fetch them
    if (notFoundBarcodes.length > 0) {
      console.log(`Fetching ${notFoundBarcodes.length} barcodes using Python script...`);

      try {
        const fetchedData = await runPythonScript(notFoundBarcodes);

        // Step 4: Process and save newly fetched products
        if (fetchedData && Array.isArray(fetchedData)) {
          for (const productData of fetchedData) {
            if (productData && productData.Barcode) {
              try {
                const savedProduct = await saveProductToDatabase(productData);
                if (savedProduct) {
                  newlyFetchedProducts.push(savedProduct);
                }
              } catch (saveError) {
                console.error(`Error saving product ${productData.Barcode}:`, saveError);
                finalNotFound.push(productData.Barcode);
              }
            }
          }
        }

        // Determine which barcodes still couldn't be found
        const savedBarcodes = newlyFetchedProducts.map(p => p.Barcode);
        finalNotFound = notFoundBarcodes.filter(barcode => !savedBarcodes.includes(barcode));

      } catch (pythonError) {
        console.error('Error running Python script:', pythonError);
        finalNotFound = notFoundBarcodes;
      }
    }

    // Step 5: Combine existing and newly fetched products
    const allProducts = [...existingProducts, ...newlyFetchedProducts];

    // Step 6: Enrich product data with related information
    const enrichedProducts = await enrichProductData(allProducts);

    console.log(`[${new Date().toISOString()}] Search completed: ${enrichedProducts.length} found, ${finalNotFound.length} not found`);

    res.json({
      success: true,
      count: enrichedProducts.length,
      data: enrichedProducts,
      notFound: finalNotFound,
      notFoundCount: finalNotFound.length,
      newlyFetched: newlyFetchedProducts.length,
      fromDatabase: existingProducts.length,
      searchTimestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in searchByBarcodes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while searching products'
    });
  }
};

// =============================================================================
// PYTHON SCRIPT INTEGRATION HELPERS
// =============================================================================

/**
 * Execute Python script for barcode processing
 * @param {Array} barcodes - Array of barcode strings
 * @returns {Promise<Array>} - Array of product data objects
 */
const runPythonScript = (barcodes) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../utils/barcode_api_processor.py');

    console.log(`Executing Python script: ${scriptPath}`);
    console.log(`Input barcodes:`, barcodes);

    const pythonProcess = spawn('python3', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env } // Pass environment variables to Python
    });

    // Send barcodes as JSON to stdin
    const inputData = JSON.stringify(barcodes);
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      // Don't log all stderr as error since Python uses it for info logs too
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code: ${code}`);

      if (code === 0) {
        try {
          const results = JSON.parse(stdout);
          console.log(`Python script returned ${results.length} products`);
          resolve(results);
        } catch (parseError) {
          console.error('Error parsing Python script output:', parseError);
          console.error('Raw output:', stdout);
          reject(new Error('Failed to parse Python script output'));
        }
      } else {
        console.error(`Python script failed with code ${code}`);
        console.error('Error output:', stderr);
        reject(new Error(`Python script exited with code ${code}. Error: ${stderr}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      reject(error);
    });

    // Add timeout for long-running processes
    setTimeout(() => {
      pythonProcess.kill('SIGTERM');
      reject(new Error('Python script execution timeout (60s)'));
    }, 60000);
  });
};

/**
 * Save product data from Python script to database
 * @param {Object} productData - Product data from Python script
 * @returns {Promise<Object>} - Saved product object
 */
const saveProductToDatabase = async (productData) => {
  try {
    console.log(`Saving product to database: ${productData['Product Name']}`);

    // Generate unique Product_id
    const productId = await generateUniqueProductId();

    // Create or find related entities
    const category = await findOrCreateCategory(productData.Category);
    const brand = await findOrCreateBrand(productData.Brand);
    const productLine = await findOrCreateProductLine(productData.ProductLine);

    // Create new product
    const newProduct = new Product({
      Product_id: productId,
      Barcode: productData.Barcode,
      ProductName: productData['Product Name'] || 'Unknown Product',
      Description: productData.Description || '',
      Category_id: category.Category_id,
      Brand_id: brand.Brand_id,
      ProductLine_id: productLine.ProductLine_id,
      Quantity: productData.Quantity || 0,
      Unit: productData.Unit || 'pcs',
      Review_Status: 'Pending', // New products need admin review
      Is_Delete: false,
      Created_On: new Date(),
      Data_Source: productData['Data Source'] || 'External API'
    });

    const savedProduct = await newProduct.save();
    console.log(`Product saved with ID: ${savedProduct.Product_id}`);

    // Save features if available
    if (productData.Features && Array.isArray(productData.Features)) {
      const productFeature = new ProductFeature({
        Product_id: productId,
        Features: productData.Features
      });
      await productFeature.save();
      console.log(`Features saved for product ${productId}`);
    }

    // Save specifications if available
    if (productData.Specification && typeof productData.Specification === 'object') {
      const specification = new Specification({
        Product_id: productId,
        Specification: productData.Specification
      });
      await specification.save();
      console.log(`Specifications saved for product ${productId}`);
    }

    return savedProduct;
  } catch (error) {
    console.error('Error saving product to database:', error);
    throw error;
  }
};

/**
 * Enrich product data with related information (brands, categories, etc.)
 * @param {Array} products - Array of product objects
 * @returns {Promise<Array>} - Enriched product data
 */
const enrichProductData = async (products) => {
  if (products.length === 0) return [];

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

  return products.map(product => ({
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
    },
    dataSource: product.Data_Source || 'Database',
    reviewStatus: product.Review_Status || 'Approved',
    createdOn: product.Created_On
  }));
};

// =============================================================================
// DATABASE UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate unique Product ID
 * @returns {Promise<string>} - New unique product ID
 */
const generateUniqueProductId = async () => {
  const lastProduct = await Product.findOne().sort({ Product_id: -1 });
  return lastProduct ? (parseInt(lastProduct.Product_id) + 1).toString() : '1';
};

/**
 * Find or create a category
 * @param {string} categoryName - Category name
 * @returns {Promise<Object>} - Category object
 */
const findOrCreateCategory = async (categoryName) => {
  if (!categoryName || categoryName === 'Unknown') {
    categoryName = 'Other';
  }

  let category = await Category.findOne({ Category_name: categoryName });
  if (!category) {
    const lastCategory = await Category.findOne().sort({ Category_id: -1 });
    const newCategoryId = lastCategory ? (parseInt(lastCategory.Category_id) + 1).toString() : '1';

    category = new Category({
      Category_id: newCategoryId,
      Category_name: categoryName
    });
    await category.save();
    console.log(`Created new category: ${categoryName}`);
  }
  return category;
};

/**
 * Find or create a brand
 * @param {string} brandName - Brand name
 * @returns {Promise<Object>} - Brand object
 */
const findOrCreateBrand = async (brandName) => {
  if (!brandName || brandName === 'Unknown Brand') {
    brandName = 'Generic';
  }

  let brand = await Brand.findOne({ Brand_name: brandName });
  if (!brand) {
    const lastBrand = await Brand.findOne().sort({ Brand_id: -1 });
    const newBrandId = lastBrand ? (parseInt(lastBrand.Brand_id) + 1).toString() : '1';

    brand = new Brand({
      Brand_id: newBrandId,
      Brand_name: brandName
    });
    await brand.save();
    console.log(`Created new brand: ${brandName}`);
  }
  return brand;
};

/**
 * Find or create a product line
 * @param {string} productLineName - Product line name
 * @returns {Promise<Object>} - Product line object
 */
const findOrCreateProductLine = async (productLineName) => {
  if (!productLineName || productLineName === 'Unknown') {
    productLineName = 'Standard';
  }

  let productLine = await ProductLine.findOne({ ProductLine_name: productLineName });
  if (!productLine) {
    const lastProductLine = await ProductLine.findOne().sort({ ProductLine_id: -1 });
    const newProductLineId = lastProductLine ? (parseInt(lastProductLine.ProductLine_id) + 1).toString() : '1';

    productLine = new ProductLine({
      ProductLine_id: newProductLineId,
      ProductLine_name: productLineName
    });
    await productLine.save();
    console.log(`Created new product line: ${productLineName}`);
  }
  return productLine;
};

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  // Basic product operations
  getFilters,
  getProducts,
  getProductById,
  getProductDetails,

  // Product lifecycle operations
  markProductDeleted,
  getTrashedProducts,
  restoreProduct,

  // Barcode search & AI integration
  searchByBarcodes,

  // Helper functions (exported for potential reuse or testing)
  runPythonScript,
  saveProductToDatabase,
  enrichProductData,
  generateUniqueProductId,
  findOrCreateCategory,
  findOrCreateBrand,
  findOrCreateProductLine
};