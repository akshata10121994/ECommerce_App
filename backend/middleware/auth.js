const ErrorHandler = require('../util/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')


//isUseAuth hmne login krte wk user verification ke liye bnaya h
exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
   const {token} = req.cookies
   if(!token){
    return next(new ErrorHandler("please Login to access this resource"))
   }
   
  decodedData =  jwt.verify(token, process.env.JWT_SECRET)
      // console.log(decodedData);
      //jabtk login rhega to req mese user ka data access kr skte h
      //req.user ki value me id dal dege us token ki
      // jb bhi login kr rhe h to user ka data req.user me store krhe h
    req.user =await User.findById(decodedData.id)
  // console.log('req.user:',req.user);
  // console.log('req.cookies:',req.cookies);
  // console.log('req.user.role:',req.user.role);
    next();
})

exports.isAuthorizeRole = (...roles)=>{
  return (req,res,next)=>{
   if( !roles.includes(req.user.role)){
    return next(new ErrorHandler(`Role:${req.user.role} is not allowed to access this resource`)
   ,403)}
   next();
  }
}


