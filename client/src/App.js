import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Marketplace from './pages/Marketplace';
import Groups from './pages/Groups';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/groups" element={<Groups />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
