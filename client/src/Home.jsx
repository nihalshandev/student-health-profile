import React from 'react'
import HomeDashboard from './Components/Dashboard/HomeDashboard'
import Student from './Components/Dashboard/Student'
import Navbar from './Components/Navbar/Navbar'

function Home() {
  return (
    <div>
        <Navbar />
        <HomeDashboard />
        {/* <Student /> */}
    </div>
  )
}

export default Home