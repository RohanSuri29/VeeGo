import { RiMapPinRangeFill, RiSecurePaymentFill } from "react-icons/ri";

function DriverFound({driverFoundRef , mainTextDestination , secTextDestination , fare , ride}) {

    return (

        <div ref={driverFoundRef} className="flex flex-col gap-5 py-10 z-50 fixed bottom-0 translate-y-full bg-white w-full">
                                        
            <div className="flex flex-col justify-between items-center w-full">

                <div className="flex justify-between gap-36 pb-7">

                    <img src={ride?.captainId?.image} className="rounded-full w-16 h-16 aspect-square object-cover"/>
                    
                    <div className="flex flex-col text-right">

                        <h2 className="text-2xl font-semibold text-center">{`${ride?.captainId?.firstName} ${ride?.captainId?.lastName}`}</h2>
                        <h4 className="text-xl font-semibold text-center">{ride?.captainId?.vehiclePlate}</h4>
                        <p className="text-lg text-gray-600 text-center">{ride?.captainId?.vehicleName}</p>
                    
                    </div>
                </div>
                        
                <div className="border-t border-gray-300 flex flex-col w-full">
        
                    <div className="flex gap-6 items-center w-full py-6">
        
                        <div className="ml-4 text-xl"><RiMapPinRangeFill/></div>
        
                        <div className="flex flex-col gap-1 border-b border-gray-400 w-full">
                            <h3 className="text-xl font-semibold">{mainTextDestination}</h3>
                            <p className="text-gray-700 text-lg mb-2">{secTextDestination}</p>
                        </div>
                    </div>
        
                    <div className="flex gap-6 items-center w-full py-3 mb-5">
        
                        <div className="ml-4 text-2xl font-bold"><RiSecurePaymentFill/></div>
                            
                        <div className="flex flex-col gap-1 w-full">
                            <h3 className="text-xl font-semibold">₹{fare}</h3>
                            <p className="text-gray-700 text-lg mb-2">Cash</p>
                        </div>
                    </div>
                </div>
                
            </div>
        
        </div>
    )
}

export default DriverFound