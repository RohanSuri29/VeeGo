const REACT_APP_BASE_URL = 'http://localhost:4000/api/v1'
const BASE_URL = REACT_APP_BASE_URL;

export const userEndpoints = {
    User_login_api: BASE_URL + '/auth/login',
    User_Signup_api: BASE_URL + '/auth/signup',
    User_SendOtp_api: BASE_URL + '/auth/sendotp',
    User_Logout_api: BASE_URL + '/auth/logout',
    User_ResetToken_api: BASE_URL + '/auth/forgot-password',
    User_ResetPassword_api: BASE_URL + '/auth/update-password',
}

export const captainEndpoints = {
    Captain_login_api: BASE_URL + '/captain/captain-login',
    Captain_Signup_api: BASE_URL + '/captain/captain-signup',
    Captain_SendOtp_api: BASE_URL + '/captain/sendotp-captain',
    Captain_Logout_api: BASE_URL + '/captain/captain-logout',
    Captain_ResetToken_api: BASE_URL + '/captain/forgot-password-captain',
    Captain_ResetPassword_api: BASE_URL + '/captain/update-password-captain'
}

export const mapEndpoints = {
    Map_get_suggestions: BASE_URL + '/map/get-suggestions'
}

export const rideEndpoints = {
    Ride_createRide_api: BASE_URL + '/ride/create-ride',
    Ride_getFare_api: BASE_URL + '/ride/get-fare',
    Ride_confirmRide_api: BASE_URL + '/ride/confirm-ride',
    Ride_verifyRide_api: BASE_URL + '/ride/verify-ride',
    Ride_confirmRideOtp_api: BASE_URL + '/ride/confirm-ride-otp',
    Ride_endRide_api: BASE_URL + '/ride/end-ride'
}