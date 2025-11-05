import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const addressDataContext = createContext()
function AddressContext({children}) {

      const [address, setAddress] = useState(null);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
    const apiKey = import.meta.env.VITE_GEOAPIKEY || "19e7a87a11564e6ba859a020238937c9";
    useEffect(()=>{

         if (!navigator.geolocation) {
      console.error("Geolocation not supported by browser.");
      return;
    }
        navigator.geolocation.getCurrentPosition(async (position)=>{
            console.log(position)
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            try {
                 const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
                  console.log(result.data.results[0].formatted)
                   if (result.data.results?.length > 0) {
                    setAddress(result.data.results[0].formatted);
                } else {
                    setAddress("Unknown location");
                }
            } catch (err) {
                 console.error("Reverse geocoding failed:", err);
                setAddress("Unknown location");
            }
           
        })
    },[])

   let value = {   address,
    setAddress,
    coords,
    setCoords,} 
  return (
    <div>
        <addressDataContext.Provider value={value}>
            {children}
        </addressDataContext.Provider>
        
    </div>
  )
}

export default AddressContext