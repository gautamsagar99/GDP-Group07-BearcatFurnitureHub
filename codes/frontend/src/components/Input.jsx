import React,{ useContext, useState } from 'react'
import "../pages/ChatPage/style.scss"
import { ChatContext } from "../utils/chatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db} from "../utils/firebase";
import { v4 as uuid } from "uuid";


export const Input = () => {

  const [text, setText] = useState("");
  const currentUserEmail=localStorage.getItem("LoggedInUser");

  const { data } = useContext(ChatContext);

  const handleSend=async ()=>{
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId:currentUserEmail,
        date: Timestamp.now(),
      }),
    });

    await updateDoc(doc(db, "userChat", currentUserEmail), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChat", data.user.email), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
  }
  return (
    <div className="input">
    <input className='typesomethinginput' type="text" placeholder="Type something..." onChange={(e) => setText(e.target.value)} value={text}/>
    <div className="send">
      
     
      
      <button onClick={handleSend}>Send</button>
    </div>
  </div>
  )
}
