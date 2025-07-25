const Captain = require("./models/captain");
const axios = require('axios');

//captains in the radius of 2km
exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  
    const captains = await Captain.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd , lng], radius / 6371 ]
            }
        }
    });

    return captains;
}

//coordinates of pickup address
exports.getAddressCoordinate = async (address) => {

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {

        const response = await axios.get(url);

        if (response?.data?.status === 'OK') {

            const location = response?.data?.results[ 0 ]?.geometry?.location;

            return {
                ltd: location.lat,
                lng: location.lng
            };
        } 
        else {
            throw new Error('Unable to fetch coordinates');
        }

    } 
    catch (error) {

        console.error(error);
        throw new Error("Unable to get coordinates")
    }
}