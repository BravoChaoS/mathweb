import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TrianglePerimeter from './pages/TrianglePerimeter';
import CircleArea from './pages/CircleArea';
import TreePlanting from './pages/TreePlanting';
import CompositeArea from './pages/CompositeArea';
import EquationSolver from './pages/EquationSolver';
import WordProblems from './pages/WordProblems';
import DecimalOperations from './pages/DecimalOperations';

// Using HashRouter for GitHub Pages compatibility
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/triangle-perimeter" element={<TrianglePerimeter />} />
          <Route path="/circle-area" element={<CircleArea />} />
          <Route path="/tree-planting" element={<TreePlanting />} />
          <Route path="/composite-area" element={<CompositeArea />} />
          <Route path="/equation-solver" element={<EquationSolver />} />
          <Route path="/word-problems" element={<WordProblems />} />
          <Route path="/decimal-operations" element={<DecimalOperations />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;