const Product = require('../models/productModel');
const ErrorHandler = require('../util/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../util/apiFeatures');

// create product into Product collection(CRUD operations)
exports.createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user.id; // product create krne se phle req,body ki jo user wali
  //value h usme hm login krte wkt jo user ko id assign ki thi(auth.js me isUserAuth fxn me)
  // wo dal dege ie token bnate wkt jo id assign ki thi getjwtToken fxn me
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products from collection
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  // return next(new ErrorHandler('this is temp error',500))
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
  //  console.log(apiFeature);
  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query.clone();

  console.log(products);
  
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
    
  });
});

//get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // return res.status(500).json({
    //   success:false,
    //   message:"product was not found"
    // })

    return next(new ErrorHandler('product not found', 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//update a product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    // return res.status(500).json({
    //   success:false,
    //   message:"product was not found"
    // })
    return next(new ErrorHandler('product not found', 404));
  }
  //if product found
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// delete the product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // return res.status(400).json({
    //   success:false,
    //   message:"product was not found"
    // })
    return next(new ErrorHandler('product not found', 404));
  }

  await Product.findOneAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: 'product deleted successfully',
  });
});

//create and update the reviews
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { comment, rating, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
    rating: Number(rating),
  };

  const product = await Product.findById(productId);
  // console.log(product);
  //chechk here whether the current user who isgiving review has already
  // gave the review on thesame product
  //review dena wala user or req krne wala user same h kya
  console.log(product.reviews);
  const isReviewed = product.reviews.find((rev) => {
    rev.user.toString() === req.user._id.toString();
  });

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });

  product.ratings = avg / product.reviews.length; //this will give avg rating

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get product's All reviews
exports.getProductReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler('product not found', 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete product's review
exports.deleteProductReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler('product not found', 404));
  }
  const reviews = product.reviews.filter((rev) => {
    rev._id !== req.query.reviewId;
  });

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  
  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    },
  );
  res.status(200).json({
    success: true,
  });
});
