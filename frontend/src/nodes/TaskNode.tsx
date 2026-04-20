import { Handle, Position, type NodeProps } from "reactflow";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowNodeData } from "@/store/workflowStore";

export default function TaskNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  return (
    <div
      className={cn(
        "relative min-w-[180px] rounded-xl overflow-hidden shadow-lg transition-all duration-200",
        "bg-gradient-to-br from-blue-950/90 to-indigo-900/80 border",
        selected
          ? "border-blue-400 shadow-blue-500/40 shadow-xl ring-2 ring-blue-400/30"
          : "border-blue-600/50 hover:border-blue-500/70 hover:shadow-blue-500/20"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-blue-950"
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border-b border-blue-500/20">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/30">
          <ClipboardList className="w-3 h-3 text-blue-300" />
        </div>
        <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
          Task
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-1">
        <p className="text-sm font-medium text-white truncate">
          {data.title || data.label || "Untitled Task"}
        </p>
        {data.assignee && (
          <p className="text-xs text-blue-300/70 truncate">
            👤 {data.assignee}
          </p>
        )}
        {data.dueDate && (
          <p className="text-xs text-blue-300/60 truncate">
            📅 {data.dueDate}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-blue-950"
      />
    </div>
  );
}