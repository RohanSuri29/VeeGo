const { validationResult } = require("express-validator");
const Otp = require('../models/otp');
const bcrypt = require("bcrypt");
const Captain = require("../models/captain");
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator');
require('dotenv').config();

//signup
exports.captainSignup = async (req , res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()) {
            return res.status(401).json({
                error: error.array()
            })
        }

        const {firstName , lastName , email , password , confirmPassword , vehicleName , vehiclePlate , vehicleCapacity, vehicleType , otp} = req.body;

        if(!firstName || !email || !password || !confirmPassword || !vehicleName || !vehiclePlate || !vehicleCapacity || !vehicleType){
            return res.status(403).json({
                success: false,
                message: "Please provide with required details"
            })
        }

        const user = await Captain.findOne({email});

        if(user){
            return res.status(403).json({
                success: false,
                message: "Captain already exists"
            })
        }

        if(password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        const recentOtp = await Otp.find({email}).sort({createdAt: -1}).limit(1);

        if(recentOtp.length === 0){
            return res.status(404).json({
                success: false,
                message: "Otp not found"
            })
        }

        if(otp !== recentOtp[0].otp){
            return res.status(403).json({
                success: false,
                message: "Otp is incorrect"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const newCaptain = await  Captain.create({firstName , lastName , email , password:hashedPassword , vehicleName , vehiclePlate , vehicleCapacity , vehicleType , image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`});

        if(newCaptain){

            const payload = {
                id: newCaptain._id,
                email: newCaptain.email
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:"4h"});
            
            newCaptain.token = token;

            const options ={
                httpOnly: true,
                expiresIn: 3*24*60*60*1000
            }

            res.cookie('token' , token , options).status(200).json({
                success: true,
                data: newCaptain,
                token: token,
                message: "Captain resgistered successfully"
            })
        }
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to signup"
        })
    }
}

//login
exports.captainLogin = async(req , res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()) {
            return res.status(403).json({
                error: error.array()
            })
        }

        const {email , password} = req.body;

        if(!email || !password) {
            return res.status(401).json({
                success: false,
                message: "Please provide with required details"
            })
        }

        const captain = await Captain.findOne({email}).select('+password');

        if(!captain){
            return res.status(404).json({
                success: false,
                message: "Captain is not registered"
            })
        }

        if(await bcrypt.compare(password , captain.password)) {

            const payload = {
                id: captain._id,
                email: captain.email
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:"4h"});

            captain.token = token;

            const options = {
                httpOnly: true,
                expiresIn: 3*24*60*60*1000
            }

            res.cookie("token" , token , options).status(200).json({
                success: true,
                data: captain,
                token: token,
                message: "Logged in sucessfully" 
            })
        }
        else{
            return res.status(403).json({
                success: false,
                message: "Password is incorrect"
            })
        }
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to login"
        })
    }
}

//get captain profile
exports.getCaptainProfile = async (req , res) => {

    try{

        const id = req.user.id;

        const captain = await Captain.findById(id);

        if(!captain){
            return res.status(404).json({
                success: false,
                message: "Captain not found"
            })
        }

        res.status(200).json({
            success: true,
            data: captain,
            message: "Captain details fetched successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to get captain profile"
        })
    }
}

//change password
exports.changePasswordCaptain = async(req , res) => {

    try{

        const {password , newPassword , confirmNewPassword} = req.body;
        const id = req.user.id

        if(!password || !newPassword || !confirmNewPassword){
            return res.status(403).json({
                success: false,
                message: "Please provide with the required details"
            })
        }

        const captain = await Captain.findById(id).select("+password");

        if(!await bcrypt.compare(password , captain.password)){
            return res.status(403).json({
                success: false,
                message: "Your password is incorrect"
            })
        }

        if(newPassword !== confirmNewPassword){

            return res.status(403).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10);

        await Captain.findByIdAndUpdate(id , {password: hashedPassword} , {new: true});

        res.status(200).json({
            success: true,
            message: "Your password is changed successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to change password"
        })
    }
}

//sendOtp
exports.sendotpCaptain = async(req , res) => {

    try{

        const {email} = req.body;

        if(!email) {
            return res.status(403).json({
                success: false,
                message: "plaese provide with the email"
            })
        }

        const captain = await Captain.findOne({email});

        if(captain) {
            return res.status(403).json({
                success: false,
                message: "Captain already exists"
            })
        }

        var otp = otpGenerator.generate(6 , {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        let result = await Otp.findOne({otp:otp});

        while(result){

            otp = otpGenerator.generate(6 , {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })

            result = await Otp.findOne({otp:otp})
        }

        await Otp.create({email , otp});

        res.status(200).json({
            success:true,
            message:"Otp sent successfully to your email"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: "Unable to send otp"
        })
    }
}

//updateCaptain
exports.updateCaptain= async (req , res) => {
    
    try{

    
    }   
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to update captain profile"
        })
    }
}

//delete captain
exports.deleteCaptain = async(req , res) => {

    try{

        const id = req.user.id;

        await Captain.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Captain account deleted successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete captain account"
        })
    }
}