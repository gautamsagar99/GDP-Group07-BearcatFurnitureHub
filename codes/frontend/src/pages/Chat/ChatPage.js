import React, { useState, useEffect } from 'react';
import './Chat.css';
import { getUserDetails } from "../../utils/api";
import { db, collection, query, where, getDocs, orderBy, addDoc, onSnapshot } from './firebase';

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

        // Filter out the logged-in user
        const otherUsers = allUsers.filter((user) => user.uid !== loggedInUser);

        // Fetch users with whom the logged-in user has had conversations
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

        // Include only users with whom the logged-in user has had conversations
        const filteredUsers = otherUsers.filter((user) => usersWithConversations.has(user.uid));

        setFilteredUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const messagesRef = collection(db, 'messages');

        const q1 = query(
          messagesRef,
          orderBy('timestamp'),
          where('participants', '==', [loggedInUser, selectedUser.uid])
        );

        const q2 = query(
          messagesRef,
          orderBy('timestamp'),
          where('participants', '==', [selectedUser.uid, loggedInUser])
        );

        try {
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

          // Determine the latest timestamp for the selected user
          const latestTimestamp = sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1].timestamp : null;

          // Mark messages as new if their timestamp is newer than the latest timestamp
          const messagesWithStatus = sortedMessages.map((message) => ({
            ...message,
            new: message.timestamp > latestTimestamp,
          }));

          setMessages(messagesWithStatus);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
      setSelectedUserName(`${selectedUser.firstname} ${selectedUser.lastname}`);
    } else {
      setMessages([]);
      setSelectedUserName('');
    }
  }, [selectedUser, loggedInUser]);

  useEffect(() => {
    // Initialize unread messages state for each user
    const unreadMessagesState = {};
    filteredUsers.forEach((user) => {
      unreadMessagesState[user.uid] = false;
    });
    setUnreadMessages(unreadMessagesState);

    // Listen for new messages and update unread status
    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const message = change.doc.data();
        if (message.participants.includes(loggedInUser) && message.new) {
          // Check if the message is sent by someone other than the logged-in user
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
          new: true, // Mark the new message
        });

        setNewMessage('');

        // Mark the user's chat as unread
        setUnreadMessages((prevUnreadMessages) => ({
          ...prevUnreadMessages,
          [selectedUser.uid]: true,
        }));

        // You can update the state optimistically here if needed
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: docRef.id,
            participants: [loggedInUser, selectedUser.uid],
            sender: loggedInUser,
            text: newMessage,
            timestamp: new Date(),
            new: true, // New message is marked as true
          },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Mark the user's chat as read
    setUnreadMessages((prevUnreadMessages) => ({
      ...prevUnreadMessages,
      [user.uid]: false,
    }));
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        // If the search query is empty, fetch all users with whom the logged-in user has had conversations
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

        // Exclude the logged-in user and users with whom the logged-in user has had conversations
        const filteredUsers = allUsers.filter(
          (user) => user.uid !== loggedInUser && usersWithConversations.has(user.uid)
        );

        setFilteredUsers(filteredUsers);
      } else {
        // If there is a search query, perform the regular search logic
        const q = query(
          collection(db, 'users'),
          where('firstname', '==', searchQuery),
        );

        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
          uid: doc.data().email,
          ...doc.data(),
        }));

        // Exclude the logged-in user from the list
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
