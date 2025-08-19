import React, { useState, useEffect } from 'react';
import './AddTemplateModal.css';

const AddTemplateModal = ({ isOpen, onClose, onTemplateAdded, insertBeforeNodeId = null }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateArgs, setTemplateArgs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:13303/workflow/templates');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTemplates(data || []);
    } catch (err) {
      setError(err.message);
      console.error('テンプレート取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    
    if (template && template.args) {
      const initialArgs = {};
      template.args.forEach(arg => {
        initialArgs[arg.name] = '';
      });
      setTemplateArgs(initialArgs);
    } else {
      setTemplateArgs({});
    }
  };

  const handleArgChange = (argName, value) => {
    setTemplateArgs(prev => ({
      ...prev,
      [argName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      alert('テンプレートを選択してください');
      return;
    }

    const template = templates.find(t => t.id === selectedTemplate);
    if (template && template.args) {
      for (const arg of template.args) {
        if (!templateArgs[arg.name]) {
          alert(`${arg.description}を入力してください`);
          return;
        }
      }
    }

    try {
      setLoading(true);
      const payload = {
        id: selectedTemplate,
        args: templateArgs
      };
      
      // ノードIDが指定されている場合は追加
      if (insertBeforeNodeId) {
        payload.nodeId = insertBeforeNodeId;
      }
      
      const response = await fetch('http://localhost:13303/workflow/append', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('テンプレート追加成功:', result);
      
      if (onTemplateAdded) {
        onTemplateAdded(result);
      }
      
      handleClose();
    } catch (err) {
      setError(err.message);
      console.error('テンプレート追加エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTemplate('');
    setTemplateArgs({});
    setError(null);
    onClose();
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content add-template-modal">
        <div className="modal-header">
          <h2>
            テンプレート追加
            {insertBeforeNodeId && <span className="insert-info">（ノード上に挿入）</span>}
          </h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading">読み込み中...</div>
          ) : error ? (
            <div className="error">
              <p>エラー: {error}</p>
              <button onClick={fetchTemplates} className="retry-button">
                再試行
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="template-select">テンプレート</label>
                <select
                  id="template-select"
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  required
                >
                  <option value="">テンプレートを選択してください</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTemplateData && selectedTemplateData.args && selectedTemplateData.args.length > 0 && (
                <div className="args-section">
                  <h3>引数</h3>
                  {selectedTemplateData.args.map(arg => (
                    <div key={arg.name} className="form-group">
                      <label htmlFor={`arg-${arg.name}`}>
                        {arg.description}
                        {arg.type && <span className="arg-type">({arg.type})</span>}
                      </label>
                      <input
                        id={`arg-${arg.name}`}
                        type="text"
                        value={templateArgs[arg.name] || ''}
                        onChange={(e) => handleArgChange(arg.name, e.target.value)}
                        placeholder={arg.description}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={handleClose} className="cancel-button">
                  キャンセル
                </button>
                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? '追加中...' : '追加'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTemplateModal;