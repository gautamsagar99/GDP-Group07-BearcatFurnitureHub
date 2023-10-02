import React,{useState,useContext,useEffect} from 'react'
import "../pages/ChatPage/style.scss"
import {db} from "../utils/firebase"
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from '../utils/chatContext';

export const Chats = () => {
  const currentUser=localStorage.getItem("LoggedInUser");
  const [chats, setChats] = useState([]);
  const { dispatch } = useContext(ChatContext);
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChat", currentUser), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser && getChats();
  }, [currentUser]);
  console.log(Object.entries(chats));
  return (
    <div className="chats">
    {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
      <div
        className="userChat"
        key={chat[0]}
        onClick={() => handleSelect(chat[1].userInfo)}
      >
        
        <div className="userChatInfo">
          <span>{chat[1].userInfo.name}</span>
          <p>{chat[1].lastMessage?.text}</p>
        </div>
      </div>
    ))}
  </div>
  )
}
