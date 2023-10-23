import React,{ useState } from 'react'
import "../pages/ChatPage/style.scss";
import {db} from "../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { Chat } from './Chat';



export const Search = () => {

  const currentUserEmail=localStorage.getItem("LoggedInUser");
  //const fullName=localStorage.getItem("fullName");
 // console.log(fullName)

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [err, setErr] = useState(false);
  

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("firstname", "==", username)
    );

    const q2 = query(
      collection(db, "users"),
      where("email", "==", currentUserEmail)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  

  try {
    const query2Snapshot = await getDocs(q2);
    query2Snapshot.forEach((doc) => {
      setCurrentUser(doc.data());
    });
  } catch (err) {
    setErr(true);
  }
}


  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    
    const combinedId = currentUserEmail < user.email ? currentUserEmail + user.email : user.email + currentUserEmail;
    const sanitizedCombinedId = combinedId.replace(/[.$#[\]/@]/g, "_");
        try {
          const res = await getDoc(doc(db, "chats", sanitizedCombinedId));
          
          if (res.exists()) {
            const updateData2 = {
              [sanitizedCombinedId + '.date']: serverTimestamp(), // Partial update for the 'date' field
            };
            
            await updateDoc(doc(db, "userChat", currentUserEmail), updateData2);
          }
       
          if (!res.exists()) {
            //create a chat in chats collection
          
            await setDoc(doc(db, "chats", sanitizedCombinedId), { messages: [] });
    
            //create user chats
            // await updateDoc(doc(db, "userChat", currentUser), {
            //   [combinedId + ".userInfo"]: {
            //     name:user.firstname
            //   },
            //   [combinedId + ".date"]: serverTimestamp(),
            // });
            const updateData = {
              [sanitizedCombinedId]: {
                userInfo: {
                  name: user.firstname+" "+user.lastname,
                  email:user.email
                },
                date: serverTimestamp()
              }
            };
            
            await updateDoc(doc(db, "userChat", currentUserEmail), updateData);
            
    
            await updateDoc(doc(db, "userChat", user.email), {
              [sanitizedCombinedId + ".userInfo"]: {
                name:currentUser.firstname+" "+currentUser.lastname,
                email:currentUser.email
              },
              [sanitizedCombinedId + ".date"]: serverTimestamp(),
            });
          }
        } catch (err) {}
    
        setUser(null);
        setUsername("")
      };

  return (
    <div className="search">
    <div className="searchForm">
      <input className='chatinput'
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}/>
    </div>
    {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <div className="userChatInfo">
            <span>{user.firstname}</span>
          </div>
        </div>
      )}
    </div>
  )
}
