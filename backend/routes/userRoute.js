const express = require('express');
const {
  registerUser,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require('../controller/userController');
const router = express.Router();
const { isAuthenticatedUser, isAuthorizeRole } = require('../middleware/auth');

router.route('/register').post(registerUser);

router.route('/login').post(userLogin);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(userLogout);

router.route('/me').get(isAuthenticatedUser, getUserDetails);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router
  .route('/me/update')
  .put(isAuthenticatedUser, isAuthorizeRole, updateProfile);

router
  .route('/admin/users')
  .get(isAuthenticatedUser, isAuthorizeRole('admin'), getAllUser);

router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, isAuthorizeRole('admin'), getSingleUser)
  .put(isAuthenticatedUser,isAuthorizeRole('admin'),updateUserRole)
  .delete(isAuthenticatedUser,isAuthorizeRole('admin'),deleteUser)

module.exports = router;
