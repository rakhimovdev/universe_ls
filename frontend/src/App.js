import React from 'react'
import "./App.css"
import Banner from "./components/banner/Banner"
import Navbar from "./components/Navbar/Navbar"


function App() {
  return (
    <div className='app'>
      <Navbar/>
      <Banner/>
    </div>
  )
}

export default App