import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiConnector from "../services/apiConnector";
import { userEndpoints } from "../services/api";
import { UserData } from "../context/Context";

function Signup () {

    const {reset , register , getValues , handleSubmit , formState:{errors , isSubmitSuccessful}} = useForm();
    const [showPassword , setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false);
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useContext(UserData);

    useEffect(() => {
        
        if(isSubmitSuccessful){
            reset({
                firstName:"",
                lastName:"",
                email:"",
                password:"",
                confirmPassword:""
            })
        }
    },[reset , isSubmitSuccessful])

    async function submitHandler(data , event) {

        event.preventDefault();

        if(data.password !== data.confirmPassword){
            toast.error("Passwords do not match")
            return
        }

        setLoading(true)
        setUser(data);
        const toastId = toast.loading("Loading...")
        try{

            const response = await apiConnector("POST" , userEndpoints.User_SendOtp_api , data)

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
        setLoading(false); 
    }

    return (

        <div className="p-7 w-full h-screen flex flex-col justify-between">
            
            <div className="flex flex-col gap-y-7">

                <h2 className="font-semibold font-montserrat text-4xl mt-8">VeeGo</h2>

                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-9 mt-8">

                    <div className="flex flex-col gap-5 lg:flex-row">
                        
                        {/* First Name */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="firstName">
                                <p className="text-xl font-semibold">First Name</p>
                            </label>
                            <input className="rounded-lg border border-gray-600 p-[10px] py-4 text-lg focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type="text" id="firstName" name="firstName" placeholder="Enter Your First Name" {...register("firstName" , {required:{value: true , message:"First Name is required"} , minLength:{value:3 , message:"First Name should have atleast 3 characters"}})}/>

                            {
                                errors.firstName && (
                                    <span className="-mt-1 text-[12px] text-red-500">{errors.firstName.message}</span>
                                )
                            }
                        </div>
                        
                        {/* Last Name */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="lastName">
                                <p className="text-xl font-semibold">Last Name</p>
                            </label>
                            <input className="rounded-lg border border-gray-600 p-[10px] text-lg py-4 focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type="text" id="lastName" name="lastName" placeholder="Enter Your Last Name" {...register("lastName")}/>
                        </div>
                    </div>
                    
                    {/* Email Address */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">
                            <p className="text-xl font-semibold">Email Address</p>
                        </label>
                        <input className="rounded-lg border border-gray-600 p-[10px] text-lg py-4 focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type="email" id="email" name="email" placeholder="Enter Your Email" {...register("email" , {required:{value:true , message:"Please enter your email"}})}/>
                        {
                            errors.email && (<span className="-mt-1 text-[12px] text-red-500">{errors.email.message}</span>)
                        }
                    </div>

                    <div className="flex gap-x-4">

                        {/* Password */}
                        <div className="flex flex-col lg:w-[48%] gap-2">
                            <label htmlFor="password">
                                <p className="text-xl font-semibold">Pasword</p>
                            </label>
                            <div className="w-full relative">
                                <input className="w-full rounded-lg border border-gray-600 p-[10px] text-lg py-4 focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type={`${showPassword ? "text" : "password"}`} id="password" name="password" placeholder="Enter Password" {...register("password" , {required:{value:true , message:"Password is required"} , minLength:{value:6 , message:"Password should have atleast 6 characters"}})} />
                                <span className="absolute right-3 top-[16px]" onClick={() => setShowPassword((prev) => !prev )}>{showPassword ? <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF"/> : <AiOutlineEye fontSize={20} fill="#AFB2BF"/>}</span>
                            </div>
                            {
                                errors.password && (<span className="-mt-1 text-[12px] text-red-500">{errors.password.message}</span>)
                            }
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col lg:w-[48%] gap-2">
                            <label htmlFor="confirmPassword">
                                <p className="text-xl font-semibold">Confirm Pasword</p>
                            </label>
                            <div className="w-full relative">
                                <input className="rounded-lg w-full border border-gray-600 p-[10px] text-lg py-4 focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400"  type={`${showConfirmPassword ? "text" : "password"}`} id="confirmPassword" name="confirmPassword" placeholder="Enter Password" {...register("confirmPassword" , {required:{value:true , message:"Password is required"} , minLength:{value:6 , message:"Password should have atleast 6 characters"}})} />
                                <span className="absolute right-3 top-[16px]" onClick={() => setShowConfirmPassword((prev) => !prev )}>{showConfirmPassword ? <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" /> : <AiOutlineEye fontSize={20} fill="#AFB2BF"/>}</span>
                            </div>
                            {
                                errors.confirmPassword && (<span className="-mt-1 text-[12px] text-red-500">{errors.confirmPassword.message}</span>)
                            }
                        </div>
                    </div>
                    
                    <button type="submit" disabled={loading} className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-4 w-full text-2xl ">Create account</button>

                </form>
                
                <p className='text-center -mt-8 text-lg'>Already have an account? <NavLink to={'/login'} className='text-blue-600'>Login Here</NavLink></p>
            
            </div>

            <div>
                <p className='text-[12px] leading-tight text-gray-500'>This site is protected by reCAPTCHA and the <span className='underline text-gray-900'>Google Privacy
                Policy</span> and <span className='underline text-gray-900'>Terms of Service apply</span>.</p>
            </div>
        </div>
    )
}

export default Signup