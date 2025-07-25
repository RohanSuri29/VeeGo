const express = require('express');
const { body } = require('express-validator');
const { captainSignup, getCaptainProfile, captainLogin, sendotpCaptain } = require('../controllers/captainControllers');
const { authentication } = require('../middlewares/authentication');
const { logouthandler } = require('../controllers/Auth');
const { resetPasswordCaptainToken, resetPasswordCaptain } = require('../controllers/ResetPassword');
const router = express.Router();

router.post('/captain-signup' , [
    body('email').isEmail().withMessage('Invalid Email'),
    body('firstName').isLength({min:3}).withMessage('firstName should have atleast 3 characters'),
    body('lastName').isLength({min:3}).withMessage("lastName should have atleast 3 characters"),
    body('password').isLength({min:6}).withMessage("Password should have atleast 6 characters "),
    body('vehicleName').isLength({min:3}).withMessage("Name should have atleast 3 characters"),
    body('vehiclePlate').isLength({min:3}).withMessage("Plate number should have atleast 3 characters"),
    body('vehicleCapacity').isLength({min:1}).withMessage("Capacity must be atleast 1")
] , captainSignup)

router.post('/captain-login' , [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should have atleast 6 characters')
] , captainLogin)

router.post('/sendotp-captain' , sendotpCaptain)
router.post('/forgot-password-captain' , resetPasswordCaptainToken)
router.post('/update-password-captain' , resetPasswordCaptain)
router.get('/getCaptain' , authentication , getCaptainProfile)
router.get('/captain-logout' , authentication , logouthandler)

module.exports = router