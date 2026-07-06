import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

// Helper to generate consistent avatar colors based on username
const getAvatarColor = (name) => {
  const colors = [
    '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', 
    '#06b6d4', '#f43f5e', '#14b8a6', '#6366f1', '#a855f7'
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

// Helper to get initials
const getInitials = (name) => {
  if (!name) return "?";
  return name.trim().substring(0, 2).toUpperCase();
};

// Helper to format timestamps to local time correctly
const formatTime = (timestampStr) => {
  if (!timestampStr) return "";
  let date = new Date(timestampStr);
  
  // If the timestamp string from Render (UTC) lacks timezone info, append 'Z' to parse it as UTC
  if (typeof timestampStr === 'string' && !timestampStr.includes('Z') && !timestampStr.includes('+')) {
    date = new Date(timestampStr + 'Z');
  }
  
  // Format as hh:mm AM/PM
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

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
    axios.get('https://campus-track-intelligent-lost-and-found-kelp.onrender.com/api/chat/messages')
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, []);

  const connect = () => {
    stompClient.current = new Client({
      webSocketFactory: () => new SockJS('https://campus-track-intelligent-lost-and-found-kelp.onrender.com/ws'),
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
      height: '600px',
      maxWidth: '1000px',
      margin: '20px auto',
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
      borderRadius: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      overflow: 'hidden',
      border: '1px solid #eaeaea'
    }}>
      
      {/* LEFT SIDEBAR: Online Users */}
      <div style={{
        width: '280px',
        backgroundColor: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Online Users</h3>
          <span style={{
            marginLeft: 'auto',
            backgroundColor: '#e2e8f0',
            color: '#475569',
            fontSize: '12px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>{onlineUsers.length}</span>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {onlineUsers.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>No users online</div>
          ) : (
            onlineUsers.map((user, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: getAvatarColor(user),
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '12px'
                }}>{getInitials(user)}</div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
        {!isJoined ? (
          /* JOIN VIEW */
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            padding: '40px',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              marginBottom: '10px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>Global Chat</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Connect with other users on campus to track items, share updates, and communicate in real-time.</p>
            </div>
            
            <div style={{ width: '100%', display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input 
                type="text" 
                placeholder="Enter your username..." 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter') handleJoin(); }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
              <button 
                onClick={handleJoin} 
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  transition: 'background-color 0.2s'
                }}
              >Join</button>
            </div>
          </div>
        ) : (
          /* CHAT INTERFACE */
          <>
            {/* CHAT HEADER */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Campus Global Room</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Logged in as <strong style={{ color: '#3b82f6' }}>{username}</strong></p>
              </div>
              <button 
                onClick={leaveChat} 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >Leave Room</button>
            </div>

            {/* MESSAGES DISPLAY */}
            <div style={{
              flex: 1,
              backgroundColor: '#f8fafc',
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map((msg, i) => {
                const isSelf = msg.sender === username;
                const isSystem = msg.type === "JOIN" || msg.type === "LEAVE";
                
                if (isSystem) {
                  return (
                    <div key={i} style={{
                      alignSelf: 'center',
                      backgroundColor: '#e2e8f0',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      margin: '4px 0'
                    }}>
                      {msg.content}
                    </div>
                  );
                }

                return (
                  <div 
                    key={i} 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      alignSelf: isSelf ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      flexDirection: isSelf ? 'row-reverse' : 'row'
                    }}
                  >
                    {/* User Initials Avatar */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: getAvatarColor(msg.sender),
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '13px',
                      flexShrink: 0,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>{getInitials(msg.sender)}</div>

                    {/* Message Card */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isSelf ? 'flex-end' : 'flex-start'
                    }}>
                      {!isSelf && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#64748b',
                          marginBottom: '4px',
                          marginLeft: '4px'
                        }}>{msg.sender}</span>
                      )}
                      
                      <div style={{
                        backgroundColor: isSelf ? '#3b82f6' : '#ffffff',
                        color: isSelf ? '#ffffff' : '#1e293b',
                        padding: '12px 16px',
                        borderRadius: isSelf ? '16px 16px 2px 16px' : '2px 16px 16px 16px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                        wordBreak: 'break-word',
                        border: isSelf ? 'none' : '1px solid #e2e8f0'
                      }}>
                        {msg.content}
                        
                        <div style={{
                          fontSize: '9px',
                          color: isSelf ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                          marginTop: '6px',
                          textAlign: 'right',
                          fontWeight: '500'
                        }}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef}></div>
            </div>

            {/* SEND INPUT AREA */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '12px',
              backgroundColor: '#ffffff',
              alignItems: 'center'
            }}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter') sendMessage(); }}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '24px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  transition: 'border-color 0.2s'
                }}
              />
              <button 
                onClick={sendMessage} 
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                  transition: 'background-color 0.2s',
                  flexShrink: 0
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(1px)' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
