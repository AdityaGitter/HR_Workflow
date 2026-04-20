import React, { useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

const FlowCanvas = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("nodeType");

    const newNode: Node = {
      id: Date.now().toString(),
      position: {
        x: event.clientX,
        y: event.clientY
      },
      data: { label: `${type} node` },
      type: "default"
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // ✅ Update node data
  const updateNode = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: newData } : node
      )
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={(event, node) => setSelectedNode(node)}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Side Panel */}
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
              placeholder="Node Label"
            />
          </>
        )}

      </div>

    </div>
  );
};

export default FlowCanvas;