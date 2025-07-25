import { useState } from "react"
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { userEndpoints } from "../services/api";
import apiConnector from "../services/apiConnector";

function ResetToken() {

    const [emailSent , setEmailSent] = useState(false);
    const [email , setEmail] = useState("");

    async function submitHandler(event){

        event.preventDefault();

        try{
            const toastId = toast.loading("Loading...")
            const response = await apiConnector("POST" , userEndpoints.User_ResetToken_api , {email})

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            setEmailSent(true);
            toast.dismiss(toastId);
            toast.success("Email sent Successfully")
        }
        catch(error){
            console.error(error)
            toast.error("Unable to send email")
        }
    }

    return (

        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            
            <div className="max-w-[500px] p-4 lg:p-8">

                <h2 className="text-[1.875rem] font-semibold leading-[2.375rem]">
                    {!emailSent ? "Reset your Password" : "Check email"}
                </h2>

                <p className={`my-4 ${!emailSent ? "text-[1.025rem]" : "text-xl"} leading-5 text-gray-700`}>
                    {
                        !emailSent ? 
                        "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" : 
                        `We have sent the reset email to ${email}`
                    }
                </p>

                <form onSubmit={submitHandler} className="mt-6">
                    {
                        !emailSent && (

                            <div>
                                <label htmlFor="email" className="w-full">
                                    <p className="mb-1 ml-1 text-[1rem] font-medium leading-[1.375rem]">Email Address</p>
                                </label>
                                <input className="rounded-lg w-full border border-gray-600 p-[9px] text-[14px] text-gray-600 focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type="email" required id="email" name="email" placeholder="Enter Email Address" value={email} onChange={(event) => setEmail(event.target.value)}/>
                            </div>
                        )
                    }

                    <button type="submit" className="mt-7 text-lg w-full rounded-[8px] bg-[#13d744] py-[12px] px-[12px] font-medium">
                        {!emailSent ? "Reset Password" : "Resend Email"}
                    </button>
                </form>
                
                <div className="mt-4 flex items-center justify-between">
                    <NavLink to={'/login'}>
                        <p className="flex items-center gap-x-1 text-gray-900">
                            <BiArrowBack/> Back to Login
                        </p>
                    </NavLink>
                </div>
            </div>

        </div>
    )
}

export default ResetToken