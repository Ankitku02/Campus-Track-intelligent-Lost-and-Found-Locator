import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    axios.get('http://13.60.52.103:9999/api/chat/messages')
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, []);

  const connect = () => {
    stompClient.current = new Client({
      webSocketFactory: () => new SockJS('http://13.60.52.103:9999/ws'),
      onConnect: () => {
        stompClient.current.subscribe('/topic/public', message => {
          const msg = JSON.parse(message.body);
          setMessages(prev => [...prev, msg]);
        });

        stompClient.current.subscribe('/topic/online', users => {
          setOnlineUsers(JSON.parse(users.body));
        });

        stompClient.current.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({ sender: username, type: "JOIN" }),
        });

        setIsJoined(true);
      },
      onStompError: (frame) => {
        console.error("Broker error: ", frame.headers["message"]);
        console.error(frame.body);
      },
    });

    stompClient.current.activate();
  };

  const sendMessage = () => {
    if (currentMessage.trim() && stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({ sender: username, content: currentMessage, type: "CHAT" }),
      });
      setCurrentMessage('');
    }
  };

  const leaveChat = () => {
    if (stompClient.current) {
      stompClient.current.publish({
        destination: "/app/chat.leaveUser",
        body: JSON.stringify({ sender: username, type: "LEAVE" }),
      });
      stompClient.current.deactivate();
      setOnlineUsers([]);
      setMessages([]);
      setIsJoined(false);
      setUsername('');
    }
  };

  const handleJoin = () => {
    if (username.trim()) {
      connect();
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <div style={{
      display: 'flex', 
      height: 500, 
      maxWidth: 850, 
      margin: '30px auto', 
      border: '1px solid #ddd', 
      borderRadius: 8,
      fontFamily: 'Arial, sans-serif'
    }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!isJoined ? (
          <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
            <input 
              type="text" 
              placeholder="Enter your username" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              style={{ padding: 10, width: '70%', marginRight: 10, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button onClick={handleJoin} style={{ padding: '10px 20px', borderRadius: 4, cursor: 'pointer' }}>Join Chat</button>
          </div>
        ) : (
          <>
            <div style={{ 
              flex: 1, 
              backgroundColor: '#fafafa', 
              overflowY: 'auto', 
              padding: 15, 
              borderBottom: '1px solid #ccc' 
            }}>
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  style={{ 
                    backgroundColor: msg.sender === username ? '#dcf8c6' : '#fff', 
                    padding: 10, 
                    borderRadius: 8,
                    maxWidth: '70%',
                    alignSelf: msg.sender === username ? 'flex-end' : 'flex-start',
                    marginBottom: 10,
                    wordBreak: 'break-word',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  <strong>{msg.sender}</strong>: {msg.content}
                  <div style={{ fontSize: 10, color: '#555', marginTop: 4 }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            <div style={{ display: 'flex', padding: 12 }}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter') sendMessage(); }}
                style={{ flex: 1, padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
              />
              <button onClick={sendMessage} style={{ marginLeft: 10, padding: '10px 15px', cursor: 'pointer' }}>Send</button>
              <button 
                onClick={leaveChat} 
                style={{ marginLeft: 10, padding: '10px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                Leave
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{ width: 220, backgroundColor: '#f3f3f3', borderLeft: '1px solid #ddd', padding: 15 }}>
        <h3>Online Users ({onlineUsers.length})</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {onlineUsers.map((user, i) => (
            <li key={i} style={{ marginBottom: 8, fontWeight: 'bold', color: '#333' }}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRoom;
