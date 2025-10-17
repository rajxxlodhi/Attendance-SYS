import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import EmployeDashbord from '../components/EmployeDashbord'
import AdminDashBord from '../components/AdminDashBord'

function Home() {
    let {userData} = useContext(userDataContext)
  return (
    <div >
        {userData?.role == "employee" && <EmployeDashbord/>}
        {userData?.role == "admin" && <AdminDashBord/>}
    </div>
  )
}

export default Home