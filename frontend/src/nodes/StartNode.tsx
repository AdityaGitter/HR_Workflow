import { Handle, Position, type NodeProps } from "reactflow";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowNodeData } from "@/store/workflowStore";

export default function StartNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  return (
    <div
      className={cn(
        "relative min-w-[160px] rounded-xl overflow-hidden shadow-lg transition-all duration-200",
        "bg-gradient-to-br from-emerald-950/90 to-green-900/80 border",
        selected
          ? "border-emerald-400 shadow-emerald-500/40 shadow-xl ring-2 ring-emerald-400/30"
          : "border-emerald-600/50 hover:border-emerald-500/70 hover:shadow-emerald-500/20"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 border-b border-emerald-500/20">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/30">
          <Play className="w-3 h-3 text-emerald-300 fill-emerald-300" />
        </div>
        <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
          Start
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-white truncate">
          {data.title || data.label || "Start Workflow"}
        </p>
        {data.metadata && data.metadata.length > 0 && (
          <p className="text-xs text-emerald-400/70 mt-0.5">
            {data.metadata.length} metadata field{data.metadata.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Source handle only (no target) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-emerald-900"
      />
    </div>
  );
}