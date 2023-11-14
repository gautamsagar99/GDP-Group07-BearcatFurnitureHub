import React from 'react'
import Login from './pages/LoginPage/Login'
import Register from './pages/RegisterPage/Register'
import Home from './pages/HomePage/Home'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import EmailAdress from './pages/ResetPasswordPage/EmailAdress'
import SendCode from './pages/ResetPasswordPage/SendCode'
import ResetPassword from './pages/ResetPasswordPage/ResetPassword'
import DonateFurniture from './pages/DonatePage/DonateFurniture'
import ProductDetails from './pages/ProductDetailsPage/ProductDetails'
import ProfileDetails from './pages/ProfilePage/ProfileDetails'
import Chat from './pages/Chat/ChatPage';

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
          <Route path="/DonateFurniture" element={<DonateFurniture/>} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/ProfileDetails" element={<ProfileDetails/>} />
          <Route path="/Chat" element={<Chat/>} />        
        </Routes>
      </div>
    </Router>
  );
}

export default App