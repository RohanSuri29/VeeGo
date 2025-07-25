const express = require('express');
const router  = express.Router();
const {query} = require('express-validator');

const { authentication } = require('../middlewares/authentication');
const { getCoordinates, getDistanceTime, getAutoCompleteSuggestions } = require('../controllers/mapControllers');

router.get('/get-coordinates' , query('address').isString().isLength({min:3}).withMessage("Address should be of minimum length 3") ,authentication , getCoordinates)

router.get('/get-distance-time' , [ 
    query('origin').isString().isLength({min:3}).withMessage("Address should be of minimum length 3"),
    query('destination').isString().isLength({min:3}).withMessage("Address should be of minimum length 3")
] , authentication , getDistanceTime)

router.get('/get-suggestions' , query('input').isString() , authentication , getAutoCompleteSuggestions);

module.exports = router;