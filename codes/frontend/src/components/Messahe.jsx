import "../pages/ChatPage/style.scss"
import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../utils/chatContext";

export const Messahe = ({message}) => {
  const currentUserEmail=localStorage.getItem("LoggedInUser");

  const { data } = useContext(ChatContext);

  const ref = useRef();

  // useEffect(() => {
  //   ref.current?.scrollIntoView({ behavior: "smooth" });
  // }, [message]);

  return (
    <div
    ref={ref}
    className={`message ${message.senderId === currentUserEmail && "owner"}`}
  >
         <div className="messageInfo">
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
      </div>
    </div>
  )
}
