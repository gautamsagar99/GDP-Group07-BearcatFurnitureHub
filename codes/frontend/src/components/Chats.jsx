import React,{useState,useContext,useEffect, useRef} from 'react'
import "../pages/ChatPage/style.scss"
import {db} from "../utils/firebase"
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from '../utils/chatContext';

export const Chats = () => {
  const currentUser=localStorage.getItem("LoggedInUser");
  const [chats, setChats] = useState([]);
  const { dispatch } = useContext(ChatContext);
  let donormail=localStorage.getItem("DonorEmail");
  console.log("donor mail is ",donormail)
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  const firstChatRef = useRef(null);
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

  useEffect(() => {
    // This useEffect will be triggered once when chats are updated
    if (chats) {
      // Check if there are chats
      const chatEntries = Object.entries(chats);
      console.log(chatEntries);
      if (chatEntries.length > 0) {
        // Select the first chat automatically
        chatEntries.map((chatEntry) => {
          console.log("usermail is", chatEntry[1].userInfo.email);
          if (chatEntry[1].userInfo.email === donormail) {
            handleSelect(chatEntry[1].userInfo);
          }
        });
        
        
      }
    }
  }, [chats]);

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
