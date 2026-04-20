import { Handle, Position, type NodeProps } from "reactflow";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowNodeData } from "@/store/workflowStore";

export default function AutomatedStepNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  return (
    <div
      className={cn(
        "relative min-w-[180px] rounded-xl overflow-hidden shadow-lg transition-all duration-200",
        "bg-gradient-to-br from-violet-950/90 to-purple-900/80 border",
        selected
          ? "border-violet-400 shadow-violet-500/40 shadow-xl ring-2 ring-violet-400/30"
          : "border-violet-600/50 hover:border-violet-500/70 hover:shadow-violet-500/20"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-violet-400 !border-2 !border-violet-950"
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-violet-500/20 border-b border-violet-500/20">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/30">
          <Zap className="w-3 h-3 text-violet-300 fill-violet-300" />
        </div>
        <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
          Automated
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-1">
        <p className="text-sm font-medium text-white truncate">
          {data.title || data.label || "Automated Step"}
        </p>
        {data.action && (
          <p className="text-xs text-violet-300/70 truncate">
            ⚡ {data.action}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-violet-400 !border-2 !border-violet-950"
      />
    </div>
  );
}
