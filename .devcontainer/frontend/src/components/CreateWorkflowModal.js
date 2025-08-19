import React, { useState } from 'react';
import './CreateWorkflowModal.css';

const CreateWorkflowModal = ({ isOpen, onClose, onRefreshWorkflows }) => {
  const [workflowType, setWorkflowType] = useState('');
  const [language, setLanguage] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const workflowTypes = [
    { value: 'new', label: '新規プロジェクト(new)' },
    { value: 'rev', label: 'ドキュメント逆生成(rev)' },
    { value: 'fix', label: '改修(fix)' },
    { value: 'manual', label: 'マニュアル(manual)' }
  ];

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' }
  ];

  const handleCreate = async () => {
    if (!workflowType || !language) {
      alert('ワークフロータイプと言語を選択してください。');
      return;
    }

    try {
      setIsCreating(true);
      const response = await fetch('http://localhost:13303/workflow/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_type: workflowType,
          lang: language
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('ワークフロー作成成功:', result);
      
      // モーダルを閉じて、ワークフローリストを更新
      handleClose();
      if (onRefreshWorkflows) {
        onRefreshWorkflows();
      }
    } catch (error) {
      console.error('ワークフロー作成エラー:', error);
      alert('ワークフローの作成に失敗しました。');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setWorkflowType('');
    setLanguage('');
    setIsCreating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>新規ワークフロー作成</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="workflow-type">ワークフロータイプ</label>
            <select 
              id="workflow-type"
              value={workflowType}
              onChange={(e) => setWorkflowType(e.target.value)}
              className="form-select"
            >
              <option value="">選択してください</option>
              {workflowTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="language">言語</label>
            <select 
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-select"
            >
              <option value="">選択してください</option>
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="button button-secondary" 
            onClick={handleClose}
            disabled={isCreating}
          >
            キャンセル
          </button>
          <button 
            className="button button-primary" 
            onClick={handleCreate}
            disabled={isCreating || !workflowType || !language}
          >
            {isCreating ? '作成中...' : '作成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkflowModal;