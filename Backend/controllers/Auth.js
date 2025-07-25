const User = require("../models/user");
const Otp = require("../models/otp");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator'); 
const {validationResult} = require('express-validator');
const BlackListToken = require("../models/blackListToken");
require('dotenv').config();  

//signup 
exports.signupHandler = async (req , res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(400).json({
                error: error.array()
            })
        }

        const {firstName , lastName , email , password , confirmPassword , otp} = req.body;
    
        if(!firstName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "Please fill the required details"
            })
        }

        if(password !== confirmPassword) {
            return res.status(403),json({
                success: false,
                message: "Passwords do not match"
            })
        }
        
        const user = await User.findOne({email})

        if(user) {
            return res.status(403).json({
                success: false,
                message: "User already exists"
            })
        }

        const recentOtp = await Otp.find({email}).sort({createdAt: -1}).limit(1);
        
        if(recentOtp.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Otp do not found"
            })
        }

        else if(otp !== recentOtp[0].otp){
            return res.status(403).json({
                success: false,
                message: "Otp is invalid"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10); 

        const newUser = await User.create({firstName , lastName , email , password: hashedPassword , image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`});

        if(newUser) {

            const payload={
                id: newUser._id,
                email: newUser.email
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:"4h"})

            newUser.token = token

            const options = {
                httpOnly: true,
                expiresIn: new Date(Date.now() + 3*24*60*60*1000)
            }

            res.cookie("token" , token , options).status(200).json({
                success: true,
                data: newUser,
                token: token,
                message: "User registered successfully"
            })
        }
    }

    catch(error) {

        console.error(error);
        res.status(500).json({
            success:false,
            message:"Unable to signup"
        })
    }
}

//send otp
exports.sendOtp = async (req , res) => {

    try{

        let {email} = req.body;

        if(!email) {
            return res.status(403).json({
                success: false,
                message: "Email is required"
            })
        }

        const user = await User.findOne({email})

        if(user){
            return res.status(403).json({
                success: false,
                message: "User is already registered"
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

        return res.status(200).json({
            success: true,
            message: "Otp sent successfully to your email"
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to send otp"
        })
    }
}

//login
exports.loginHandler = async (req,res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(403).json({
                error: error.array()
            })
        }

        const {email , password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Please provide with required details"
            })
        }

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(404).json({
                succes: false,
                message: "User is not registered"
            })
        }
        
        if(await bcrypt.compare(password , user.password)){

            const payload = {
                id:user._id,
                email:user.email
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:"4h"});

            user.token = token;
            user.password = undefined;
            
            const options = {
                httpOnly: true,
                expires: new Date(Date.now() + 3*24*60*60*1000)
            }

            res.cookie("token" , token , options).status(200).json({
                success: true,
                data: user,
                token: token,
                message: "User is logged in successfully"
            })
        }

        return res.status(403).json({
            success: false,
            message: "Password is incorrect"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to login"
        })
    }
}

//change password
exports.changePasswordHandler = async (req , res) => {

    try{

        const {password , newPassword , confirmNewPassword} = req.body;
        const id = req.user.id;

        const user = await User.findById(id);

        if(!password || !newPassword || !confirmNewPassword){
            return res.status(403).json({
                success: false,
                message: "Please provide with the required details"
            })
        }

        if(!await bcrypt.compare(password , user.password)){
            return res.status(403).json({
                success: false,
                message: "Password is incorrect"
            })
        }

        if(newPassword !== confirmNewPassword){
            return res.status(403).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        let hashedPassword = await bcrypt.hash(newPassword , 10);

        await User.findByIdAndUpdate(id , {password:hashedPassword} , {new:true});

        return res.status(200).json({
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

//logout
exports.logouthandler = async (req,res) => {

    try{

        res.clearCookie('token');

        const token = req?.body?.token || req?.cookies?.token || req?.headers('Authorization').replace('Bearer ' , "");

        await BlackListToken.create({token});

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to logout"
        })
    }
}

//get user profile
exports.getUserProfile = async (req,res) => {

    try{

        const id = req.user.id;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        res.status(200).json({
            success: true,
            data: user,
            message: "user profile fetched successfully"
        })
    }
    catch(error){

        console.error(error);
        return res.status(500).json({
            success: false,
            message:"Unable to fetch user profile"
        })
    }
}

//update user
exports.updateUser = async (req , res) => {

    try{

        const {firstName , lastName , email} = req.body;
        const id = req.user.id;
        
        const captain = await User.findById(id);

        if(firstName && firstName !== undefined){
            captain.firstName = firstName
        }

        if(lastName && lastName !== undefined){
            captain.lastName = lastName
        }

        if(email && email !== undefined){
            captain.email = email
        }

        await captain.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to update captain"
        })
    }
}

//delete user
exports.deleteUser = async (req , res) => {

    try{

        const id = req.user.id;

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "User account deleted successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete user account"
        })
    }
}