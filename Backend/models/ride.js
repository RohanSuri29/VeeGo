const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captainId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    },
    pickup:{
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    fare:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['pending' , 'accepted' , 'ongoing' , 'completed' , 'cancelled'],
        default: 'pending'
    },
    distance:{
        type: Number //in seconds
    },
    duration:{
        type: Number //in meters
    },
    paymentId:{
        type: String
    },
    orderId:{
        type: String
    },
    signature:{
        type: String
    }
});

module.exports = mongoose.model("Ride" , rideSchema);