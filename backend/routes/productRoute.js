const express = require('express');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  deleteProductReview,
  getProductReview,
} = require('../controller/productController');
const { isAuthenticatedUser, isAuthorizeRole } = require('../middleware/auth');

const router = express.Router();

router.route('/products').get(getAllProducts);

router
  .route('/admin/product/new')
  .post(isAuthenticatedUser, isAuthorizeRole('admin'), createProduct);

router
  .route('admin/products/:id')
  .put(isAuthenticatedUser, isAuthorizeRole('admin'), updateProduct)
  .delete(isAuthenticatedUser, isAuthorizeRole('admin'));

router.route('/products/:id').get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route('/reviews').get(getProductReview).delete(isAuthenticatedUser,deleteProductReview)


module.exports = router;
