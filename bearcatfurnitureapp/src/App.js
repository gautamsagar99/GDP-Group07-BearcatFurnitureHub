import React from 'react'
import Login from './LoginComponent/Login'
import Register from './RegisterComponent/Register'
import Home from './HomeComponent/Home'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App