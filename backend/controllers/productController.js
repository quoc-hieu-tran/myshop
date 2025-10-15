import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource Not Found");
  }
});

// @desc    Create a product (with sample data)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id, // logged-in admin
    image: "/images/sample.jpg", // ensure this file exists in frontend/public/images
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image; // will be wired to upload later
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    const updated = await product.save();
    res.status(200).json(updated);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await Product.deleteOne({ _id: product._id });
  res.status(200).json({ message: "Product deleted" });
});
// @desc    Create a new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  // Load product
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Prevent duplicate review by the same user
  const alreadyReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }
  // Build the new review (name is the username of the logged-in user)
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };
  // Push review, update aggregates
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;
  // Persist
  await product.save();
  res.status(201).json({ message: "Review added" });
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
