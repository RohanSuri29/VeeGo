import { FaLocationDot } from "react-icons/fa6"

function LocationPanel ({suggestions , activeField , setPickup , setDestination , setMainTextPickup , setMainTextDestination , setSecTextPickup , setSecTextDestination}) {

  function handleSuggestionClick(suggestion) {
    if(activeField === 'pickup') {
      setPickup(suggestion?.description);
      setMainTextPickup(suggestion?.structured_formatting?.main_text);
      setSecTextPickup(suggestion?.structured_formatting?.secondary_text);
    }
    else{
      setDestination(suggestion?.description);
      setMainTextDestination(suggestion?.structured_formatting?.main_text);
      setSecTextDestination(suggestion?.structured_formatting?.secondary_text);
    }
  }

  return (

    <div className="flex flex-col gap-4 bg-white h-full w-full ">
      {
        suggestions?.map((suggestion,index) => (

          <div key={index} className="flex items-center gap-4 active:border-2 border-black rounded-lg px-4 py-2" onClick={() => handleSuggestionClick(suggestion)}>

            <div className="bg-gray-300 rounded-full aspect-square flex items-center justify-center text-xl w-11 h-11"><FaLocationDot/></div>
            <h5 className="font-semibold text-xl">{suggestion?.description}</h5>    

          </div>
        ))
      }
    </div>

  )
}

export default LocationPanel