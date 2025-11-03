// ... other imports ...
import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load all previous messages
    axios.get('http://localhost:9999/api/chat/messages')
      .then(response => setMessages(response.data))
      .catch(console.error);
  }, []);

  const connect = () => {
    const socket = new SockJS('http://localhost:9999/ws');
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      // Subscribe to public messages topic
      stompClient.current.subscribe('/topic/public', (message) => {
        const msg = JSON.parse(message.body);
        setMessages(prev => [...prev, msg]);
      });

      // Subscribe to online users topic
      stompClient.current.subscribe('/topic/online', (users) => {
        const usersList = JSON.parse(users.body);
        setOnlineUsers(usersList);
      });

      // Notify backend about user joined
      stompClient.current.send('/app/chat.addUser', {}, JSON.stringify({ sender: username, type: 'JOIN' }));
      setIsJoined(true);
    });
  };

  const sendMessage = () => {
    if (currentMessage.trim() && stompClient.current) {
      const chatMessage = { sender: username, content: currentMessage, type: 'CHAT' };
      stompClient.current.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
      setCurrentMessage('');
    }
  };

  const leaveChat = () => {
    if (stompClient.current) {
      stompClient.current.send('/app/chat.leaveUser', {}, JSON.stringify({ sender: username, type: 'LEAVE' }));
      stompClient.current.disconnect();
      setIsJoined(false);
      setOnlineUsers([]); // Clear users on leave for clean UI
      setMessages([]);
    }
  };

  const handleJoin = () => {
    if (username.trim()) connect();
  };

  return (
    <div style={{ display: 'flex', height: '500px', border: '1px solid #ddd', borderRadius: 8 }}>
      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!isJoined ? (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ padding: 10, marginRight: 10 }}
            />
            <button onClick={handleJoin} style={{ padding: 10 }}>Join Chat</button>
          </div>
        ) : (
          <>
            {/* Messages List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 10, backgroundColor: '#f9f9f9' }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 10,
                    padding: 8,
                    backgroundColor: msg.sender === username ? '#dcf8c6' : '#fff',
                    borderRadius: 8,
                    maxWidth: '70%',
                    alignSelf: msg.sender === username ? 'flex-end' : 'flex-start',
                  }}
                >
                  <strong>{msg.sender}</strong>: {msg.content}
                  <small style={{ display: 'block', color: '#888' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input + Buttons */}
            <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #ddd' }}>
              <input
                type="text"
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              />
              <button onClick={sendMessage} style={{ marginLeft: 10, padding: '10px 20px' }}>Send</button>
              <button onClick={leaveChat} style={{ marginLeft: 10, padding: '10px 20px', backgroundColor: '#f44336', color: 'white' }}>Leave</button>
            </div>
          </>
        )}
      </div>

      {/* Online Users Sidebar */}
      <div style={{ width: 200, borderLeft: '1px solid #ddd', padding: 10, backgroundColor: '#f0f0f0' }}>
        <h3>Online Users ({onlineUsers.length})</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {onlineUsers.map((user, i) => (
            <li key={i} style={{ padding: '5px 0' }}>
              {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRoom;
