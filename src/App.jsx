import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import SamuraiPortfolio from './SamuraiPortfolio';
import SamuraiPortfolio from './Test';
import ModernPortfolio from './modernportfolio';
import BlogPlatform from './blog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SamuraiPortfolio />} />
        <Route path="/modern" element={<ModernPortfolio />} />
        <Route path="/blog" element={<BlogPlatform />} />
      </Routes>
    </Router>
  );
}

export default App;