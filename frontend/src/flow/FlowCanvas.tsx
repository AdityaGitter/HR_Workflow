import React, { useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

import StartNode from "../nodes/StartNode";
import TaskNode from "../nodes/TaskNode";
import ApprovalNode from "../nodes/ApprovalNode";

const FlowCanvas = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("nodeType");

    if (!type) return;

    const bounds = (event.target as HTMLElement).getBoundingClientRect();

    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    };

    const newNode: Node = {
      id: Date.now().toString(),
      position,
      data: { label: `${type} node` },
      type: type
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const nodeTypes = {
    start: StartNode,
    task: TaskNode,
    approval: ApprovalNode
  };

  const updateNode = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: newData } : node
      )
    );
  };

  return (
  <div style={{ display: "flex", height: "100%", width: "100%" }}>
    
    <div style={{ flex: 1, height: "100%" }}>
      <div
        style={{ width: "100%", height: "100%" }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(event, node) => setSelectedNode(node)}
          fitView
          style={{ width: "100%", height: "100%" }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>

    <div style={{ width: 250, borderLeft: "1px solid #ccc", padding: 10 }}>
      {!selectedNode ? (
        <p>Select a node</p>
      ) : (
        <>
          <h3>Edit Node</h3>
          <input
            value={selectedNode.data.label || ""}
            onChange={(e) =>
              updateNode(selectedNode.id, {
                ...selectedNode.data,
                label: e.target.value
              })
            }
          />
        </>
      )}
    </div>

  </div>
);
};

export default FlowCanvas;