import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProvider } from './context/AppContext.jsx';
import { CursorProvider } from './context/CursorContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CursorProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </CursorProvider>
  </React.StrictMode>,
);
