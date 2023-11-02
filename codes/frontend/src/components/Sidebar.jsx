import React from 'react'
import '../pages/ChatPage/style.scss';
import { NavbarChat } from './NavbarChat';
import { Search } from './Search';
import { Chats } from './Chats';

export const Sidebar = () => {
  return (
    <div className='sidebar'>
    <NavbarChat/>
    <Search/>
    <Chats/>
    </div>

  )
}
