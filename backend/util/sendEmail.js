const nodeMailer = require('nodemailer')

const sendEmail = async (options)=>{
//    console.log(options.message);
    const transporter= nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        service:process.env.SMTP_SERVICE,
        port:process.env.SMTP_PORT,
        auth:{
         user:process.env.SMTP_MAIL,
         pass:process.env.SMTP_PASSWORD

        }
    })
  
    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
   
     await transporter.sendMail(mailOptions)
    //  console.log(mailOptions);
}



module.exports = sendEmail;