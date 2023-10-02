import React from 'react'
import { Sidebar } from '../../components/Sidebar';
import { Chat } from '../../components/Chat';
import "./style.scss";

export const ChatPage = () => {
  return (
    <div className='home'>
      <div className="chatcontainer">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default ChatPage;
