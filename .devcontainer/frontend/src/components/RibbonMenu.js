import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RibbonMenu.css';

const RibbonMenu = ({ onNewWorkflow }) => {
  const navigate = useNavigate();

  const handleNewWorkflow = () => {
    navigate('/workflow');
    onNewWorkflow();
  };
  return (
    <div className="ribbon-menu">
      <div className="ribbon-content">
        <div className="ribbon-group">
          <button className="ribbon-button" onClick={handleNewWorkflow}>
            <div className="button-icon">📄</div>
            <div className="button-text">新規ワークフロー</div>
          </button>
        </div>
        <div className="ribbon-group">
          <button className="ribbon-button">
            <div className="button-icon">📁</div>
            <div className="button-text">開く</div>
          </button>
          <button className="ribbon-button">
            <div className="button-icon">💾</div>
            <div className="button-text">保存</div>
          </button>
        </div>
        <div className="ribbon-group">
          <button className="ribbon-button">
            <div className="button-icon">↶</div>
            <div className="button-text">元に戻す</div>
          </button>
          <button className="ribbon-button">
            <div className="button-icon">↷</div>
            <div className="button-text">やり直し</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RibbonMenu;