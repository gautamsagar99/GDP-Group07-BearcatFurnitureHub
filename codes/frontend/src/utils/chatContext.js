import {
    createContext,
    useContext,
    useReducer,
  } from "react";
  
  export const ChatContext = createContext();
  const currentUser=localStorage.getItem("LoggedInUser");
  
  
  export const ChatContextProvider = ({ children }) => {

    const INITIAL_STATE = {
      chatId: "null",
      user: {},
    };
  
    const chatReducer = (state, action) => {
        const combinedId = currentUser <action.payload.email
        ? currentUser + action.payload.email
        : action.payload.email + currentUser;
        const sanitizedCombinedId = combinedId.replace(/[.$#[\]/@]/g, "_");
  
      switch (action.type) {
        case "CHANGE_USER":
          return {
            user: action.payload,
            chatId:sanitizedCombinedId,
            
          };
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  
    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };