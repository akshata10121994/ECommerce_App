const ErrorHandler = require('../util/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../util/jwtToken');
const sendEmail = require('../util/sendEmail');
const crypto = require('crypto');
const cloudinary = require("cloudinary");


//create user ie registration process
exports.registerUser = catchAsyncError(async (req, res, next) => {
  // Assuming that you are sending the image file in the request body with the name 'avatar'
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

   
  const { name, email, password } = req.body;

  // Create a new user in the database
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  console.log(user);

  // Send the token in the response
  sendToken(user, 201, res);
});

//user login

exports.userLogin = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  //if req.body me email password nhi aya to
  if (!email || !password) {
    return next(new ErrorHandler('Please Enter Email or Password', 400));
  }

  //database me user ko find kro
  // const user = await User.findOne({ email }).select('+password');
  const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } }).select('+password');

console.log(user);
  //agr database me user nhi mila to
  if (!user) {
    return next(new ErrorHandler('Please Enter valid Email or Password', 401));
  }

  //agr db me user mil gya login wala to fir password ko compare kro
  const isPasswordMatched = await user.comparePassword(password);
  //agr password match nhi hua to
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Please Enter valid Email or Password', 401));
  }

  //if password match hogya to token bnakr response dedo
  sendToken(user, 200, res);
});

//forgot password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  // console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  console.log(user);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const resetToken = user.getResetPasswordToken();

  //saving token into the db user document
  await user.save({ validateBeforeSave: false });

  //making url to send
  const resetPasswordUrl = `${process.env.FRONTEND_URL}://${req.get(
    'host',
  )}/password/reset/${resetToken}`;

  const message = `your password reset token is :- \n\n${resetPasswordUrl}\n\nif you have 
   not requested this token then please ignore it`;
  // console.log(message);

  try {
    await sendEmail({
      email: user.email,
      subject: `ecommerce reset password`,
      message,
    });
    console.log(message);
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    //if error occurs to db user document se token ko hatayege
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // console.log(user);

  if (!user) {
    return next(
      new ErrorHandler(
        'reset password token is invalid or has been expired',
        404,
      ),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('password does not match', 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//logout user
exports.userLogout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'logged out successfully',
  });
});

//get userDetails
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('old password is incorect', 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('password does not match', 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//update users profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  console.log(newUserData);
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user
  });
});

//Get all users (by ADMIN)

exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`),
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
   success:true,
   user,
  })
});

// Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
   const user = await User.findById(req.params.id);
   if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
})
