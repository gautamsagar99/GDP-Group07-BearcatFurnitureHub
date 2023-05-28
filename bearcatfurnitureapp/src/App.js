import React from 'react'
import Login from './LoginComponent/Login'
import Register from './RegisterComponent/Register'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App