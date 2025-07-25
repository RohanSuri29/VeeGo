import { useContext, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { RxCountdownTimer } from "react-icons/rx"
import OTPInput from "react-otp-input"
import { NavLink, useNavigate } from "react-router-dom"
import { UserData } from "../context/Context"
import toast from "react-hot-toast"
import apiConnector from "../services/apiConnector"
import { userEndpoints } from "../services/api"

function VerifyEmail() {

    const [otp , setotp] = useState("");
    const {user , setUser , setToken} = useContext(UserData);
    const {email} = user;
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {

        if(!user) {
            navigate('/signup')
        }

    },[])

    async function submitHandler(event) {

        event.preventDefault();
        const signupData = {...user , otp};
    
        setLoading(true);
        const toastId = toast.loading("Loading...");

        try{

            const response = await apiConnector("POST" , userEndpoints.User_Signup_api , signupData);

            if(!response?.data?.success) {
                throw new Error(response?.data?.message)
            }

            toast.success("Account Created");
            setUser(response?.data?.data);
            setToken(response?.data?.token);
            localStorage.setItem("user" , JSON.stringify(response?.data?.data));
            localStorage.setItem("token" , JSON.stringify(response?.data?.token));
            navigate('/start');

        }
        catch(error){
            console.error(error);
            toast.error("Unable to signup")
        }

        setLoading(false);
        toast.dismiss(toastId);
    }


    async function otpHandler() {
        
        const toastId = toast.loading("Loading...")
        try{

            const response = await apiConnector("POST" , userEndpoints.User_SendOtp_api , {email})

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.success("Otp sent successfully")
            navigate('/verify-email')

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

                <h1 className="text-black font-semibold text-[1.875rem] leading-[2.375rem]">Verify email</h1>

                <p className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-700">
                    A verification code has been sent to you. Enter the code below
                </p>

                <form onSubmit={submitHandler}>

                    <OTPInput 
                        value={otp} 
                        onChange={setotp} 
                        numInputs={6} 
                        renderInput={ (props) => (<input {...props} placeholder="-" className="sm:min-w-14 min-w-12 border-0 bg-gray-300 rounded-[0.5rem] aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-500 inset-shadow-[0px_-1px_0px_rgba(255,255,255,0.18)]"/>)}
                        containerStyle={{ justifyContent:"space-between", gap:"0 6px"}}
                    />

                    <button disabled={loading} type="submit" className="w-full bg-[#13d744] py-[10px] px-[12px] rounded-[8px] mt-6 font-semibold text-xl">
                        Verify
                    </button>

                </form>

                <div className="mt-6 flex items-center justify-between">

                    <NavLink to={"/signup"}>
                        <p className="text-lg flex items-center gap-x-1">
                            <BiArrowBack/> Back to Signup
                        </p>
                    </NavLink>

                    <button className="flex items-center  text-blue-600 gap-x-1" onClick={otpHandler}>
                        <RxCountdownTimer/> Resend it
                    </button>
                </div>
            </div>

        </div>
    )
}

export default VerifyEmail