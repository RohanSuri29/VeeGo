const jwt = require('jsonwebtoken');
const BlackListToken = require('../models/blackListToken');
require('dotenv').config();

exports.authentication = async (req , res , next) => {

    try{

        const token = req?.body?.token || req?.cookies?.token || req?.header("Authorization")?.replace('Bearer ' , "");
        
        if(!token) {
            res.status(403).json({
                success: false,
                message: "token is empty"
            })
        }

        const isBlackListed = await BlackListToken.findOne({token:token});

        if(isBlackListed){

            return res.status(200).json({
                success: false,
                message: "Token is invalid"
            })
        }

        try{
            
            const decode = jwt.verify(token , process.env.JWT_SECRET);

            req.user = decode;
        }
        catch(error){
            console.error(error);
            return res.status(401).json({
                success: false,
                message: "Authentication failed"
            })
        }
        next();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        })
    }
}