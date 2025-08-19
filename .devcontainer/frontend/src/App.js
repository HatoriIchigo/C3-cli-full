import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import RibbonMenu from './components/RibbonMenu';
import Sidebar from './components/Sidebar';
import WorkflowView from './components/WorkflowView';
import EditorView from './components/EditorView';

function App() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleNewWorkflow = () => {
    setShowCreateModal(true);
  };

  return (
    <Router>
      <div className="app">
        <RibbonMenu onNewWorkflow={handleNewWorkflow} />
        <div className="app-content">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/workflow" replace />} />
              <Route path="/workflow" element={
                <WorkflowView 
                  showCreateModal={showCreateModal} 
                  setShowCreateModal={setShowCreateModal} 
                />
              } />
              <Route path="/editor" element={<EditorView />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;