import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatInterface from './components/ChatInterface';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChatInterface 
      yearLevel="Year 9" 
      subject="Mathematics" 
      sessionId="pilot-test-01" 
    />
  </React.StrictMode>
);