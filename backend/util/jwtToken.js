const sendToken = (user,statusCode,res)=>{
    //creating token here, logic of this token creation is written
    //into the userSchema file
    const token = user.getJWTToken()

    //making options to pass into the cookie
    const options = {
        expiresIn: new Date(
            Date.now() + process.env.COOKIE_EXPIRE,
        ),
        httpOnly:true
    }
     
    //res me cookie bhi send krege.
    //cookie send krte wkt usme token bhi send krege n properties of cookie 
    //which is specified in options.
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
    })
}

module.exports = sendToken;