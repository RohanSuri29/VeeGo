import { useContext, useEffect, useRef, useState } from "react"
import { FaCircleDot } from "react-icons/fa6"
import { GiHamburgerMenu } from "react-icons/gi"
import { SiSquare } from "react-icons/si"
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import { MdArrowDropDown } from "react-icons/md";
import LocationPanel from "../components/LocationPanel";
import VehicleSelection from "../components/VehicleSelection";
import ConfirmRidePanel from "../components/ConfirmRidePanel";
import LookingForDriver from "../components/LookingForDriver";
import DriverFound from "../components/DriverFound";
import apiConnector from "../services/apiConnector";
import { mapEndpoints, rideEndpoints } from "../services/api";
import { UserData } from "../context/Context";
import toast from "react-hot-toast";
import { SocketProvider } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

function StartPage() {
   
    const [pickup , setPickup] = useState('');
    const [destination , setDestination] = useState('');
    const [isOpen , setIsOpen] = useState(false)
    const [vehicleOpen , setVehicleOpen] = useState(false);
    const [confirmRideOpen , setConfirmRideOpen] = useState(false);
    const {token , user , ride , setRide} = useContext(UserData);
    const [waitingOpen , setWaitingOpen] = useState(false);
    const [driverFound , setdriverFound] = useState(false);
    const [pickupSuggestions , setPickupSuggestions] = useState([]);
    const [destinationSuggestions , setDestinationSuggestions] = useState([]);
    const [activeField , setActiveField] = useState("");
    const [fare , setFare] = useState({});
    const [vehicleType , setVehicleType] = useState("");
    const [mainTextPickup , setMainTextPickup] = useState("");
    const [mainTextDestination , setMainTextDestination] = useState("");
    const [secTextPickup , setSecTextPickup] = useState("");
    const [secTextDestination , setSecTextDestination] = useState("");
    const {socket} = useContext(SocketProvider);
    const driverFoundRef = useRef();
    const waitingRef = useRef(null);
    const confirmRef = useRef(null);
    const vehicleRef = useRef(null);
    const panelRef = useRef(null);
    const navRef = useRef(null);
    const downRef = useRef(null);
    const locationRef = useRef(null);
    const navigate = useNavigate();
   
    function submitHandler(event) {

        event.preventDefault();
    }

    async function handlePickupChange(event) {

        setPickup(event.target.value);

        try{
            
            const response = await apiConnector("GET" , mapEndpoints.Map_get_suggestions , null , {Authorization:`Bearer ${token}`} , {input: event.target.value})
            
            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }

            setPickupSuggestions(response?.data?.data)
        }
        catch(error){
            console.error(error);
            toast.error("Unable to get Suggestions")
        }
    }

    async function handleDestinationChange(event) {

        setDestination(event.target.value);

        try{

            const response = await apiConnector("GET" , mapEndpoints.Map_get_suggestions , null , {Authorization:`Bearer ${token}`} , {input: event.target.value})
            
            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            setDestinationSuggestions(response?.data?.data);
        }
        catch(error){
            console.error(error);
            toast.error("Unable to get suggestions")
        }
    }

    async function fetchFare() {

        if(vehicleOpen) {

            try{

                const response = await apiConnector("GET" , rideEndpoints.Ride_getFare_api , null , {Authorization:`Bearer ${token}`} , {origin:pickup , destination:destination})
                
                if(!response?.data?.success){
                    throw new Error(response?.data?.message)
                }

                setFare(response?.data?.data)
            }
            catch(error){
                console.error(error);
            }
        }
    }

    async function createRide() {

        setConfirmRideOpen(false);
        setWaitingOpen(true);

        try{

            const response = await apiConnector("POST" , rideEndpoints.Ride_createRide_api , {pickup , destination , vehicleType} , {Authorization:`Bearer ${token}`})
            
            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.success("Ride is Confirmed")
        
        }
        catch(error){
            console.error(error);
            toast.error("Unable to create ride")
        }
    }

    socket.on('ride-confirmed' , (ride) => {
       
        setRide(ride);
        setWaitingOpen(false);
        setdriverFound(true);
    })

    socket.on('ride-started' , (ride) => {

        setdriverFound(false);
        navigate('/riding');
    })

    useEffect(() => {
        fetchFare();
    },[vehicleOpen])

    useEffect(() => {
        socket.emit('join' , {userType:"user" , userId:user._id})
    },[user])

    useGSAP(() => {

        if(isOpen){

            gsap.to(panelRef.current , {
                height: '57%',
            })

            gsap.to(navRef.current , {
                opacity: 0
            })
            gsap.to(downRef.current , {
                opacity: 1
            })
            gsap.to(locationRef.current , {
                height: '100%'
            })
        }
        else{

            gsap.to(panelRef.current , {
                height:'0%',
            })

            gsap.to(navRef.current , {
                opacity: 1
            })

            gsap.to(downRef.current , {
                opacity: 0
            })
            gsap.to(locationRef.current , {
                height: "auto"
            })
           
        }

    },[isOpen])

    useGSAP(() => {

        if(vehicleOpen){

            gsap.to(vehicleRef.current , {
                translateY: 0
            })
        }
        else{
            gsap.to(vehicleRef.current , {
                translateY: '100%'
            })
        }

    },[vehicleOpen])
    
    useGSAP(() => {

        if(confirmRideOpen){

            gsap.to(confirmRef.current , {
                translateY: 0
            })
        }
        else{

            gsap.to(confirmRef.current , {
                translateY: '100%'
            })
        }

    },[confirmRideOpen])

    useGSAP(() => {

        if(waitingOpen){

            gsap.to(waitingRef.current , {
                translateY: 0
            })
        }
        else{

            gsap.to(waitingRef.current , {
                translateY: '100%'
            })
        }

    },[waitingOpen])

    useGSAP(() => {

        if(driverFound){

            gsap.to(driverFoundRef.current , {
                translateY: 0
            })
        }
        else{

            gsap.to(driverFoundRef.current , {
                translateY: '100%'
            })
        }
    },[driverFound])

    return (

        <div className="h-screen relative overflow-hidden ">
            
            {/* Navbar */}
            <div ref={navRef} className="bg-white flex justify-between items-center px-2 py-2">

                <p className="font-montserrat text-3xl font-semibold ml-3 mt-2">VeeGo</p>

                <div className="mr-3 mt-2 text-3xl"><GiHamburgerMenu/></div>
            </div>

            
            <div className="h-screen">
                <LiveTracking/>
            </div>
            
            {/* setting location */}
            <div ref={locationRef} className="flex flex-col justify-end w-full absolute bottom-0">

                <div className="bg-white h-[43%] w-full px-5 py-2">

                    <div className="flex justify-between items-center pb-3">
                        <h4 className="text-3xl font-semibold">Find a trip</h4>
                        <div ref={downRef} onClick={() => setIsOpen(false)} className="text-5xl "><MdArrowDropDown /></div>
                    </div>

                    <form onSubmit={(event) => submitHandler(event)} className="pb-4">
                        
                        <div className="w-full relative flex flex-col gap-y-4">
                            <input className="bg-[#eee] focus:outline-none rounded-lg text-xl px-12 py-4 placeholder:text-gray-400 text-gray-700" type="text" name="pickup" placeholder="Add a pick-up location" value={pickup} onChange={handlePickupChange} onClick={() => {setIsOpen(true);setActiveField('pickup')}}/>
                            <input className="bg-[#eee] focus:outline-none rounded-lg text-xl px-12 py-4 placeholder:text-gray-400 text-gray-700" type="text" name="destination" placeholder="Enter your destination" value={destination} onChange={handleDestinationChange} onClick={() => {setIsOpen(true);setActiveField('destination')}}/>
                            <div className="text-sm absolute top-[1.35rem] left-[0.80rem]"><FaCircleDot/></div>
                            <div className="w-20 h-[1.5px] bg-black absolute top-[4.55rem] -left-5 rotate-90"></div>
                            <div className="text-black text-sm absolute top-[6.95rem] left-[0.75rem]"><SiSquare/></div>
                        </div>
                    
                    </form>

                    <div className="pl-8">
                        <button onClick={() => {setVehicleOpen(true);setIsOpen(false)}} className="bg-green-500 font-medium text-center text-xl text-white rounded-lg w-[90%] py-3">Find Trip</button>
                    </div>

                </div>

                <div ref={panelRef} className="h-0"> 
                    <LocationPanel suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions} activeField={activeField} setPickup={setPickup} setDestination={setDestination} setMainTextPickup={setMainTextPickup} setMainTextDestination={setMainTextDestination} setSecTextPickup={setSecTextPickup} setSecTextDestination={setSecTextDestination}/>
                </div>
            </div>

            {/* vehicle selection */}
            <VehicleSelection setVehicleOpen={setVehicleOpen} vehicleRef={vehicleRef} setConfirmRideOpen={setConfirmRideOpen} fare={fare} setVehicleType={setVehicleType}/>

            {/* confirm ride */}
            <ConfirmRidePanel confirmRef={confirmRef} setConfirmRideOpen={setConfirmRideOpen} createRide={createRide} mainTextPickup={mainTextPickup} mainTextDestination={mainTextDestination} secTextPickup={secTextPickup} secTextDestination={secTextDestination} fare={fare[vehicleType]}/>
            
            {/* Looking for driver */}
            <LookingForDriver waitingRef={waitingRef}  mainTextPickup={mainTextPickup} mainTextDestination={mainTextDestination} secTextPickup={secTextPickup} secTextDestination={secTextDestination} fare={fare[vehicleType]}/>

            {/* Driver Found */}
            <DriverFound driverFoundRef={driverFoundRef} ride={ride} mainTextDestination={mainTextDestination} secTextDestination={secTextDestination} fare={fare[vehicleType]}/>
        </div>
    )
}

export default StartPage