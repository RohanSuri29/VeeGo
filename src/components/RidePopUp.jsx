import { FaSquare } from "react-icons/fa6";
import { RiMapPinRangeFill } from "react-icons/ri";

function RidePopUp({popupRef , setPopupOpen , ride , confirmRide}) {

    return (

        <div ref={popupRef} className="h-fit z-20 translate-y-[140%] w-full flex flex-col absolute bottom-0 gap-3 mb-4 bg-white pl-5">
            
            <div className="flex justify-between items-center pr-5">

                <div className="flex gap-2 items-center">
                    <img src={ride?.userId?.image} className="rounded-full w-14 aspect-square object-cover"/>
                    <h2 className="text-xl font-medium">{`${ride?.userId?.firstName} ${ride?.userId?.lastName}`}</h2>
                </div>

                <div className="flex flex-col mt-4">
                    <h2 className="text-xl font-medium">₹{ride?.fare}</h2>
                    <p className="text-[16px] text-gray-500 text-center">{ride?.distance}KM</p>
                </div>
            </div>

           <div className="flex gap-3 items-center">
                <RiMapPinRangeFill className="text-xl"/>
                <div className="flex flex-col border-b border-gray-300 w-full pb-6">
                    <p className="text-sm text-gray-400">Pick Up</p>
                    <h3 className="text-xl font-medium">{ride?.pickup}</h3>
                </div>
           </div>

            <div className="flex gap-3 items-center">
                <FaSquare className="text-lg"/>
                <div className="flex flex-col border-b border-gray-300 w-full pb-3">
                    <p className="text-sm text-gray-400">Drop Off</p>
                    <h3 className="text-xl font-medium">{ride?.destination}</h3>
                </div>
            </div>

            <div className="flex gap-4 justify-end py-2 pr-5">
                <button onClick={() => setPopupOpen(false)} className="bg-gray-300 font-medium text-lg text-black rounded-lg px-5 py-2 text-center">Ignore</button>
                <button onClick={confirmRide} className="bg-green-500 font-medium text-lg text-center rounded-lg px-5 py-2">Accept</button>
            </div>
        </div>
    )
}

export default RidePopUp