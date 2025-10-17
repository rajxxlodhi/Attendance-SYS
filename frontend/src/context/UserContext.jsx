import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


export const userDataContext =createContext()

function UserContext({children}) {
    let [userData, setUserData] = useState(null)
    const navigate = useNavigate();

    const getCurrentUser = async () => {
      try {
         let result = await axios.get("http://localhost:5000/api/user/currentuser",{withCredentials:true})
          console.log("current User")
         setUserData(result.data)
         console.log(result.data)
      } catch (error) {
        setUserData(null)
        
        console.log(error)
      }
    }

     const handleLogOut = async () => {
      try {
         let result = await axios.get("http://localhost:5000/api/auth/logout",{withCredentials:true})
          console.log("Logout Successfully")
         navigate("/login")
      } catch (error) {
        setUserData(null) 
        console.log(error)
      }
    }

    useEffect(()=>{
        getCurrentUser()
    },[])



    let value={
        userData,setUserData,
        getCurrentUser,handleLogOut
    }
  return (
    <div>
        <userDataContext.Provider value={value}>
        {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext