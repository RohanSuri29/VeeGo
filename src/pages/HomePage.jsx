import { FaArrowRight } from "react-icons/fa6"
import { NavLink } from "react-router-dom"

function HomePage() {

    return (

        <div className="bg-class h-screen pt-8 flex justify-between flex-col w-full">

            <h2 className="font-montserrat text-3xl mt-3 font-semibold ml-5">VeeGo</h2>

            <div className="bg-white pb-12 py-12 px-5">

                <h2 className='text-[33px] font-semibold font-sans'>Get Started with VeeGo</h2>
                
                <NavLink to={'/login'}>
                    
                    <button className='flex items-center w-full bg-black text-white py-3 rounded-lg mb-4 mt-8'>
                        <p className="mx-auto text-lg">Continue</p> 
                        <FaArrowRight className="text-lg mr-4"/>
                    </button>

                </NavLink>

            </div>
        </div>
    )
}

export default HomePage