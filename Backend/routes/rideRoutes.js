const express = require('express');
const router = express.Router();
const {body , query} = require('express-validator');
const { authentication } = require('../middlewares/authentication');
const { createRide, getFare, confirmRide, verifyRide, confirmRideOtp, endRide } = require('../controllers/rideControllers');

router.post('/create-ride' , [
    body('pickup').isString().isLength({min:3}).withMessage("Address should be of minimum length 3"),
    body("destination").isString().isLength({min:3}).withMessage("Address should be of minimum length 3"),
    body("vehicleType").isString().isIn(["auto" , "car" , "moto"]).withMessage("Inavlid vehicle type")
] , authentication , createRide)

router.get('/get-fare' , [
    query('origin').isString().isLength({min:3}).withMessage("Address shoukd be of minimum length 3"),
    query('destination').isString().isLength({min:3}).withMessage("Address shoukd be of minimum length 3")
] , authentication , getFare);

router.post('/confirm-ride', body('rideId').isMongoId().withMessage("Inavlid ride id") , authentication , confirmRide)

router.post('/verify-ride' , body('email').isEmail().withMessage("Inavlid email") , authentication , verifyRide);

router.post('/confirm-ride-otp' , body('email').isEmail().withMessage("Please provide with required details") , authentication , confirmRideOtp)

router.post('/end-ride' , body('rideId').isMongoId().withMessage("Invalid ride id") , authentication , endRide);

module.exports = router;