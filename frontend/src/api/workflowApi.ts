import axios from "axios";
import type { Node, Edge } from "reactflow";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  step: number;
  message: string;
  nodeId?: string;
  type?: string;
}

export interface SimulationResult {
  steps: SimulationStep[];
}

export const fetchAutomations = async (): Promise<AutomationAction[]> => {
  const res = await api.get<AutomationAction[]>("/automations");
  return res.data;
};

export const simulateWorkflow = async (
  nodes: Node[],
  edges: Edge[]
): Promise<SimulationResult> => {
  const res = await api.post<SimulationResult>("/simulate", { nodes, edges });
  return res.data;
};
