import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/assets/styles/main.css';
import App from './app/App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
