const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender')
const { otpTemplate } = require('../MailTemplates/otpTemplate');

const otpSchema = new mongoose.Schema({

    email:{
        type: String,
        required: true,
        trim: true
    },
    otp:{
        type: String,
        requird: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60*1000
    }
});

otpSchema.pre('save' , async function(next) {

    try{
        const mailResponse = await mailSender(this.email , "Verification Email from VeeGo" , otpTemplate(this.otp))
    }
    catch(error){
        console.error(error)
    }
    next();
})

module.exports = mongoose.model("Otp" , otpSchema);