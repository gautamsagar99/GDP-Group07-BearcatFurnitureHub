import React,{useContext} from 'react'
import '../pages/ChatPage/style.scss';
import {Input} from './Input';
import { Messages } from './Messages';
import { ChatContext } from '../utils/chatContext';

export const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.name}</span>
        <div className="chatIcons">
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}
