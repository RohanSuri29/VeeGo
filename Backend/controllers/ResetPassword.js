const User = require("../models/user");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mailSender = require("../utils/mailSender");
const { resetPasswordTemplate } = require("../MailTemplates/resetTemplate");
const Captain = require("../models/captain");

//reset password for user
exports.resetPassword = async (req , res) => {

    try{

        const {newPassword , confirmNewPassword , token} = req.body;

        if(!newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: "please provide with your new password"
            })
        }

        if(newPassword !== confirmNewPassword){
            return res.status(403).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Token is invalid"
            })
        }

        if(user.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success: false,
                message: "token to reset password expires"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10);

        await User.findOneAndUpdate({token} , {password: hashedPassword} , {new:true});

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to reset password"
        })
    }
}

//reset password token for user
exports.resetPasswordToken = async(req , res) => {

    try{

        const {email} = req.body;

        if(!email) {
            return res.status(403).json({
                success: false,
                message: "Please provide with the required email"
            })
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Unable to find user for the email"
            })
        }

        const token = crypto.randomBytes(20).toString('hex');

        await User.findOneAndUpdate({email} , {token:token , resetPasswordExpires: Date.now() + 5*60*1000} , {new: true});

        const url = `http://localhost:3000/update-password/${token}`

        await mailSender(email , "Request to Reset Password" , resetPasswordTemplate(url , `${user?.firstName}`))

        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to send email to resetPassword"
        })
    }
}

//reset password token for captain
exports.resetPasswordCaptainToken = async(req , res) => {

    try{

        const {email} = req.body;

        if(!email) {
            return res.status(403).json({
                success: false,
                message:"Please provide with the email to reset password"
            })
        }

        const captain = await Captain.findOne({email});

        if(!captain){
            return res.status(403).json({
                success: false,
                message: "Captain does not exist for the email"
            })
        }

        const token = crypto.randomBytes(20).toString('hex');

        await Captain.findOneAndUpdate({email} , {token:token , resetPasswordExpires:Date.now()+5*60*1000} , {new:true});

        const url = `http://localhost:3000/update-password-captain/${token}`;

        const mailResponse = await mailSender(email , "Request to Reset Password" , resetPasswordTemplate(url , `${captain?.firstName}`))
        
        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to send email to reset password"
        })
    }
}

//reset password for captain
exports.resetPasswordCaptain = async(req,res) => {

    try{

        const {newPassword , confirmNewPassword , token} = req.body;

        if(!newPassword || !confirmNewPassword || !token) {
            return res.status(403).json({
                success: false,
                message: "Please provide with the required details to reset password"
            })
        }

        if(newPassword !== confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        const captain = await Captain.findOne({token});

        if(!captain){
            return res.status(403).json({
                success: false,
                message: "Token is invalid"
            })
        }

        if(captain.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success: false,
                message: "Token to reset password is expired"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10);

        await Captain.findOneAndUpdate({token} , {password:hashedPassword} , {new:true});

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to reset password"
        })
    }
}