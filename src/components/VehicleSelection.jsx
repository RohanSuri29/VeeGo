import carImage from "../assets/veeGoCar.png";
import bikeImage from "../assets/veeGoBike.webp";
import autoImage from "../assets/veeGoAuto.webp";
import { LuDot } from "react-icons/lu";
import { FaUser } from "react-icons/fa6"
import { useContext, useEffect } from "react";
import { UserData } from "../context/Context";

function VehicleSelection({setVehicleOpen , vehicleRef , setConfirmRideOpen , fare , setVehicleType}) {

    const {setImage} = useContext(UserData);

    return (

        <div ref={vehicleRef} className="flex flex-col gap-2 z-50 fixed bottom-0 translate-y-full bg-white w-full px-2 py-4 pr-9">
                
            <div onTouchMove={() => setVehicleOpen(false)} className="h-2 w-20 rounded-lg mx-auto mb-2 bg-gray-300"></div>

            <h3 className="font-semibold text-3xl mb-3 ml-3">Choose a Vehicle</h3>

            {/* Car */}
            <div onClick={() => {setConfirmRideOpen(true);setVehicleOpen(false);setImage("1");setVehicleType("car")}} className="flex justify-between items-center active:border-2 border-black rounded-xl w-full box-content p-3">

                <img src={carImage} alt="car-image" className="h-[5rem] w-[6.25rem] -ml-4"/>
                    
                <div className="flex flex-col w-1/2 -ml-4">
                        
                    <div className="flex gap-2">
                        <h3 className="font-medium text-2xl">Car</h3>
                        <div className="flex gap-1 text-sm items-center mt-1"><FaUser/><span className="text-lg">4</span></div>
                    </div>

                    <div className="flex items-center -mt-1">
                        <p className="text-lg font-[400]">2 mins away</p>
                        <LuDot className="font-bold text-2xl mt-1 -ml-1.5"/>
                        <p className="font-[400] -ml-2">{`${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes().toString().padStart(2,"0")}`}</p> 
                    </div>

                    <p className="text-gray-500 text-base -mt-1 font-normal w-[12rem]">Affordable, compact rides</p>
                </div>

                <h3 className="text-2xl font-semibold -mt-10 ">₹{fare.car}</h3>
            </div>
                
            {/* Bike */}
            <div onClick={() => {setConfirmRideOpen(true);setVehicleOpen(false);setImage("2");setVehicleType("moto")}} className="flex justify-between items-center active:border-2 border-black rounded-xl w-full box-content p-3">

                <img src={bikeImage} alt="bike-image" className="h-[3.5rem] w-[5.25rem] -ml-4"/>
                    
                <div className="flex flex-col w-1/2 -ml-4">
                        
                    <div className="flex gap-2">
                        <h3 className="font-medium text-2xl">Moto</h3>
                        <div className="flex gap-1 text-sm items-center mt-1"><FaUser/><span className="text-lg">1</span></div>
                    </div>

                    <div className="flex items-center -mt-1">
                        <p className="text-lg font-[400]">3 mins away</p>
                        <LuDot className="font-bold text-2xl mt-1 -ml-1.5"/>
                        <p className="font-[400] -ml-2">{`${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes().toString().padStart(2,"0")}`}</p> 
                    </div>

                    <p className="text-gray-500 text-base -mt-1 font-normal w-[14rem]">Affordable, motorcycle rides</p>
                </div>

                <h3 className="text-2xl font-semibold -mt-10 ">₹{fare.moto}</h3>
            </div>

            {/* Auto */}
            <div onClick={() =>{setConfirmRideOpen(true);setVehicleOpen(false);setImage("3");setVehicleType("auto")}} className="flex justify-between items-center active:border-2 border-black rounded-xl w-full box-content p-3">

                <img src={autoImage} alt="auto-image" className="h-[3.5rem] w-[4.75rem] -ml-4"/>
                    
                <div className="flex flex-col w-1/2 -ml-1">
                        
                    <div className="flex gap-2">
                        <h3 className="font-medium text-2xl">Auto</h3>
                        <div className="flex gap-1 text-sm items-center mt-1"><FaUser/><span className="text-lg">4</span></div>
                    </div>

                    <div className="flex items-center -mt-1">
                        <p className="text-lg font-[400]">2 mins away</p>
                        <LuDot className="font-bold text-2xl mt-1 -ml-1.5"/>
                        <p className="font-[400] -ml-2">{`${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes().toString().padStart(2,"0")}`}</p> 
                    </div>

                    <p className="text-gray-500 text-base -mt-1 font-normal w-[14rem]">Affordable, autorickshaw rides</p>
                </div>

                <h3 className="text-2xl font-semibold -mt-10 ">₹{fare.auto}</h3>
            </div>

        </div>
    )
}

export default VehicleSelection