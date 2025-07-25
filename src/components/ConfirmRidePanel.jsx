import carImage from "../assets/veeGoCar.png";
import bikeImage from "../assets/veeGoBike.webp";
import autoImage from "../assets/veeGoAuto.webp";
import { RiMapPinRangeFill, RiSecurePaymentFill } from "react-icons/ri";
import { FaSquare } from "react-icons/fa6";
import { useContext } from "react";
import { UserData } from "../context/Context";

function ConfirmRidePanel({confirmRef , setConfirmRideOpen , createRide , mainTextPickup , mainTextDestination , secTextPickup , secTextDestination , fare}) {

    const {image} = useContext(UserData);

    return (

        <div ref={confirmRef} className="flex flex-col gap-2 z-50 fixed bottom-0 translate-y-full bg-white w-full py-6">
            
            <div onTouchMove={() => setConfirmRideOpen(false)} className="h-2 w-20 rounded-lg mx-auto mb-2 bg-gray-300"></div>
            
            <div className="flex flex-col justify-between items-center w-full">

                <img className={`mb-5 ${image === "1" ? "-mt-2 w-[15rem] ml-9" : "mt-3 w-[12rem] ml-6"}`} src={`${image === "1" && carImage || image === "2" && bikeImage || image === "3" && autoImage}`} />
                
                <div className="border-t border-gray-300 flex flex-col w-full">
                    
                    <div className="flex gap-6 items-center py-5 w-full">

                        <div className="ml-4 text-xl"><RiMapPinRangeFill/></div>

                        <div className="flex flex-col gap-1 border-b border-gray-400 w-full">
                            <h3 className="text-xl font-semibold">{mainTextPickup}</h3>
                            <p className="text-gray-700 text-lg mb-2">{secTextPickup}</p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-center w-full">

                        <div className="ml-4 text-lg"><FaSquare/></div>

                        <div className="flex flex-col gap-1 border-b border-gray-400 w-full">
                            <h3 className="text-xl font-semibold">{mainTextDestination}</h3>
                            <p className="text-gray-700 text-lg mb-2">{secTextDestination}</p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-center w-full py-3">

                        <div className="ml-4 text-2xl font-bold"><RiSecurePaymentFill/></div>
                        
                        <div className="flex flex-col gap-1 w-full">
                            <h3 className="text-xl font-semibold">₹{fare}</h3>
                            <p className="text-gray-700 text-lg mb-2">Cash</p>
                        </div>
                    </div>
                </div>

                <button onClick={createRide} className="bg-green-600 text-xl font-semibold rounded-lg px-20 mb-5 mt-2 text-center py-3 text-white">Confirm</button>

            </div>

        </div>
    )
}

export default ConfirmRidePanel