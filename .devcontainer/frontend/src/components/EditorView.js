import React from 'react';
import './EditorView.css';

const EditorView = () => {
  return (
    <div className="editor-view">
      <div className="construction-container">
        <div className="construction-icon">🚧</div>
        <h2>エディタ機能</h2>
        <p>現在開発中です</p>
        <div className="construction-details">
          <p>こちらの機能は現在準備中です。</p>
          <p>しばらくお待ちください。</p>
        </div>
      </div>
    </div>
  );
};

export default EditorView;