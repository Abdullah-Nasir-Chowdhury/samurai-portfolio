import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import SamuraiPortfolio from './SamuraiPortfolio';
import SamuraiPortfolio from './Test';
import ModernPortfolio from './ModernPortfolio';
import BlogPlatform from './blog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SamuraiPortfolio />} />
        {/* Same home page; the separate path lets analytics count visits from the Instagram bio link */}
        <Route path="/ig" element={<SamuraiPortfolio />} />
        <Route path="/modern" element={<ModernPortfolio />} />
        <Route path="/blog" element={<BlogPlatform />} />
      </Routes>
    </Router>
  );
}

export default App;