const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email , title , body) => {

    try{

        let transporter = nodemailer.createTransport({
            host: process.env.Mail_Host,
            auth:{
                user: process.env.Mail_User,
                pass: process.env.Mail_Pass
            }
        })

        const mailResponse = await transporter.sendMail({

            from: "VeeGo",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log("info" , mailResponse.response);
    }
    catch(error){
        console.error(error)
    }
}

module.exports = mailSender;