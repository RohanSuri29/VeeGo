const mongoose = require('mongoose');
require('dotenv').config();

function dbConnect() {

    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Databse connected Successfully'))
    .catch((error) => console.error(error))
}

module.exports = dbConnect;