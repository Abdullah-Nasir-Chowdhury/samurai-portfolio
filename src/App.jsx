import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import SamuraiPortfolio from './SamuraiPortfolio';
import SamuraiPortfolio from './Test';
import ModernPortfolio from './ModernPortfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SamuraiPortfolio />} />
        <Route path="/modern" element={<ModernPortfolio />} />
      </Routes>
    </Router>
  );
}

export default App;