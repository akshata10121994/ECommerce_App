const mongoose = require('mongoose')
const objectId = new mongoose.Types.ObjectId();

console.log(objectId); // This will log a valid ObjectId

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    price: {
        type: Number,
        required: true,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    Stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.ObjectId,
                required:true,
                ref:"User"
              },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },

    //kisne product bnai h uske liye niche wala field
    //for eg agr mai ya mere partner ne product create ki h to pta chlna chahiye
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
      },

})

// creating collection of name "Product"
module.exports = mongoose.model("Product", productSchema);