//routing of entire page
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import Login from '../pages/Login'
import ThumbnailGenerator from '../pages/ThumbnailGenerator'
import ExportPage from '../pages/ExportPage'
import Signup from '../pages/Signup'
import HistoryPage from '../pages/HistoryPage'
import PricingPage from '../pages/PricingPage'
// import Splinebg from '../components/Splinebg'

const Routing = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path='/spline' element={<Splinebg />}/> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/thumbnail-generation" element={<ThumbnailGenerator />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/pricing' element={<PricingPage/>}/>
        <Route path="/export" element={<ExportPage/>} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  )
}

export default Routing