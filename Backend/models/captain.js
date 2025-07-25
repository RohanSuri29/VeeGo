const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({

    firstName: {
        type: String,
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
        select: false
    },
    socketId:{
        type: String
    },
    status:{
        type: String,
        enum: ["active" , "inactive"],
        default: "active"
    },   
    vehicleName:{
        type: String,
        required: true
    },
    vehiclePlate:{
        type: String,
        required: true
    },
    vehicleCapacity:{
        type: Number,
        required: true
    },
    vehicleType:{
        type: String,
        required: true,
        enum: ["car" , "auto" , "moto"]
    },
    location:{
        ltd:{
            type:Number,
        },
        lng:{
            type:Number,
        },
    },    
    token:{
        type: String
    },
    resetPasswordExpires:{
        type: Date,
    },
    image:{
        type: String
    }
})

module.exports = mongoose.model("Captain" , captainSchema)