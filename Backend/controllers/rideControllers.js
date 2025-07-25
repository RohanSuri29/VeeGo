require('dotenv').config();
const axios = require('axios');
const { validationResult } = require('express-validator');
const Ride = require('../models/ride');
const Otp = require('../models/otp');
const {getCaptainsInTheRadius, getAddressCoordinate , } = require('../services');
const { sendMessageToSocketId } = require('../socket');
const User = require('../models/user');
const otpGenerator = require('otp-generator'); 

//get fare
exports.getFare = async (req , res) => {

    try{
        
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {origin , destination} = req.query;

        if(!origin || !destination) {
            return res.status(403).json({
                success: false,
                message: "Please provide qith the required details"
            })
        }

        const apiKey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

        const response = await axios.get(url);

        if(response?.data?.status !== 'OK') {
            throw new Error("Unable to get distance and time")
        }

        if(response?.data?.rows[0]?.elements[0]?.status === 'ZERO_RESULTS') {
            throw new Error('No Routes Found');
        }

        const distanceTime = response?.data?.rows[0]?.elements[0];

        const baseFare = {
            auto: 30,
            car: 50,
            moto: 20
        }

        const perKmRate = {
            auto: 10,
            car: 15,
            moto: 8
        }

        const perMinuteRate = {
            auto: 2,
            car: 3,
            moto: 1.5
        }

        const fare = {
            auto: Math.round(baseFare.auto + ((distanceTime.distance.value/1000) * (perKmRate.auto)) + ((distanceTime.duration.value/60) * (perMinuteRate.auto))),
            car: Math.round(baseFare.car + ((distanceTime.distance.value/1000) * (perKmRate.car)) + ((distanceTime.duration.value/60) * (perMinuteRate.car))),
            moto: Math.round(baseFare.moto + ((distanceTime.distance.value/1000) * (perKmRate.moto)) + ((distanceTime.duration.value/60) * (perMinuteRate.moto)))
        }

        res.status(200).json({
            success: true,
            data: fare,
            message: "Fare calculated successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to get fare"
        })
    }
}

//create ride
exports.createRide = async (req , res) => {

    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {pickup , destination , vehicleType} = req.body;
        const id = req.user.id;

        if(!pickup || !destination || !vehicleType) {
            return res.status(403).json({
                success: false,
                message: "Please provide with required details"
            })
        }

        const apiKey = process.env.GOOGLE_MAPS_API
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

        const response = await axios.get(url);

        if(response?.data?.status !== 'OK') {
            throw new Error("Unable to get distance and time")
        }

        if(response?.data?.rows[0]?.elements[0]?.status === 'ZERO_RESULTS') {
            throw new Error('No Routes Found');
        }

        const distanceTime = response?.data?.rows[0]?.elements[0];

        const baseFare = {
            auto: 30,
            car: 50,
            moto: 20
        }

        const perKmRate = {
            auto: 10,
            car: 15,
            moto: 8
        }

        const perMinuteRate = {
            auto: 2,
            car: 3,
            moto: 1.5
        }

        const fare = {
            auto: Math.round(baseFare.auto + ((distanceTime.distance.value/1000) * (perKmRate.auto)) + ((distanceTime.duration.value /60) * (perMinuteRate.auto))),
            car: Math.round(baseFare.car + ((distanceTime.distance.value/1000) * (perKmRate.car)) + ((distanceTime.duration.value /60) * (perMinuteRate.car))),
            moto: Math.round(baseFare.moto + ((distanceTime.distance.value/1000) * (perKmRate.moto)) + ((distanceTime.duration.value /60) * (perMinuteRate.moto)))
        }

        const ride = await Ride.create({userId:id , pickup , destination , vehicleType , distance:distanceTime.distance.value/1000 , fare:fare[vehicleType]})
        
        res.status(200).json({
            success: true,
            data: ride,
            message: "Ride created successfully"
        })

        const pickupCoordinates = await getAddressCoordinate(pickup)
        
        const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.ltd , pickupCoordinates.lng , 2);

        const rideWithUser = await Ride.findOne({_id:ride._id}).populate('userId')

        captainsInRadius?.map((captain) => {
            
            sendMessageToSocketId(captain?.socketId , {
                event: 'new-ride',
                data: rideWithUser
            })
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to create ride"
        })
    }
}

//confirm ride
exports.confirmRide = async(req , res) => {

    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {rideId} = req.body;
        const id = req.user.id;

        if(!rideId) {
            return res.status(403).json({
                success: false,
                message: "Please provide with ride id"
            })
        }

        await Ride.findByIdAndUpdate(rideId , {status:"accepted" , captainId:id} , {new:true});

        const ride = await Ride.findById(rideId).populate('captainId').populate('userId');

        if(!ride){
            return res.status(403).json({
                success: false,
                message: "unable to find the ride"
            })
        }

        sendMessageToSocketId(ride?.userId?.socketId , {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json({
            success: true,
            data: ride,
            message: "Ride found successfully"
        })
    }
    catch(error){

        console.error(error);
        return res.status(500).json({
            succesS: false,
            message: "Unable to confirm ride"
        })
    }
}

//verify Ride
exports.verifyRide = async(req,res) => {

    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {otp , email , rideId} = req.body;

        if(!otp || !email || !rideId) {
            return res.status(403).json({
                success: false,
                message: "Please provide with the essential details"
            })
        }

        const recentOtp = await Otp.find({email}).sort({createdAt: -1}).limit(1);

        if(recentOtp.length === 0){
            return res.status(404).json({
                success: false,
                message: "Otp do not found"
            })
        }

        if(otp !== recentOtp[0].otp) {
            return res.status({
                success: false,
                message: "Otp is incorrect"
            })
        }

        const updatedRide = await Ride.findByIdAndUpdate(rideId , {status:"ongoing"} , {new: true}).populate('userId');

        sendMessageToSocketId(updatedRide?.userId?.socketId , {
            event: 'ride-started',
            data: updatedRide
        })

        res.status(200).json({
            success: true,
            message: "Your Ride is Confirmed Successfully"
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to verify your ride"
        })
    }
}

//send confirm ride otp 
exports.confirmRideOtp = async (req , res) => {

    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {email} = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.status(403).json({
                success: false,
                message: "User does not exist"
            })
        }

        let otp = otpGenerator.generate(6 , {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        let result = await Otp.findOne({otp:otp});

        while(result) {

            otp = otpGenerator.generate(6 , {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            
            result = await Otp.findOne({otp:otp})
        }

        await Otp.create({email , otp});

        res.status(200).json({
            success: true,
            message: "Otp sent Successfully"
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

//end ride
exports.endRide = async (req , res) => {

    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {rideId} = req.body;
        const id = req?.user?.id;

        if(!rideId) {
            return res.status(403).json({
                success: false,
                message: "Please provide with the required details"
            })
        }

        const ride = await Ride.findOne({_id:rideId , captainId:id}).populate('userId').populate('captainId');

        if(!ride){
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            })
        }

        if(ride?.status !== "ongoing"){
            return res.status(403).json({
                success: false,
                message: "Ride is not ongoing"
            })
        }

        await Ride.findByIdAndUpdate(rideId , {status:"completed"} , {new:true})

        sendMessageToSocketId(ride?.userId?.socketId , {
            event: 'ride-ended',
            data: ride
        })

        res.status(200).json({
            success: true,
            message: "your ride ended successfully"
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to end ride"
        })
    }
}