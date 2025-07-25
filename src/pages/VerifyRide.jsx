import { useContext, useState } from "react"
import toast from "react-hot-toast"
import { BiArrowBack } from "react-icons/bi"
import { RxCountdownTimer } from "react-icons/rx"
import OTPInput from "react-otp-input"
import { NavLink, useNavigate } from "react-router-dom"
import apiConnector from "../services/apiConnector"
import { captainEndpoints, rideEndpoints, userEndpoints } from "../services/api"
import { UserData } from "../context/Context"

function VerifyRide() {

    const [otp , setotp] = useState("");
    const {ride , token} = useContext(UserData);
    const[loading , setLoading] = useState(false);
    const navigate = useNavigate();

  async function HandleSubmit(event) {

    event.preventDefault();
     
    setLoading(true);
    const toastId = toast.loading("Loading...");

    try{

      const response = await apiConnector("POST" , rideEndpoints.Ride_verifyRide_api , {email:ride?.userId?.email , otp , rideId:ride?._id} , {Authorization:`Bearer ${token}`});

      if(!response?.data?.success) {
        throw new Error(response?.data?.message)
      }

      toast.success("Ride Confirmed Successfully");     
      navigate('/captain-riding');

    }
    catch(error){
      console.error(error);
      toast.error("Unable to confirm ride")
    }

    setLoading(false);
    toast.dismiss(toastId);

  }

  async function otpHandler() {
        
    const toastId = toast.loading("Loading...")

    try{

      const response = await apiConnector("POST" , rideEndpoints.Ride_confirmRideOtp_api , {email:ride?.userId?.email}  , {Authorization:`Bearer ${token}`})

      if(!response?.data?.success){
          throw new Error(response?.data?.message)
      }

      toast.success("Otp sent successfully")
      navigate('/verify-ride')

    }
    catch(error){
      console.error(error);
      toast.error("Unable to send otp")
    }

    toast.dismiss(toastId)
  }
    
  return (
        
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
            
      <div className="max-w-[500px] p-4 lg:p-8">

        <h1 className="text-black font-semibold text-[1.875rem] leading-[2.375rem]">Confirm Your Ride</h1>

        <p className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-700">
          A verification code has been sent to the user. Enter the code below
        </p>

        <form onSubmit={HandleSubmit}>

          <OTPInput 
            value={otp} 
            onChange={setotp} 
            numInputs={6} 
            renderInput={ (props) => (<input {...props} placeholder="-" className="sm:min-w-14 min-w-12 border-0 bg-gray-300 rounded-[0.5rem] aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-500 inset-shadow-[0px_-1px_0px_rgba(255,255,255,0.18)]"/>)}
            containerStyle={{ justifyContent:"space-between", gap:"0 6px"}}
          />

          <button disabled={loading} type="submit" className="w-full bg-green-600 text-white py-[10px] px-[12px] rounded-[8px] mt-6 font-semibold text-xl">
            Confirm
          </button>

        </form>

        <button className="flex items-center justify-center text-blue-600 gap-x-1" onClick={otpHandler}>
          <RxCountdownTimer/> Resend it
        </button>
             
      </div>

    </div>
  )
}

export default VerifyRide