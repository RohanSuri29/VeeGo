const cloudinary = require('cloudinary').v2;
require('dotenv').config();

function cloudinaryConnect() {

    cloudinary.config({
        cloud_name: process.env.Cloud_Name,
        api_key: process.env.Api_Key,
        api_secret: process.env.Api_Secret
    })
}

module.exports = cloudinaryConnect;