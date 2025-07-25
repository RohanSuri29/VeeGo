import { useContext, useEffect, useRef, useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { UserData } from "../context/Context"
import { MdAccessTime } from "react-icons/md";
import { SlSpeedometer } from "react-icons/sl";
import { TbNotes } from "react-icons/tb";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketProvider } from "../context/SocketContext";
import apiConnector from "../services/apiConnector";
import { rideEndpoints } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

function CaptainStartPage() {

    const {captain , ride , setRide} = useContext(UserData);
    const {socket} = useContext(SocketProvider);
    const [detailsOpen , setDetailsOpen] = useState(true);
    const [popupOpen , setPopupOpen] = useState(false);
    const [confirmPopUpOpen , setConfirmPopUpOpen] = useState(false);
    const confirmPopUpRef = useRef(null);
    const detailsRef = useRef(null);
    const popupRef = useRef(null);
    const {token} = useContext(UserData);
    const navigate = useNavigate();

    async function confirmRide() {
        
        setPopupOpen(false);
        setConfirmPopUpOpen(true);

        const response = await apiConnector("POST" , rideEndpoints.Ride_confirmRide_api , {rideId: ride._id} , {Authorization:`Bearer ${token}`});

        if(!response?.data?.success) {
            toast.error("Unable to accept ride")
        }

    }

    async function confirmRideOtp () {

        try{

            const toastId = toast.loading("Loading...");

            const response = await apiConnector("POST" , rideEndpoints.Ride_confirmRideOtp_api, {email:ride?.userId?.email} , {Authorization:`Bearer ${token}`})

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.dismiss(toastId);
            setConfirmPopUpOpen(false);
            navigate('/verify-ride');

        } 
        catch(error){
            console.error(error);
            toast.error("Unable to send otp")
        }
    }

    function updateLocation () {

        if(navigator.geolocation){

            navigator.geolocation.getCurrentPosition(position => {

                socket.emit('update-location-captain' , {
                    userId: captain._id,
                    location:{
                        ltd: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                })
            })
        }
    }

    useEffect(() => {
   
        socket.emit('join' , {userType:"captain" , userId:captain._id})

        const locationInterval = setInterval(updateLocation,10000);
        updateLocation();
    },[])

   socket.on('new-ride' , (data) => {
        setRide(data);
        setPopupOpen(true);
    })
    
    useGSAP(() => {

        if(detailsOpen){

            gsap.to(detailsRef.current , {
                translateY: 0
            })
        }
        else{

            gsap.to(detailsRef.current , {
                translateY: '140%',
            })
        }

    },[detailsOpen])

    useGSAP(() => {

        if(popupOpen){

            gsap.to(popupRef.current , {
                translateY: 0
            })
        }
        else{

            gsap.to(popupRef.current , {
                translateY: '140%',
            })
        }

    },[popupOpen])

    useGSAP(() => {

        if(confirmPopUpOpen){

            gsap.to(confirmPopUpRef.current , {
                translateY: 0
            })
        }
        else{

            gsap.to(confirmPopUpRef.current , {
                translateY: '140%',
            })
        }

    },[confirmPopUpOpen])

    return (

        <div className="h-screen relative overflow-hidden">
            
            <div className="flex justify-between items-center z-50 px-2 py-2">

                <p className="font-montserrat text-3xl font-semibold ml-3 mt-2">VeeGo</p>
 
                <div className="mr-3 mt-2 text-3xl"><GiHamburgerMenu/></div>
            </div>

            <div className="h-screen">
                <LiveTracking/>
            </div>

            <div ref={detailsRef} className="h-fit w-full p-5 absolute bottom-0 flex flex-col gap-3 bg-white">

                <div onTouchMove={() => setDetailsOpen(false)} className="h-2 pt-2 w-16 rounded-lg bg-gray-400 mx-auto"/>

                <div className="flex justify-between items-center">

                    <div className="flex gap-2 items-center">
                        <img className="rounded-full w-16 aspect-square object-cover" src="https://wallpapercave.com/wp/wp11131093.jpg"/>
                        <h2 className="text-xl font-medium">{`${captain?.firstName} ${captain?.lastName}`}</h2>
                    </div>

                    <div className="flex flex-col mt-4">
                        <h2 className="text-xl font-medium">₹320.00</h2>
                        <p className="text-[16px] text-gray-500 text-center">Earned</p>
                    </div>
                </div>

                <div className="w-full rounded-lg flex justify-evenly bg-green-500 py-7 mt-3">

                    <div className="flex flex-col justify-center items-center gap-2">
                        <MdAccessTime className="text-2xl font-medium w-12"/>
                        <h2 className="text-white text-2xl font-medium">10.5</h2>
                        <p className="text-sm">Hours Online</p>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-2">
                        <SlSpeedometer className="text-2xl font-medium w-7"/>
                        <h2 className="text-white text-2xl font-medium">30 KM</h2>
                        <p className="text-sm">Total Distance</p>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-2">
                        <TbNotes className="text-2xl font-medium w-12"/>
                        <h2 className="text-white text-2xl font-medium">20</h2>
                        <p className="text-sm">Total Jobs</p>
                    </div>
                </div>

            </div>

            <RidePopUp confirmRide={confirmRide} ride={ride} popupRef={popupRef} setPopupOpen={setPopupOpen}/>

            <ConfirmRidePopUp confirmRideOtp={confirmRideOtp} ride={ride} confirmPopUpRef={confirmPopUpRef} setConfirmPopUpOpen={setConfirmPopUpOpen}/>
        </div>
    )
}

export default CaptainStartPage