import React from "react"
import LandingPage from "./pages/LandingPage"
import Routing from "./routing/Routing"
import {Toaster} from "react-hot-toast"

function App() {

  return (
    <>
      <Routing />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App
