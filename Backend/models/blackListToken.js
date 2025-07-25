const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({

    token:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 4*60*60*1000
    }
})

module.exports = mongoose.model('BlackListToken' , blackListTokenSchema);