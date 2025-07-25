require('dotenv').config(); //load environment variables from.env file
const express = require('express'); //instance of express
const http = require('http');
const cors = require('cors'); //to accept the requuests from the frontend
const dbConnect = require('./config/dbConnect'); //connect to MongoDB
const authRoutes = require('./routes/auth.routes');
const captainRoutes = require('./routes/captainRoutes');
const mapRoutes = require('./routes/mapRoutes');
const rideRoutes = require('./routes/rideRoutes')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinaryConnect = require('./config/cloudinary');
const { initializeSocket } = require('./socket');

const port = process.env.PORT || 4000;

const app = express(); //creating an instance of express
const server = http.createServer(app);

initializeSocket(server);

//listening on the port
server.listen(port , () => {
    console.log(`Server is running successfully at port number ${port}`)
})

//middlewares
app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use('/api/v1/auth' , authRoutes);
app.use('/api/v1/captain' , captainRoutes);
app.use('/api/v1/map' , mapRoutes);
app.use('/api/v1/ride' , rideRoutes)

//default route
app.get('/' , (req,res) => {
    res.send('Your server is started successfully')
})

dbConnect(); 
cloudinaryConnect();
