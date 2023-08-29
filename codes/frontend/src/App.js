import React from 'react'
import Login from './pages/LoginPage/Login'
import Register from './pages/RegisterPage/Register'
import Home from './pages/HomePage/Home'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import EmailAdress from './pages/ResetPasswordPage/EmailAdress'
import SendCode from './pages/ResetPasswordPage/SendCode'
import ResetPassword from './pages/ResetPasswordPage/ResetPassword'


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/enter-email" element={<EmailAdress/>} />
          <Route path="/forgot-password" element={<SendCode/>} />
          <Route path="/ResetPassword" element={<ResetPassword/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App