import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './ReteEditor.css';

// typeに応じたCSSクラス名を取得
const getNodeTypeClass = (type) => {
  switch (type) {
    case 'start': return 'workflow-node--start';
    case 'end': return 'workflow-node--end';
    case 'error': return 'workflow-node--error';
    case 'bash': return 'workflow-node--bash';
    case 'claude': return 'workflow-node--claude';
    default: return 'workflow-node--default';
  }
};

// カスタムノードコンポーネント
const CustomNode = ({ data, id, selected }) => {
  console.log(data);
  const isStartOrEnd = data.type === 'start' || data.type === 'finish' || data.type === 'error';
  const hasActionButton = !isStartOrEnd;
  
  const handleExecuteNode = async (e) => {
    e.stopPropagation();
    
    // workflow_idの生成（workflow.id#command.id）
    const workflowId = `${data.workflowId}#${id}`;
    
    console.log('ノード実行開始:', data.label, workflowId);
    
    // 実行状態を「実行中」に更新
    if (data.onStatusUpdate) {
      data.onStatusUpdate(id, 'running');
    }
    
    try {
      const response = await fetch('http://localhost:13303/action/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: workflowId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const result = await response.json();
      console.log('ノード実行成功:', result);
      
      // 実行状態を「成功」に更新し、結果を保存
      if (data.onStatusUpdate) {
        data.onStatusUpdate(id, 'success', result);
      }
      
    } catch (err) {
      console.error('ノード実行エラー:', err);
      
      // 実行状態を「失敗」に更新
      if (data.onStatusUpdate) {
        data.onStatusUpdate(id, 'error', { error: err.message });
      }
    }
  };
  
  const nodeClasses = [
    'workflow-node',
    'workflow-node--rectangular',
    isStartOrEnd ? getNodeTypeClass(data.type) : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={nodeClasses}>
      {/* 通常の入力ハンドル（上部） */}
      {data.type !== 'start' && (
        <Handle
          type="target"
          position={Position.Top}
          id="normal-in"
          className="workflow-handle workflow-handle--normal"
        />
      )}
      
      {/* エラー用入力ハンドル（異常終了ノードは上部、その他は右側） */}
      {data.type !== 'start' && (
        <Handle
          type="target"
          position={data.type === 'error' ? Position.Top : Position.Right}
          id="error-in"
          className="workflow-handle workflow-handle--error"
          style={{
            top: data.type === 'error' ? undefined : '70%',
            left: data.type === 'error' ? '70%' : undefined
          }}
        />
      )}
      
      {/* アイコンとラベル */}
      <div className={`workflow-node__content ${isStartOrEnd ? 'workflow-node__content--circular' : 'workflow-node__content--rectangular'}`}>
        <div className="workflow-node__label-container">
          <div className={`workflow-node__label ${isStartOrEnd ? 'workflow-node__label--circular' : 'workflow-node__label--rectangular'}`}>
            {data.label}
          </div>
          <div className="workflow-node__description">
            {data.description}
          </div>
        </div>
      </div>
      
      {/* 実行状態ライン */}
      {data.executionStatus && data.executionStatus !== 'pending' && (
        <div className={`workflow-node__status-badge workflow-node__status-badge--${data.executionStatus}`}>
        </div>
      )}

      {/* 下部ボタン群（開始・終了・異常終了以外） */}
      {hasActionButton && (
        <div className="workflow-node__bottom-buttons">
          <button
            onClick={handleExecuteNode}
            className="workflow-node__bottom-button workflow-node__bottom-button--action"
            title="このノードを実行"
            disabled={data.executionStatus === 'running'}
          >
            <span className="workflow-node__button-icon">▶</span>
            <span className="workflow-node__button-text">実行</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (data.onShowCustomInput) {
                data.onShowCustomInput(id);
              }
            }}
            className="workflow-node__bottom-button workflow-node__bottom-button--custom"
            title="カスタム入力で実行"
          >
            <span className="workflow-node__button-text">カスタム</span>
          </button>
        </div>
      )}
      
      {/* 通常の出力ハンドル（下部） */}
      {data.type !== 'end' && data.type !== 'error' && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="normal-out"
          className="workflow-handle workflow-handle--normal"
        />
      )}
      
      {/* エラー用出力ハンドル（右側） */}
      {data.type !== 'end' && data.type !== 'error' && (
        <Handle
          type="source"
          position={Position.Right}
          id="error-out"
          className="workflow-handle workflow-handle--error"
        />
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const ReteEditor = ({ workflowData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeExecutionStatus, setNodeExecutionStatus] = useState({}); // ノードの実行状態
  const [selectedNodeId, setSelectedNodeId] = useState(null); // 選択されたノード
  const [executionResults, setExecutionResults] = useState({}); // 実行結果
  const [showBottomPanel, setShowBottomPanel] = useState(false); // 下部パネル表示状態
  const [showCustomInputOverlay, setShowCustomInputOverlay] = useState(false); // カスタム入力オーバーレイ表示状態
  const [customInputNodeId, setCustomInputNodeId] = useState(null); // カスタム入力対象ノードID
  const [customInputText, setCustomInputText] = useState(''); // カスタム入力テキスト

  // 実行状態更新関数
  const updateNodeExecutionStatus = useCallback((nodeId, status, result = null) => {
    // ローカル状態を更新（command.statusより優先）
    setNodeExecutionStatus(prev => ({
      ...prev,
      [nodeId]: status
    }));
    
    if (result) {
      setExecutionResults(prev => ({
        ...prev,
        [nodeId]: result
      }));
    }
    
    // ノードデータを更新
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, executionStatus: status } }
          : node
      )
    );
  }, [setNodes]);

  // ノード選択時の処理
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    
    // ノードが選択されたら常に下部パネルを表示
    setShowBottomPanel(true);
  }, []);

  // 背景クリック時の処理
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setShowBottomPanel(false);
  }, []);

  // カスタム入力オーバーレイを表示
  const showCustomInputOverlayHandler = useCallback((nodeId) => {
    setCustomInputNodeId(nodeId);
    setCustomInputText('');
    setShowCustomInputOverlay(true);
  }, []);

  // カスタム入力オーバーレイを閉じる
  const hideCustomInputOverlay = useCallback(() => {
    setShowCustomInputOverlay(false);
    setCustomInputNodeId(null);
    setCustomInputText('');
  }, []);

  // カスタム入力で実行
  const executeWithCustomInput = useCallback(async () => {
    if (!customInputNodeId || !customInputText.trim()) {
      return;
    }

    const nodeData = nodes.find(n => n.id === customInputNodeId)?.data;
    if (!nodeData) {
      return;
    }

    // workflow_idの生成（workflow.id#command.id）
    const workflowId = `${nodeData.workflowId}#${customInputNodeId}`;
    
    console.log('カスタム入力でノード実行開始:', nodeData.label, workflowId, customInputText);
    
    // 実行状態を「実行中」に更新
    if (nodeData.onStatusUpdate) {
      nodeData.onStatusUpdate(customInputNodeId, 'running');
    }
    
    try {
      const response = await fetch('http://localhost:13303/action/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          custom_input: customInputText
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const result = await response.json();
      console.log('カスタム入力でノード実行成功:', result);
      
      // 実行状態を「成功」に更新し、結果を保存
      if (nodeData.onStatusUpdate) {
        nodeData.onStatusUpdate(customInputNodeId, 'success', result);
      }
      
      // オーバーレイを閉じる
      hideCustomInputOverlay();
      
    } catch (err) {
      console.error('カスタム入力でノード実行エラー:', err);
      
      // 実行状態を「失敗」に更新
      if (nodeData.onStatusUpdate) {
        nodeData.onStatusUpdate(customInputNodeId, 'error', { error: err.message });
      }
    }
  }, [customInputNodeId, customInputText, nodes, hideCustomInputOverlay]);

  useEffect(() => {
    if (workflowData && workflowData.nodes && workflowData.connections) {
      const reactFlowNodes = convertToReactFlowNodes(
        workflowData.nodes, 
        workflowData.workflow?.id,
        updateNodeExecutionStatus,
        nodeExecutionStatus,
        showCustomInputOverlayHandler
      );
      const reactFlowEdges = convertToReactFlowEdges(workflowData.connections);
      
      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
    }
  }, [workflowData, setNodes, setEdges, updateNodeExecutionStatus, nodeExecutionStatus, showCustomInputOverlayHandler]);

  const convertToReactFlowNodes = (nodeData, workflowId, onStatusUpdate, executionStatus, onShowCustomInput) => {
    return nodeData.map((node) => {
      // 実行状態の決定：ローカル状態 > command.status > デフォルト
      const finalStatus = executionStatus[node.id] || node.status || 'pending';
      
      return {
        id: node.id,
        type: 'custom', // カスタムノードタイプを使用
        position: { x: node.position.x, y: node.position.y },
        data: { 
          label: node.name,
          type: node.type,
          description: node.description,
          color: getNodeColor(node.type), // 色をdataに含める
          workflowId: workflowId, // ワークフローIDを追加
          onStatusUpdate: onStatusUpdate, // 状態更新関数
          onShowCustomInput: onShowCustomInput, // カスタム入力オーバーレイ表示関数
          executionStatus: finalStatus, // 最終的な実行状態
          originalStatus: node.status, // 元のcommand.status
        },
      };
    });
  };

  const convertToReactFlowEdges = (connectionData) => {
    return connectionData.map((connection, index) => ({
      id: `edge-${index}`,
      source: connection.from,
      target: connection.to,
      type: 'smoothstep',
      style: { 
        stroke: connection.type === 'error' ? '#ef4444' : '#6b7280',
        strokeWidth: 2,
        strokeDasharray: connection.type === 'error' ? '5,5' : undefined,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: connection.type === 'error' ? '#ef4444' : '#6b7280',
      },
      label: connection.type === 'error' ? 'Error' : '',
      labelStyle: { 
        fill: '#374151',
        fontWeight: 500,
        fontSize: 11,
      },
      labelBgStyle: {
        fill: '#ffffff',
        fillOpacity: 0.9,
        rx: 3,
        stroke: connection.type === 'error' ? '#ef4444' : '#6b7280',
        strokeWidth: 1,
      },
      labelBgPadding: [3, 6],
      sourceHandle: connection.sourceHandle || (connection.type === 'error' ? 'error-out' : 'normal-out'),
      targetHandle: connection.targetHandle || (connection.type === 'error' ? 'error-in' : 'normal-in'),
      pathOptions: {
        offset: connection.type === 'error' ? 20 : 15,
        borderRadius: 10,
      },
      zIndex: connection.type === 'error' ? 10 : 1,
    }));
  };

  // 色は使用しないが、互換性のため残す
  const getNodeColor = (type) => {
    return '#ffffff';
  };

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes} // カスタムノードタイプを追加
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
        attributionPosition="top-right"
        connectionLineType="smoothstep" // 接続時のプレビューラインも滑らか
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { 
            strokeWidth: 2,
            stroke: '#6b7280'
          },
        }}
      >
        <Controls />
        <MiniMap 
          style={{
            height: 120,
          }}
          zoomable
          pannable
        />
        <Background 
          variant="dots" 
          gap={24} 
          size={1.5} 
          color="#e5e7eb"
        />
      </ReactFlow>
      
      {!workflowData && (
        <div className="workflow-placeholder">
          <p>ワークフローを選択してください</p>
        </div>
      )}

      {/* 下部パネル（実行結果表示） */}
      <div className={`workflow-bottom-panel ${showBottomPanel ? '' : 'workflow-bottom-panel--hidden'}`}>
        <div className="workflow-bottom-panel__header">
          <div className="workflow-bottom-panel__title">
            実行結果 {selectedNodeId && `- ${nodes.find(n => n.id === selectedNodeId)?.data.label}`}
          </div>
          <button 
            className="workflow-bottom-panel__close"
            onClick={() => setShowBottomPanel(false)}
          >
            ×
          </button>
        </div>
        <div className="workflow-bottom-panel__content">
          {selectedNodeId && executionResults[selectedNodeId] ? (
            <div className="workflow-bottom-panel__json">
              {(() => {
                let message = executionResults[selectedNodeId].message;
                if (typeof message === 'string') {
                  // 先頭と末尾の「"」を削除
                  message = message.replace(/^"/, '').replace(/"$/, '');
                  // \n を実際の改行に変換
                  message = message.replace(/\\n/g, '\n');
                  return message;
                } else {
                  return JSON.stringify(message, null, 2);
                }
              })()}
            </div>
          ) : (
            <div>実行結果がありません</div>
          )}
        </div>
      </div>

      {/* カスタム入力オーバーレイ */}
      {showCustomInputOverlay && (
        <div className="workflow-custom-input-overlay">
          <div className="workflow-custom-input-modal">
            <div className="workflow-custom-input-header">
              <h3>カスタム入力</h3>
            </div>
            <div className="workflow-custom-input-content">
              <textarea
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="実行時に使用するカスタム入力を入力してください..."
                className="workflow-custom-input-textarea"
                rows={6}
                autoFocus
              />
            </div>
            <div className="workflow-custom-input-buttons">
              <button
                onClick={hideCustomInputOverlay}
                className="workflow-custom-input-button workflow-custom-input-button--cancel"
              >
                キャンセル
              </button>
              <button
                onClick={executeWithCustomInput}
                className="workflow-custom-input-button workflow-custom-input-button--execute"
                disabled={!customInputText.trim()}
              >
                実行
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReteEditor;