import { Handle, Position, type NodeProps } from "reactflow";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowNodeData } from "@/store/workflowStore";

export default function EndNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  return (
    <div
      className={cn(
        "relative min-w-[160px] rounded-xl overflow-hidden shadow-lg transition-all duration-200",
        "bg-gradient-to-br from-rose-950/90 to-red-900/80 border",
        selected
          ? "border-rose-400 shadow-rose-500/40 shadow-xl ring-2 ring-rose-400/30"
          : "border-rose-600/50 hover:border-rose-500/70 hover:shadow-rose-500/20"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-rose-400 !border-2 !border-rose-950"
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/20 border-b border-rose-500/20">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/30">
          <Flag className="w-3 h-3 text-rose-300 fill-rose-300" />
        </div>
        <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
          End
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-1">
        <p className="text-sm font-medium text-white truncate">
          {data.endMessage || data.label || "Workflow Complete"}
        </p>
        {data.showSummary && (
          <p className="text-xs text-rose-300/70">📊 Summary enabled</p>
        )}
      </div>

      {/* Target handle only (no source) */}
    </div>
  );
}
