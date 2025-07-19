import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sign_in from './Pages/Sign_in/Sign_in';
import Sign_up from './Pages/Sign_up/Sign_up';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/sign_in' element={<Sign_in />} />
        <Route path='/sign_up' element={<Sign_up />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);