import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isWorkflow = location.pathname === '/' || location.pathname === '/workflow';
  const isEditor = location.pathname === '/editor';

  const handleViewChange = (view) => {
    if (view === 'workflow') {
      navigate('/workflow');
    } else if (view === 'editor') {
      navigate('/editor');
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <div 
          className={`nav-item ${isWorkflow ? 'active' : ''}`}
          onClick={() => handleViewChange('workflow')}
          title="ワークフロー"
        >
          <span className="nav-text">ワークフロー</span>
        </div>
        <div 
          className={`nav-item ${isEditor ? 'active' : ''}`}
          onClick={() => handleViewChange('editor')}
          title="エディタ"
        >
          <span className="nav-text">エディタ</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;