const axios = require('axios');
const { validationResult } = require('express-validator');
require('dotenv').config();

//get Coordinates
exports.getCoordinates = async(req , res) => {

    try{

        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {address} = req.query;
        const apiKey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        const response = await axios.get(url);
    
        if(response?.data?.status !== 'OK') {
            throw new Error("Unable to get Coordinates")
        }

        const location = response?.data?.results[0]?.geometry?.location;

        const coordinates = {
            ltd: location.lat,
            lng: location.lng
        }

        res.status(200).json({
            success: true,
            data: coordinates,
            message: "Coordinates fetched successfully"
        })
    }
    catch(error){

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to get coordinates"
        })
    }
}

//get Distance and Time
exports.getDistanceTime = async (req , res) => {

    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {origin , destination} = req.query;

        if(!origin || !destination){
            return res.status(403).json({
                success: false,
                message: "Please provide the required details"
            })
        }

        const apiKey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

        const response = await axios.get(url);

        if(response?.data?.status !== 'OK'){
            throw new Error("Unable to get distance and time");
        }

        if(response?.data?.rows[0]?.elements[0]?.status === 'ZERO_RESULTS') {
            throw new Error('No Routes Found');
        }

        const distanceTime = response?.data?.rows[0]?.elements[0];

        res.status(200).json({
            success: true,
            data: distanceTime,
            message: "Successfully fetched distance and time"
        })
    }
    catch(error){

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch ditsance and time"
        })
    }
}

//get autocomplete suggestions
exports.getAutoCompleteSuggestions = async (req , res) => {

    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(403).json({
                error: errors.array()
            })
        }

        const {input} = req.query;

        if(!input){
            return res.status(403).json({
                success: false,
                message: "Please provide with required input"
            })
        }

        const apiKey = process.env.GOOGLE_MAPS_API
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
        
        const response = await axios.get(url);

        if(response?.data?.status !== 'OK'){
            throw new Error('Unable to get suggestions')
        }
        
        const suggestions = response?.data?.predictions;

        res.status(200).json({
            success: true,
            data: suggestions,
            message: "Suggestions fetched successfully"
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to get suggesstions"
        })
    }
}