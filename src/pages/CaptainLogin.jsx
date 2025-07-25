import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { NavLink, useNavigate } from 'react-router-dom';
import apiConnector from '../services/apiConnector';
import { captainEndpoints } from '../services/api';
import { UserData } from '../context/Context';

function CaptainLogin() {

    const {reset , register , handleSubmit , formState:{errors , isSubmitSuccessful}} = useForm();
    const [showPassword , setShowPassword] = useState(false);
    const [loading , setLoading] = useState(false);
    const {setCaptain , setToken} = useContext(UserData);
    const navigate = useNavigate();

    useEffect(() => {
        if(isSubmitSuccessful){
            reset({
                email:"",
                password:""
            })
        }
    },[reset , isSubmitSuccessful])

    async function submitHandler(data , event) {

        event.preventDefault();

        setLoading(true);
        const toastId = toast.loading("Loading...");

        try{

            const response = await apiConnector("POST" , captainEndpoints.Captain_login_api , data);

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.success("Logged in Successfully");
          
            setCaptain(response?.data?.data);
            setToken(response?.data?.token);
            localStorage.setItem("captain" , JSON.stringify(response?.data?.data));
            localStorage.setItem("token" , JSON.stringify(response?.data?.token));
            navigate('/captain-start')

        }
        catch(error){
            console.error(error);
            toast.error("Unable to login")
        }

        setLoading(false);
        toast.dismiss(toastId)
    }

    return (

        <div className="p-7 w-full h-screen flex flex-col justify-between">
            
            <div className="flex flex-col gap-y-7">

                <h2 className="font-montserrat text-4xl mt-8 mb-6 font-semibold ml-2">VeeGo</h2>

                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-9">

                    {/* email */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">
                            <p className="text-xl font-semibold">What's your email</p>
                        </label>
                        <input className="rounded-lg border border-gray-600 p-[10px] py-4 text-lg focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type="email" id='email' name='email' placeholder='Enter your Email' {...register("email" , {required:{value:true , message:"Please enter your email"}})} />
                        {
                            errors.email && (<span className="-mt-1 text-[12px] text-red-500">{errors.email.message}</span>)
                        }
                    </div>
                    
                    {/* password */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password">
                            <p className="text-xl font-semibold">Password</p>
                        </label>
                        <div className='w-full relative'>
                            <input className="rounded-lg w-full border border-gray-600 p-[10px] text-lg py-4 focus:outline-none leading-[20px] shadow-[0_2px_4px_0] shadow-gray-950/30 placeholder:text-gray-400" type={`${showPassword ? "text" : "password"}`} id='password' name='password' placeholder='Enter Password' {...register("password" , {required:{value:true , message:"Please enter your password"} , minLength:{value:6 , message:"Password should have atleast 6 characters"}})}/>
                            <span className="absolute right-3 top-[16px]" onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? <AiOutlineEyeInvisible fontSize={23} fill="#AFB2BF"/> : <AiOutlineEye fontSize={20} fill="#AFB2BF"/>}
                            </span>
                        </div>
                        {
                            errors.password && (<span className="-mt-1 text-[12px] text-red-500">{errors.password.message}</span>)
                        }
                    </div>
                    
                    <NavLink to={'/forgot-password-captain'}><p className="text-lg -mt-7 text-blue-500 text-right">Forgot Password</p></NavLink>

                    <button type='submit' disabled={loading} className="bg-[#111] text-white -mt-1 font-semibold mb-3 rounded-lg px-4 py-4 w-full text-2xl">Login</button>

                </form>

                <p className='text-center -mt-8 text-lg'>New Here? <NavLink to={'/captain-signup'} className='text-blue-600'>Register as captain</NavLink></p>

            </div>

            <div className='flex flex-col gap-3'>
                <NavLink to={'/login'}>
                    <button disabled={loading} className="bg-[#10b461] text-white font-semibold mb-3 rounded-lg px-4 py-4 w-full text-2xl">Sign in as User</button>
                </NavLink>
                <p className='text-[12px] leading-tight text-gray-500'>This site is protected by reCAPTCHA and the <span className='underline text-gray-900'>Google Privacy
                Policy</span> and <span className='underline text-gray-900'>Terms of Service apply</span>.</p>
            </div>

        </div>
    )
}

export default CaptainLogin