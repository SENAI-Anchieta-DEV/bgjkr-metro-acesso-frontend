import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App'; // Aponta para o nosso novo App.jsx
import './index.css'; // Mantém as tuas variáveis de cor globais do Figma

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);