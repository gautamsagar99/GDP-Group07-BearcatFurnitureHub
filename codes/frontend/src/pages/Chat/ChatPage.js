import React, { useState, useEffect } from 'react';
import './Chat.css';
import { getUserDetails } from "../../utils/api";
import { db, collection, query, where, getDocs, orderBy, addDoc, onSnapshot, getDoc, doc } from './firebase';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [unreadMessages, setUnreadMessages] = useState({});
  const loggedInUser = localStorage.getItem('LoggedInUser'); // Assuming you have the UID of the logged-in user
  const [userDetails, setUserDetails] = useState([]);

  const { chatToShow } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        setUserDetails(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
    return () => {
      // Cleanup function (if needed)
      // You can add any cleanup code here
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const allUsersSnapshot = await getDocs(usersRef);
        const allUsers = allUsersSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        const otherUsers = allUsers.filter((user) => user.uid !== loggedInUser);

        const conversationsRef = collection(db, 'messages');
        const conversationsQuery = query(
          conversationsRef,
          where('participants', 'array-contains', loggedInUser)
        );
        const conversationsSnapshot = await getDocs(conversationsQuery);
        const usersWithConversations = new Set();
        conversationsSnapshot.forEach((doc) => {
          const participants = doc.data().participants;
          participants.forEach((participant) => {
            if (participant !== loggedInUser) {
              usersWithConversations.add(participant);
            }
          });
        });

        const filteredUsers = otherUsers.filter((user) => usersWithConversations.has(user.uid));

        setFilteredUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  useEffect(() => {
    const fetchUserDetails = async (email) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return `${userData.firstname} ${userData.lastname}`;
        }
        return '';
      } catch (error) {
        console.error('Error fetching user details:', error);
        return '';
      }
    };

    const fetchMessagesAndUserDetails = async () => {
      try {
        let targetUserName = '';

        if (chatToShow) {
          targetUserName = await fetchUserDetails(chatToShow);

          const chatToShowUserRef = doc(db, 'users', chatToShow);
          const chatToShowUserDoc = await getDoc(chatToShowUserRef);
          const chatToShowUserData = chatToShowUserDoc.data();

          setSelectedUser({
            uid: chatToShow,
            firstname: chatToShowUserData.firstname,
            lastname: chatToShowUserData.lastname,
            // Add other user details if needed
          });
        } else if (selectedUser) {
          targetUserName = `${selectedUser.firstname} ${selectedUser.lastname}`;
        }

        setSelectedUserName(targetUserName);

        const messagesRef = collection(db, 'messages');
        const q1 = query(
          messagesRef,
          orderBy('timestamp'),
          where('participants', '==', [loggedInUser, chatToShow || selectedUser.uid])
        );

        const q2 = query(
          messagesRef,
          orderBy('timestamp'),
          where('participants', '==', [chatToShow || selectedUser.uid, loggedInUser])
        );

        const querySnapshot1 = await getDocs(q1);
        const querySnapshot2 = await getDocs(q2);

        const fetchedMessages1 = querySnapshot1.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const fetchedMessages2 = querySnapshot2.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const allMessages = [...fetchedMessages1, ...fetchedMessages2];

        const sortedMessages = allMessages.sort((a, b) => a.timestamp - b.timestamp);

        const latestTimestamp = sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1].timestamp : null;

        const messagesWithStatus = sortedMessages.map((message) => ({
          ...message,
          new: message.timestamp > latestTimestamp,
        }));

        setMessages(messagesWithStatus);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessagesAndUserDetails();
  }, [selectedUser, loggedInUser, chatToShow]);

  useEffect(() => {
    const unreadMessagesState = {};
    filteredUsers.forEach((user) => {
      unreadMessagesState[user.uid] = false;
    });
    setUnreadMessages(unreadMessagesState);

    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const message = change.doc.data();
        if (message.participants.includes(loggedInUser) && message.new) {
          if (message.sender !== loggedInUser) {
            setUnreadMessages((prevUnreadMessages) => ({
              ...prevUnreadMessages,
              [message.sender]: true,
            }));
          }
        }
      });
    });

    return () => unsubscribe();
  }, [filteredUsers, loggedInUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && selectedUser) {
      const messagesRef = collection(db, 'messages');

      try {
        const docRef = await addDoc(messagesRef, {
          participants: [loggedInUser, selectedUser.uid],
          sender: loggedInUser,
          text: newMessage,
          timestamp: new Date(),
          new: true,
        });

        setNewMessage('');

        setUnreadMessages((prevUnreadMessages) => ({
          ...prevUnreadMessages,
          [selectedUser.uid]: true,
        }));

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: docRef.id,
            participants: [loggedInUser, selectedUser.uid],
            sender: loggedInUser,
            text: newMessage,
            timestamp: new Date(),
            new: true,
          },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);

    setUnreadMessages((prevUnreadMessages) => ({
      ...prevUnreadMessages,
      [user.uid]: false,
    }));
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        const conversationsRef = collection(db, 'messages');
        const conversationsQuery = query(
          conversationsRef,
          where('participants', 'array-contains', loggedInUser)
        );
        const conversationsSnapshot = await getDocs(conversationsQuery);
        const usersWithConversations = new Set();
        conversationsSnapshot.forEach((doc) => {
          const participants = doc.data().participants;
          participants.forEach((participant) => {
            if (participant !== loggedInUser) {
              usersWithConversations.add(participant);
            }
          });
        });

        const usersRef = collection(db, 'users');
        const allUsersSnapshot = await getDocs(usersRef);
        const allUsers = allUsersSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        const filteredUsers = allUsers.filter(
          (user) => user.uid !== loggedInUser && usersWithConversations.has(user.uid)
        );

        setFilteredUsers(filteredUsers);
      } else {
        const q = query(
          collection(db, 'users'),
          where('firstname', '==', searchQuery),
        );

        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
          uid: doc.data().email,
          ...doc.data(),
        }));

        const filteredUsers = users.filter((user) => user.uid !== loggedInUser);

        setFilteredUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error handling search:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="left-sidebar">
        <div className="welcome-message" style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Welcome {userDetails.first_name} {userDetails.last_name}
        </div>
        <br></br>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="user-list">
          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              onClick={() => handleUserSelect(user)}
              style={{ fontWeight: unreadMessages[user.uid] ? 'bold' : 'normal' }}
            >
              {user.firstname + ' ' + user.lastname}
            </div>
          ))}
        </div>
      </div>
      <div className="right-sidebar">
        {selectedUser ? (
          <>
            <div className="selected-user-header">{selectedUserName}</div>
            <div className="message-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.sender === loggedInUser ? 'user-message' : 'other-user-message'}
                  style={{ fontWeight: message.new ? 'bold' : 'normal' }}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="message-input-container">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="select-user-message">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
