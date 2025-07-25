const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { signupHandler, loginHandler, logouthandler, getUserProfile, sendOtp } = require('../controllers/Auth');
const { authentication } = require('../middlewares/authentication');
const { resetPasswordToken, resetPassword } = require('../controllers/ResetPassword');

router.post('/signup' , [
    body('email').isEmail().withMessage('Invalid Email'),
    body('firstName').isLength({min:3}).withMessage("First name should be of atleast 3 characters"),
    body('lastName').isLength({min:3}).withMessage('last name should be of atleast 3 characters'),
    body('password').isLength({min:6}).withMessage("Password should be of atleast 6 characters")
] , signupHandler)

router.post('/login' , [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage("Password should be of atleast 6 characters")
] , loginHandler)

router.post('/sendotp' , sendOtp)
router.post('/forgot-password' , resetPasswordToken)
router.post('/update-password' , resetPassword)
router.get('/logout' , authentication , logouthandler);
router.get('/getUser' , authentication , getUserProfile);

module.exports = router