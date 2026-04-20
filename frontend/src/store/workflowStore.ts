import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "reactflow";

export interface WorkflowNodeData {
  // Common
  label?: string;
  title?: string;

  // Start
  metadata?: Array<{ key: string; value: string }>;

  // Task
  description?: string;
  assignee?: string;
  dueDate?: string;

  // Approval
  approverRole?: string;
  autoApproveThreshold?: string;

  // Automated
  action?: string;
  actionParams?: Record<string, string>;

  // End
  endMessage?: string;
  showSummary?: boolean;
}

export interface SimulationStep {
  step: number;
  message: string;
  nodeId?: string;
  type?: string;
}

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  simulationResult: SimulationStep[] | null;
  isSimulating: boolean;

  // Actions
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<WorkflowNodeData>) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSimulationResult: (result: SimulationStep[] | null) => void;
  setIsSimulating: (val: boolean) => void;
  clearWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: "#7c3aed", strokeWidth: 2 },
        },
        state.edges
      ),
    })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter(
        (e) => e.source !== id && e.target !== id
      ),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSimulating: (val) => set({ isSimulating: val }),
  clearWorkflow: () =>
    set({ nodes: [], edges: [], selectedNodeId: null, simulationResult: null }),
}));
