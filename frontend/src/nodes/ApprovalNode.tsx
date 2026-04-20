import { Handle, Position, type NodeProps } from "reactflow";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowNodeData } from "@/store/workflowStore";

export default function ApprovalNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  return (
    <div
      className={cn(
        "relative min-w-[180px] rounded-xl overflow-hidden shadow-lg transition-all duration-200",
        "bg-gradient-to-br from-amber-950/90 to-yellow-900/80 border",
        selected
          ? "border-amber-400 shadow-amber-500/40 shadow-xl ring-2 ring-amber-400/30"
          : "border-amber-600/50 hover:border-amber-500/70 hover:shadow-amber-500/20"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-amber-950"
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/20 border-b border-amber-500/20">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/30">
          <ShieldCheck className="w-3 h-3 text-amber-300" />
        </div>
        <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
          Approval
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-1">
        <p className="text-sm font-medium text-white truncate">
          {data.title || data.label || "Approval Step"}
        </p>
        {data.approverRole && (
          <p className="text-xs text-amber-300/70 truncate">
            🛡️ {data.approverRole}
          </p>
        )}
        {data.autoApproveThreshold && (
          <p className="text-xs text-amber-300/60">
            ⏱ Auto after {data.autoApproveThreshold}h
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-amber-950"
      />
    </div>
  );
}