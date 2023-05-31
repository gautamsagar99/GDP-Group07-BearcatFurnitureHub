import React from 'react'
import Login from './LoginComponent/Login'
import Register from './RegisterComponent/Register'
import Home from './HomeComponent/Home'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import EmailAdress from './ResetPasswordComponent/EmailAdress'
import SendCode from './ResetPasswordComponent/SendCode'
import ResetPassword from './ResetPasswordComponent/ResetPassword'


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