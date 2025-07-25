import { useState } from "react";
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { data, NavLink, useNavigate, useParams } from "react-router-dom";
import apiConnector from "../services/apiConnector";
import { userEndpoints } from "../services/api";

function ResetPassword() {

    const {register , handleSubmit , formState:{errors}} = useForm();
    const [showPassword , setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const {token} = useParams();

    async function submitHandler(data , event) {

        event.preventDefault();

        if(data.newPassword !== data.confirmNewPassword){
            toast.error("Passwords do not match")
            return
        }

        const toastId = toast.loading("Loading...")

        try{
            const formdata = {...data , token}

            const response = await apiConnector("POST" , userEndpoints.User_ResetPassword_api , formdata);

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.success("Password updated Successfully")
            navigate('/login')
        }
        catch(error){
            console.error(error);
            toast.error("Unable to reset password")
        }

        toast.dismiss(toastId)
    }

    return (

        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            
            <div className="max-w-[500px] p-4 lg:p-8">

                <h2 className="text-[1.875rem] font-semibold leading-[2.375rem]">Choose new Password</h2>

                <p className="my-4 text-[1.125rem] leading-[1.625rem] text-gray-800">
                    Almost done. Enter your new password and youre all set.
                </p>

                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1 lg:gap-2">
                        <label htmlFor="newPassword">
                            <p className="text-[16px] font-semibold">New Password</p>
                        </label>
                        <div className='w-full relative'>
                            <input className="rounded-lg w-full border border-gray-600 p-[9px] text-[14px] text-gray-700 focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type={`${showPassword ? "text" : "password"}`} id="newPassword" name="newPassword" placeholder="Enter Password" {...register("newPassword" , {required:{value:true , message:"Password is required"} , minLength:{value:6 , message:"Password should have atleast 6 characters"}})} />
                            <span className="absolute right-3 top-[10px]" onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF"/> : <AiOutlineEye fontSize={20} fill="#AFB2BF"/>}
                            </span>
                        </div>
                        {
                            errors.newPassword && (<span className="-mt-1 text-[12px] text-red-500">{errors.password.message}</span>)
                        }
                    </div>

                    <div className="flex flex-col gap-1 lg:gap-2">
                        <label htmlFor="confirmNewPassword">
                            <p className="text-[16px] font-semibold">Confirm Password</p>
                        </label>
                        <div className='w-full relative'>
                            <input className="rounded-lg w-full border text-gray-700 border-gray-600 p-[9px] text-[14px] focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type={`${showConfirmPassword ? "text" : "password"}`} id="confirmNewPassword" name="confirmNewPassword" placeholder="Confirm Password" {...register("confirmNewPassword" , {required:{value:true , message:"Password is required"} , minLength:{value:6 , message:"Password should have atleast 6 characters"}})}/>
                            <span className="absolute right-3 top-[10px]" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF"/> : <AiOutlineEye fontSize={20} fill="#AFB2BF"/>}
                            </span>
                        </div>
                        {
                            errors.confirmNewPassword && (<span className="-mt-1 text-[12px] text-red-500">{errors.confirmNewPassword.message}</span>)
                        }
                    </div>
                    
                    <button type="submit" className="w-full bg-[#13d744] rounded-[8px] font-medium px-[12px] py-[8px] mt-6">
                        Reset Password
                    </button>
                </form>
                
                <div className="mt-6 flex items-center justify-between">
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

export default ResetPassword