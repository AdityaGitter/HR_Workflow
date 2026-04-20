import React, { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflowStore } from "@/store/workflowStore";
import StartNode from "@/nodes/StartNode";
import TaskNode from "@/nodes/TaskNode";
import ApprovalNode from "@/nodes/ApprovalNode";
import AutomatedStepNode from "@/nodes/AutomatedStepNode";
import EndNode from "@/nodes/EndNode";
import SimulationPanel from "@/components/SimulationPanel";

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};

const defaultNodeData: Record<string, object> = {
  start:     { title: "Start Workflow", metadata: [] },
  task:      { title: "New Task", description: "", assignee: "", dueDate: "" },
  approval:  { title: "Approval Step", approverRole: "", autoApproveThreshold: "" },
  automated: { title: "Automated Step", action: "", actionParams: {} },
  end:       { endMessage: "Workflow Complete", showSummary: false },
};

export default function FlowCanvas() {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    addNode, setSelectedNodeId, nodes: allNodes,
  } = useWorkflowStore();

  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("nodeType");
      if (!type || !flowInstanceRef.current || !reactFlowWrapper.current) return;

      // Validate: only one Start node
      if (type === "start" && allNodes.some((n) => n.type === "start")) {
        alert("Only one Start node is allowed per workflow.");
        return;
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = flowInstanceRef.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode({
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { ...(defaultNodeData[type] ?? { label: `${type} node` }) },
      });
    },
    [addNode, allNodes]
  );

  const minimapNodeColor = (node: { type?: string }) => {
    const colors: Record<string, string> = {
      start: "#10b981",
      task: "#3b82f6",
      approval: "#f59e0b",
      automated: "#7c3aed",
      end: "#f43f5e",
    };
    return colors[node.type ?? ""] ?? "#6b7280";
  };



  return (
    <div className="relative flex-1 h-full bg-[#080812]" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_e, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        onInit={(instance) => { flowInstanceRef.current = instance; }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        deleteKeyCode="Backspace"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#7c3aed", strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
        className="!bg-[#080812]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#ffffff0d"
        />
        <Controls
          className="!bg-[#0f0f1a] !border !border-white/10 !rounded-xl !shadow-xl overflow-hidden [&>button]:!bg-transparent [&>button]:!border-white/5 [&>button]:!text-muted-foreground [&>button:hover]:!bg-white/5 [&>button:hover]:!text-foreground"
        />
        <MiniMap
          nodeColor={minimapNodeColor}
          className="!bg-[#0f0f1a] !border !border-white/10 !rounded-xl"
          maskColor="rgba(0,0,0,0.6)"
        />

        {/* Empty state hint */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <div className="text-center space-y-3 opacity-30">
              <div className="text-5xl">⬡</div>
              <p className="text-base font-medium text-foreground">
                Drag nodes from the sidebar
              </p>
              <p className="text-sm text-muted-foreground">
                Connect them to build your workflow
              </p>
            </div>
          </div>
        )}
      </ReactFlow>

      {/* Floating simulation panel */}
      <SimulationPanel />
    </div>
  );
}