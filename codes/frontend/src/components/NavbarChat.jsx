import React from 'react'
import "../pages/ChatPage/style.scss"

const currentUser=localStorage.getItem("LoggedInUser");
export const NavbarChat = () => {
    return (
        <div className='navbar'>
          <span className="logo">Lama Chat</span>
          <div className="user">
            <span>{currentUser}</span>
          </div>
        </div>
      )
}
