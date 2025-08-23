import React, { useState, useEffect } from 'react';
import './WorkflowView.css';
import ReteEditor from './ReteEditor';
import CreateWorkflowModal from './CreateWorkflowModal';
import AddTemplateModal from './AddTemplateModal';
import WorkflowDetailPanel from './WorkflowDetailPanel';

const WorkflowView = ({ showCreateModal, setShowCreateModal }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredWorkflow, setHoveredWorkflow] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [insertBeforeNodeId, setInsertBeforeNodeId] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [detailWorkflow, setDetailWorkflow] = useState(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:13303/workflow');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWorkflows(data.workflow || []);
    } catch (err) {
      setError(err.message);
      console.error('ワークフロー取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (workflow, event) => {
    setHoveredWorkflow(workflow);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (hoveredWorkflow) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredWorkflow(null);
  };

  const handlePlayWorkflow = (workflow, event) => {
    event.stopPropagation(); // 親要素のクリックイベントを防ぐ
    console.log('ワークフロー実行:', workflow.name);
    // ここに実行ロジックを追加
  };

  const handleNodeClicked = (workflow, event) => {
    event.stopPropagation();
    console.log('node clicked: ', workflow);
    
    if (workflow && workflow.command) {
      const nodeData = generateReteNodes(workflow);
      setSelectedWorkflow(nodeData);
    }
  };

  const handleContextMenu = (workflow, event) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      workflow: workflow,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleMoveUp = (workflow) => {
    console.log('上へ移動:', workflow.name);
    const currentIndex = workflows.findIndex(w => w.id === workflow.id);
    if (currentIndex > 0) {
      const newWorkflows = [...workflows];
      [newWorkflows[currentIndex - 1], newWorkflows[currentIndex]] = 
      [newWorkflows[currentIndex], newWorkflows[currentIndex - 1]];
      setWorkflows(newWorkflows);
    }
    setContextMenu(null);
  };

  const handleMoveDown = (workflow) => {
    console.log('下へ移動:', workflow.name);
    const currentIndex = workflows.findIndex(w => w.id === workflow.id);
    if (currentIndex < workflows.length - 1) {
      const newWorkflows = [...workflows];
      [newWorkflows[currentIndex], newWorkflows[currentIndex + 1]] = 
      [newWorkflows[currentIndex + 1], newWorkflows[currentIndex]];
      setWorkflows(newWorkflows);
    }
    setContextMenu(null);
  };

  const handleDetailWorkflow = (workflow) => {
    console.log('ワークフロー詳細表示:', workflow.name);
    setDetailWorkflow(workflow);
    setShowDetailPanel(true);
    setContextMenu(null);
  };

  const handleDetailPanelClose = () => {
    setShowDetailPanel(false);
    setDetailWorkflow(null);
  };

  const handleAddWorkflow = (workflow) => {
    console.log('ワークフロー追加（ノード上に挿入）:', workflow.name);
    setInsertBeforeNodeId(workflow.id);
    setShowAddTemplateModal(true);
    setContextMenu(null);
  };

  const handleDeleteWorkflow = async (workflow) => {
    console.log('ワークフロー削除:', workflow.name);
    
    if (!confirm(`「${workflow.name}」を削除しますか？`)) {
      setContextMenu(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:13303/workflow/node?_id=${workflow.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const result = await response.json();
      console.log('ワークフロー削除成功:', result);
      
      // ワークフロー一覧を再取得
      fetchWorkflows();
      
    } catch (err) {
      console.error('ワークフロー削除エラー:', err);
      alert(`削除に失敗しました: ${err.message}`);
    } finally {
      setContextMenu(null);
    }
  };

  const handleTemplateAdded = (result) => {
    console.log('テンプレート追加完了:', result);
    // ワークフロー一覧を再取得
    fetchWorkflows();
    // 挿入位置をリセット
    setInsertBeforeNodeId(null);
  };

  const handleAddTemplateModalClose = () => {
    setShowAddTemplateModal(false);
    setInsertBeforeNodeId(null);
  };

  const generateReteNodes = (workflow) => {
    const nodes = [];
    const connections = [];
    const commands = workflow.command || [];
    
    // 異常終了ノードを追加（必要に応じて）
    let hasErrorExit = false;
    commands.forEach(command => {
      if (command.failed && command.failed.match(/__exit_\d+__/)) {
        hasErrorExit = true;
      }
    });
    
    if (hasErrorExit) {
      nodes.push({
        id: 'error_exit',
        name: '異常終了',
        type: 'error',
        position: { x: 500, y: 200 }
      });
    }

    // ワークフローのstart/finishノードを追加
    if (workflow.start) {
      nodes.push({
        id: 'workflow_start',
        name: 'ワークフロー開始',
        type: 'start',
        position: { x: 100, y: 50 }
      });
    }

    if (workflow.finish) {
      nodes.push({
        id: 'workflow_finish', 
        name: 'ワークフロー終了',
        type: 'end',
        position: { x: 100, y: 50 + (commands.length + 1) * 100 }
      });
    }

    // コマンドノードを作成
    let yPosition = 150;
    commands.forEach((command, index) => {
      const nodeId = command.id || `command_${index}`;
      
      nodes.push({
        id: nodeId,
        name: command.name || `Command ${index + 1}`,
        type: command.type || 'process',
        description: command.description,
        command: command.command,
        status: command.status || 'pending', // commandのstatusを追加
        position: { x: 100, y: yPosition }
      });

      yPosition += 200;
    });

    // 接続を作成
    const createConnections = () => {
      // ワークフロー開始からの接続
      if (workflow.start && commands.length > 0) {
        const firstCommand = commands.find(cmd => cmd.id === workflow.start) || commands[0];
        connections.push({
          from: 'workflow_start',
          to: firstCommand.id,
          type: 'normal'
        });
      }

      // コマンド間の接続
      commands.forEach((command) => {
        // 通常の次への遷移（nextフィールド使用）
        if (command.next) {
          connections.push({
            from: command.id,
            to: command.next,
            type: 'normal'
          });
        }

        // 失敗時の接続
        if (command.failed) {
          if (command.failed.match(/__exit_\d+__/)) {
            // 異常終了への接続（右から上へ）
            connections.push({
              from: command.id,
              to: 'error_exit',
              type: 'error',
              sourceHandle: 'error-out',
              targetHandle: 'error-in'
            });
          } else {
            // 他のコマンドへの接続（右から右へ）
            connections.push({
              from: command.id,
              to: command.failed,
              type: 'error',
              sourceHandle: 'error-out',
              targetHandle: 'error-in'
            });
          }
        }
      });

      // ワークフロー終了への接続
      if (workflow.finish) {
        const finishCommand = commands.find(cmd => cmd.id === workflow.finish);
        if (finishCommand) {
          connections.push({
            from: workflow.finish,
            to: 'workflow_finish',
            type: 'normal'
          });
        }
      }
    };

    createConnections();

    return {
      workflow: workflow,
      nodes: nodes,
      connections: connections
    };
  };

  // コンテキストメニューを閉じる
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  return (
    <div className="workflow-view">
      <div className="workflow-sidebar">
        <h3>ワークフロー一覧</h3>
        <div className="workflow-list">
          {loading ? (
            <div className="loading">読み込み中...</div>
          ) : error ? (
            <div className="error">
              <p>エラー: {error}</p>
              <button onClick={fetchWorkflows} className="retry-button">
                再試行
              </button>
            </div>
          ) : (
            <>
              {workflows.length === 0 && (
                <div className="empty">ワークフローがありません</div>
              )}
              
              {workflows.map((workflow, index) => (
                <div
                  key={workflow.id || index}
                  className="workflow-item"
                  onMouseEnter={(e) => handleMouseEnter(workflow, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleNodeClicked(workflow, e)}
                  onContextMenu={(e) => handleContextMenu(workflow, e)}
                >
                  <div className="workflow-content">
                    <button 
                      className="play-button"
                      onClick={(e) => handlePlayWorkflow(workflow, e)}
                      title="ワークフローを実行"
                    >
                    </button>
                    <div className="workflow-name">{workflow.name}</div>
                  </div>
                </div>
              ))}
              
              {/* 新規追加ボタン（常に表示） */}
              <div className="workflow-item add-workflow-item">
                <div className="workflow-content">
                  <button 
                    className="add-button"
                    onClick={() => setShowAddTemplateModal(true)}
                    title="テンプレートを追加"
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="workflow-canvas">
        <div className="canvas-header">
          <h3>フローエディタ</h3>
          <div className="canvas-tools">
            <button className="tool-button">🔍</button>
            <button className="tool-button">⚙️</button>
          </div>
        </div>
        <div className="canvas-content" id="rete-canvas">
          <ReteEditor workflowData={selectedWorkflow} />
        </div>
      </div>
      
      {/* ディスクリプションオーバーレイ */}
      {hoveredWorkflow && hoveredWorkflow.description && (
        <div 
          className="description-overlay"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
          }}
        >
          <div className="overlay-content">
            <h4>{hoveredWorkflow.name}</h4>
            <p>{hoveredWorkflow.description}</p>
          </div>
        </div>
      )}
      
      {/* コンテキストメニュー */}
      {contextMenu && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 1000
          }}
        >
          <div className="context-menu-item" onClick={() => handleDetailWorkflow(contextMenu.workflow)}>
            詳細
          </div>
          <div className="context-menu-separator"></div>
          <div className="context-menu-item" onClick={() => handleAddWorkflow(contextMenu.workflow)}>
            追加
          </div>
          <div className="context-menu-item" onClick={() => handleDeleteWorkflow(contextMenu.workflow)}>
            削除
          </div>
          <div className="context-menu-separator"></div>
          <div className="context-menu-item" onClick={() => handleMoveUp(contextMenu.workflow)}>
            上へ移動
          </div>
          <div className="context-menu-item" onClick={() => handleMoveDown(contextMenu.workflow)}>
            下へ移動
          </div>
        </div>
      )}

      {/* 新規ワークフロー作成モーダル */}
      <CreateWorkflowModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRefreshWorkflows={fetchWorkflows}
      />

      {/* テンプレート追加モーダル */}
      <AddTemplateModal 
        isOpen={showAddTemplateModal}
        onClose={handleAddTemplateModalClose}
        onTemplateAdded={handleTemplateAdded}
        insertBeforeNodeId={insertBeforeNodeId}
      />

      {/* ワークフロー詳細パネル */}
      <WorkflowDetailPanel 
        workflow={detailWorkflow}
        isOpen={showDetailPanel}
        onClose={handleDetailPanelClose}
      />
    </div>
  );
};

export default WorkflowView;