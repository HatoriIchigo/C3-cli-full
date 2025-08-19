import React from 'react';
import './WorkflowDetailPanel.css';

const WorkflowDetailPanel = ({ workflow, isOpen, onClose }) => {
  const handleExecute = () => {
    console.log('ワークフロー実行（未実装）:', workflow?.name);
    // TODO: 実行機能の実装
  };

  if (!isOpen || !workflow) return null;

  return (
    <div className="workflow-detail-overlay">
      <div className="workflow-detail-backdrop" onClick={onClose}></div>
      <div className={`workflow-detail-panel ${isOpen ? 'open' : ''}`}>
        <div className="detail-header">
          <h2>{workflow.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="detail-content">
          <div className="detail-section">
            <h3>基本情報</h3>
            <div className="detail-item">
              <label>名前:</label>
              <span>{workflow.name}</span>
            </div>
            <div className="detail-item">
              <label>ID:</label>
              <span>{workflow.id}</span>
            </div>
            {workflow.description && (
              <div className="detail-item">
                <label>説明:</label>
                <span>{workflow.description}</span>
              </div>
            )}
            {workflow.type && (
              <div className="detail-item">
                <label>タイプ:</label>
                <span>{workflow.type}</span>
              </div>
            )}
            {workflow.language && (
              <div className="detail-item">
                <label>言語:</label>
                <span>{workflow.language}</span>
              </div>
            )}
          </div>

          {workflow.start && (
            <div className="detail-section">
              <h3>フロー情報</h3>
              <div className="detail-item">
                <label>開始ノード:</label>
                <span>{workflow.start}</span>
              </div>
              {workflow.finish && (
                <div className="detail-item">
                  <label>終了ノード:</label>
                  <span>{workflow.finish}</span>
                </div>
              )}
            </div>
          )}

          {workflow.input && workflow.input.length > 0 && (
            <div className="detail-section">
              <h3>入力ファイル</h3>
              <div className="input-list">
                {workflow.input.map((input, index) => (
                  <div key={input.file || index} className="input-item">
                    <div className="input-header">
                      <span className="input-file">{input.file}</span>
                      {input.required === "yes" && (
                        <span className="input-required">必須</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="detail-actions">
          <button className="close-action-button" onClick={onClose}>
            閉じる
          </button>
          <button className="execute-button" onClick={handleExecute}>
            実行
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetailPanel;