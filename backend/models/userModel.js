const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
   
 createdAt:{
  type: Date,
  default:Date.now
 },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// console.log(userSchema);

//hashing the password while registering and changing the password
userSchema.pre('save', async function (next) {
  //agr password change nhi kr rha n no registeration for first time
  //normal login then no password hashing direct next() fxn call kro
  if (!this.isModified('password')) {
    next()
  }

  //phli bar password arha h tb nd password change kr rha h tb dono time hash krna h
  this.password = await bcrypt.hash(this.password, 10);
})

//creating token for cookies
userSchema.methods.getJWTToken = function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRE
  })
}

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.getResetPasswordToken = function(){
  //generating token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash('sha256')
  .update(resetToken).digest('hex')
   

  this.resetPasswordExpire = Date.now() + 15*60*1000;
   
  return resetToken;

  
}

module.exports = mongoose.model("User", userSchema);