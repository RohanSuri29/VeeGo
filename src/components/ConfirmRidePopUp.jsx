import { FaSquare } from "react-icons/fa6"
import { RiMapPinRangeFill } from "react-icons/ri"

function ConfirmRidePopUp({confirmPopUpRef , setConfirmPopUpOpen , ride , confirmRideOtp}) {

    return (

        <div ref={confirmPopUpRef} className="h-screen z-50 translate-y-[140%] w-full flex flex-col absolute top-0 gap-5 py-4 bg-white pl-5">

            <div className="flex justify-between items-center mr-5 px-3 py-3 mt-5 bg-yellow-500 rounded-lg">

                <div className="flex gap-2 items-center">
                    <img src={ride?.userId?.image} className="rounded-full w-14 aspect-square object-cover"/>
                    <h2 className="text-xl font-medium">{`${ride?.userId?.firstName} ${ride?.userId?.lastName}`}</h2>
                </div>

                <div className="flex flex-col mt-4">
                    <h2 className="text-xl font-medium text-center">₹{ride?.fare}</h2>
                    <p className="text-[16px] text-white text-center">{ride?.distance} KM</p>
                </div>

            </div>

            <div className="flex gap-3 items-center">
                <RiMapPinRangeFill className="text-2xl"/>
                <div className="flex flex-col border-b border-gray-300 w-full pt-3 pb-7">
                    <p className="text-sm text-gray-400">Pick Up</p>
                    <h3 className="text-xl font-medium">{ride?.pickup}</h3>
                </div>
            </div>

            <div className="flex gap-3 items-center">
                <FaSquare className="text-lg"/>
                <div className="flex flex-col border-b border-gray-300 w-full pb-7">
                    <p className="text-sm text-gray-400">Drop Off</p>
                    <h3 className="text-xl font-medium">{ride?.destination}</h3>
                </div>
            </div>

            <div className="flex flex-col border-b border-gray-300 w-full pb-6 pr-5 mb-5">
                <div className="flex justify-between text-lg font-medium"><h3>Amount</h3> <h3>₹{ride?.fare}</h3></div>
                <div className="flex justify-between text-lg font-medium"><h3>CGST</h3> <h3>₹{2.5*ride?.fare/100}</h3></div>
                <div className="flex justify-between text-lg font-medium"><h3>SGST</h3> <h3>₹{2.5*ride?.fare/100}</h3></div>
                <div className="flex justify-between text-lg font-medium"><h3>Total Amount</h3> <h3>₹{ride?.fare + (5*ride?.fare)/100}</h3></div>
            </div>

            <button onClick={confirmRideOtp} className="bg-green-500 font-medium text-xl text-center rounded-lg w-[95%] py-3">Go to Pickup</button>
            <button onClick={() => setConfirmPopUpOpen(false)} className="bg-gray-300 font-medium text-xl text-black rounded-lg w-[95%] py-3 text-center">Cancel</button>

        </div>
    )
}

export default ConfirmRidePopUp