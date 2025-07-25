import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useContext, useRef, useState } from "react"
import { FaHome } from "react-icons/fa"
import { FaSquare } from "react-icons/fa6"
import { NavLink, useNavigate } from "react-router-dom"
import { UserData } from "../context/Context";
import toast from "react-hot-toast";
import apiConnector from "../services/apiConnector";
import { rideEndpoints } from "../services/api";
import LiveTracking from "../components/LiveTracking";

function CaptainRiding () {

    const captainRidingRef = useRef(null);
    const [CaptainRidingOpen , setCaptainRidingOpen] = useState(false);
    const homeRef = useRef(null);
    const {ride , token} = useContext(UserData);
    const navigate = useNavigate();
    const panelRef = useRef();

    async function finishHandler() {

        const toastId = toast.loading("Loading...")

        try{

            const response = await apiConnector("POST" , rideEndpoints.Ride_endRide_api , {rideId:ride?._id} , {Authorization:`Bearer ${token}`});

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.success("Ride Finsihed Successfully");
            navigate('/captain-start');
        }
        catch(error){
            console.error(error);
            toast.error("Unable to finish ride")
        }

        toast.dismiss(toastId);
    }

    useGSAP(() => {

        if(CaptainRidingOpen){
            
            gsap.to(captainRidingRef.current , {
                height: '80%'
            })

            gsap.to(homeRef.current , {
                opacity: 0
            })

            gsap.to(panelRef.current , {
                height: '100%'
            })
        }
        else{

            gsap.to(captainRidingRef.current , {
                height: 0
            })

            gsap.to(homeRef.current , {
                opacity: 1
            })

            gsap.to(panelRef.current , {
                height: "auto"
            })
        }

    },[CaptainRidingOpen])

    return (

        <div className="relative h-screen overflow-hidden">
            
            <NavLink ref={homeRef} to={'/captain-start'} className='fixed text-xl ml-2 mt-2 left-0 top-2 h-12 w-12 bg-gray-300 flex items-center justify-center rounded-full z-50'>
                <FaHome/>
            </NavLink>

            <div className="h-screen">
                <LiveTracking/>
            </div>

            <div ref={panelRef} className="flex flex-col justify-end w-full absolute bottom-0">

                <div className="bg-white h-[20%] flex flex-col gap-6 py-7 w-full">

                    <div onTouchMove={() => setCaptainRidingOpen((prev) => !prev)} className="w-24 py-1.5 mx-auto bg-gray-300 rounded-lg "/>

                    <div className="flex gap-4 px-3">
                        <img src={ride?.userId?.image} className="aspect-square rounded-full object-cover w-[3.25rem] h-[3.25rem]"/>

                        <div className="flex flex-col">
                            <p className="text-lg text-gray-400">Pick up at</p>
                            <h3 className="font-semibold text-lg">{ride?.pickup}</h3>
                        </div>
                    </div>
                </div>

                <div ref={captainRidingRef} className="h-0 pl-4 flex flex-col gap-7 bg-white">
                    
                    <div className="flex gap-4 pt-10 items-center">
                        <FaSquare className="text-lg"/>
                        <div className="flex flex-col border-b border-gray-300 border-t w-full py-6">
                            <p className="text-sm text-gray-400">Drop Off</p>
                            <h3 className="text-lg font-medium">{ride?.destination}</h3>
                        </div>
                    </div>
                    
                    <div className="flex flex-col border-b border-gray-300 w-full pb-6 pr-5">
                        <div className="flex justify-between text-lg font-medium"><h3>Amount</h3> <h3>₹{ride?.fare}</h3></div>
                        <div className="flex justify-between text-lg font-medium"><h3>CGST</h3> <h3>₹{(2.5*ride?.fare)/100}</h3></div>
                        <div className="flex justify-between text-lg font-medium"><h3>SGST</h3> <h3>₹{(2.5*ride?.fare)/100}</h3></div>
                        <div className="flex justify-between text-lg font-medium"><h3>Total Amount</h3> <h3>₹{ride?.fare + (5*ride?.fare)/100}</h3></div>
                    </div>

                    <button onClick={finishHandler} className="bg-green-600 text-xl font-semibold rounded-lg px-20 mt-5 mr-5 text-center py-3 text-white">Finish Ride</button>
                </div>

            </div>
        </div>
    )
}

export default CaptainRiding