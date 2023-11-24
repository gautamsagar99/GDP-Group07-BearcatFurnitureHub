import React, { useState, useEffect } from 'react';
import './Chat.css';
import { getUserDetails } from "../../utils/api";
import {
  db,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  onSnapshot,
  getDoc,
  doc,
  limit,
  setDoc
} from './firebase';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const loggedInUser = localStorage.getItem('LoggedInUser');
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
    const sortUsersByLatestMessage = async (users) => {
      const sortedUsers = [];
    
      for (const user of users) {
        const sentMessagesQuery = query(
          collection(db, 'messages'),
          orderBy('timestamp', 'desc'),
          where('participants', '==', [loggedInUser, user.uid]),
          limit(1)
        );
    
        const receivedMessagesQuery = query(
          collection(db, 'messages'),
          orderBy('timestamp', 'desc'),
          where('participants', '==', [user.uid, loggedInUser]),
          limit(1)
        );
    
        const sentMessagesSnapshot = await getDocs(sentMessagesQuery);
        const receivedMessagesSnapshot = await getDocs(receivedMessagesQuery);
    
        const latestSentMessage = sentMessagesSnapshot.empty ? null : sentMessagesSnapshot.docs[0].data().timestamp;
        const latestReceivedMessage = receivedMessagesSnapshot.empty ? null : receivedMessagesSnapshot.docs[0].data().timestamp;
    
        const latestTimestamp = latestSentMessage && latestReceivedMessage
          ? Math.max(latestSentMessage, latestReceivedMessage)
          : latestSentMessage || latestReceivedMessage;
    
        sortedUsers.push({
          ...user,
          latestTimestamp,
        });
      }
    
      // Sort users based on the latest timestamp in descending order
      sortedUsers.sort((a, b) => (b.latestTimestamp || 0) - (a.latestTimestamp || 0));
    
      return sortedUsers;
    };
    
    
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

        const filteredUsers = otherUsers.filter(
          (user) => user.uid !== loggedInUser && usersWithConversations.has(user.uid)
        );
  
        const sortedUsers = await sortUsersByLatestMessage(filteredUsers);
  
        setFilteredUsers(sortedUsers);
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
          });

          // Update the status of messages to 'read' for the sender
          const messagesRef = collection(db, 'messages');
          const updateStatusQuery = query(
            messagesRef,
            where('participants', '==', [chatToShow, loggedInUser]),
            where('status', '==', 'unread')
          );
          const updateStatusSnapshot = await getDocs(updateStatusQuery);

          updateStatusSnapshot.forEach(async (doc) => {
            await setDoc(doc(db, 'messages', doc.id), { status: 'read' }, { merge: true });
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

  // Inside the useEffect for updateStatus

  useEffect(() => {
    const updateStatus = async () => {
      try {
        if (selectedUser) {
          const messagesRef = collection(db, 'messages');
          const q = query(
            messagesRef,
            where('participants', '==', [selectedUser.uid, loggedInUser]),
            orderBy('timestamp', 'desc'),
            limit(1)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const latestMessage = querySnapshot.docs[0];
            if (latestMessage.data().status === 'unread') {
              // Update the status to 'read' when the chat is opened
              await setDoc(doc(db, 'messages', latestMessage.id), { status: 'read' }, { merge: true });
            }
          }
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

    updateStatus();
  }, [selectedUser, loggedInUser]);

  // Inside the useEffect for onSnapshot

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const message = change.doc.data();
        if (message.participants && message.participants.includes(loggedInUser) && message.new) {
          if (message.sender !== loggedInUser) {
            // If the message is new, update its status to 'read' when received
            await setDoc(doc(db, 'messages', change.doc.id), { status: 'read' }, { merge: true });

          }
        }
      });
    });

    return () => unsubscribe();
  }, [loggedInUser, selectedUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && selectedUser) {
      const messagesRef = collection(db, 'messages');

      try {
        const docRef = await addDoc(messagesRef, {
          participants: [loggedInUser, selectedUser.uid],
          sender: loggedInUser,
          text: newMessage,
          timestamp: new Date(),
          new: selectedUser.uid,
          status: 'unread',
        });

        setNewMessage('');

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: docRef.id,
            participants: [loggedInUser, selectedUser.uid],
            sender: loggedInUser,
            text: newMessage,
            timestamp: new Date(),
            new: true,
            status: 'unread',
          },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
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

  const formatDate = (timestamp) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
      }

      const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };

      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      console.log('Invalid timestamp:', timestamp);
      return 'Invalid Date';
    }
  };

  return (
    <div className="chat-container">
      <div className="left-sidebar">
        <div className="welcome-message" style={{ textAlign: 'center' }}>
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
                >
                  <div>{message.text}</div>
                  <div style={{ color: 'grey', fontSize: '12px' }}>{formatDate(message.timestamp)}</div>
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
	