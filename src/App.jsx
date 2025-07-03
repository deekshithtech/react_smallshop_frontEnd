import React from 'react'
import './app.css'
import Navbar from './Components/Navbar'
import Items from './Components/Items'
import { Route, Routes } from 'react-router-dom'
import Inventory from './Components/Inventory'
import Purchases from './Components/Purchases'
import Shipping from './Components/Shipping'
import Home from './Components/Home'
const App = () => {
  return (
<div className="min-h-screen flex flex-col">
  <Navbar/>
  <main className="flex-grow container mx-auto px-4 py-8">
    <Routes>
          <Route path="/" element={<Home/>} /> 
          <Route path="/items" element={<Items/>} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path='/purchases'element={<Purchases/>}/>
          <Route path='/shipping' element={<Shipping/>}/>
        </Routes>
</main>
   </div>
  )
}

export default App