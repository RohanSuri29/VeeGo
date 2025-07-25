import { useContext } from "react"
import { UserData } from "../context/Context"
import { RiMapPinRangeFill, RiSecurePaymentFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { SocketProvider } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

function Riding() {

    const {ride} = useContext(UserData);
    const {socket} = useContext(SocketProvider);

    socket.on('ride-ended' , ()=> {
        toast.success("Thanks for driving with us!")
    })

    return (

        <div className="h-screen">

            <NavLink to={'/start'} className='fixed text-xl ml-2 mt-2 left-0 top-2 h-12 w-12 bg-gray-300 flex items-center justify-center rounded-full z-50'>
                <FaHome/>
            </NavLink>

            <div className="h-[55%]">
                <LiveTracking/>
            </div>

            <div className="flex flex-col justify-evenly items-center w-full h-[45%] pt-3">
                
                <div className="flex gap-36">
                
                    <img src={ride?.captainId?.image} className="rounded-full w-14 h-14 aspect-square object-cover mr-3"/>
                                    
                    <div className="flex flex-col text-right ml-3">
                
                        <h2 className="text-2xl font-semibold text-center">{`${ride?.captainId?.firstName} ${ride?.captainId?.lastName}`}</h2>
                        <h4 className="text-xl font-medium text-center">{ride?.captainId?.vehiclePlate}</h4>
                        <p className="text-lg text-gray-600 text-center">{ride?.captainId?.vehicleName}</p>
                        
                    </div>
                </div>
                                        
                <div className="border-t border-gray-300 flex flex-col w-full">
                        
                    <div className="flex gap-6 items-center w-full py-3">
                        
                        <div className="ml-4 text-xl"><RiMapPinRangeFill/></div>
                        
                        <div className="flex flex-col gap-1 border-b border-gray-400 w-full">
                            <h3 className="text-lg font-semibold text-gray-500">Drop off</h3>
                            <p className="text-gray-700 text-lg mb-2">{ride?.destination}</p>
                        </div>
                    </div>
                        
                    <div className="flex gap-6 items-center w-full py-3 mb-4">
                        
                        <div className="ml-4 text-2xl font-bold"><RiSecurePaymentFill/></div>
                                            
                        <div className="flex flex-col gap-1 w-full">
                            <h3 className="text-xl font-semibold">₹{ride?.fare}</h3>
                            <p className="text-gray-500 text-lg mb-2">Cash</p>
                        </div>
                    </div>
                </div>

                <button className="bg-green-600 text-xl font-semibold rounded-lg px-20 mb-8 text-center py-3 text-white">Make Payment</button>
                                
            </div>
        </div>
    )
}

export default Riding