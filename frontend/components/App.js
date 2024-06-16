import React from 'react'
import Home from './Home'
import Form from './Form'
import { NavLink } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div id="app">
      <nav>
        <NavLink to="/" className="active">Home</NavLink>
        <NavLink to="/order" className="active">Order</NavLink>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        
        <Route exact path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />

      </Routes>

    </div>
  )
}

export default App
