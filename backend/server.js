const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const cloudinary = require("cloudinary");


//uncaught exception error handling(sbse upr likhna)
process.on("uncaughtException",(err)=>{
    console.log(`error:${err.message}`);
    console.log(`server is shutting down due to uncaught exception`);
    process.exit(1);
})

dotenv.config({path:"backend/config/config.env"})

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})
const server = app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})

//uncaught exception bcz youtube is not defined
// console.log(youtube);

//handling unhandled promise rejections like mongodb connection path galat likh diya
process.on("unhandledRejection",(err)=>{
console.log(`error:${err.message}`);
console.log(`server is shutting down due to unhandled promise rejections`);
server.close();
process.exit(1);
})