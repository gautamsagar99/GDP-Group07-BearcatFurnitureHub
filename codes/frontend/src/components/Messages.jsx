import { Messahe } from './Messahe'
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../utils/chatContext";
import { db } from "../utils/firebase";
import "../pages/ChatPage/style.scss"

export const Messages = () => {

  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);
  console.log(messages)

  return (
    <div className="messages">
      {messages.map((m) => (
        <Messahe message={m} key={m.id} />
      ))}
    </div>
  );
};

