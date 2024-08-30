import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './hooks/Context';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  );
} else {
  console.error("Root element not found");
}
