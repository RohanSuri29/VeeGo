const cloudinary = require('cloudinary').v2;

function isSupported(type , supportedType) {
    return supportedType.includes(type);
}

const imageUploader = async (file , folder) => {

    const supportedType = ['jpeg' , "png" , "jpg"];
    const type = file.name.split(".")[1].toLowerCase(); 

    if(!isSupported(type , supportedType)) {
        throw new Error("File is not supported")
    }

    const options = {folder};
    options.resourceType = auto;

    return await cloudinary.uploader.upload(file.tempFilePath , options);
}

module.exports = imageUploader;