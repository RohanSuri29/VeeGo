const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        select: false    // --> this field will not be returned in the response using select
    },
    socketId:{
        type: String     // --> it will be used for live tracking of drivers
    },
    token:{
        type: String,
    },
    resetPasswordExpires:{
        type: Date
    },
    image:{
        type: String
    }

})

module.exports = mongoose.model("User" , userSchema);