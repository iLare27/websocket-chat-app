import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient, QueryClientProvider } from 'react-query';
import queryClient from './queryClient';
import MessageList from './components/MessageList';
import useWebSocket from './hooks/useWebSocket';

const fetchMessages = async () => {
  const res = await fetch(process.env.REACT_APP_API_URL + '/messages');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const App = () => {
  const queryClient = useQueryClient();
  const { data: messages, refetch } = useQuery('messages', fetchMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleMessage = useCallback((data) => {
    if (data.type === 'created' || data.type === 'deleted') {
      refetch();
    }
  }, [refetch]);

  useWebSocket(process.env.REACT_APP_WS_URL, handleMessage);

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + '/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: newMessage }),
        });
        if (res.ok) {
          console.log('Message sent successfully');
        } else {
          console.error('Failed to send message:', res.statusText);
        }
        setNewMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
      <div>
        <h1>Chat Messages</h1>
        <MessageList messages={messages} />
        <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
  );
};

export default function WrappedApp() {
  return (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
  );
}
