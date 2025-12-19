import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TrianglePerimeter from './pages/TrianglePerimeter';
import CircleArea from './pages/CircleArea';

// Using HashRouter for GitHub Pages compatibility
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/triangle-perimeter" element={<TrianglePerimeter />} />
          <Route path="/circle-area" element={<CircleArea />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;