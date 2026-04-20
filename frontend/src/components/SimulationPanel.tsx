import { useState } from "react";
import {
  Play, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  DownloadCloud, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkflowStore } from "@/store/workflowStore";
import { simulateWorkflow } from "@/api/workflowApi";
import { cn } from "@/lib/utils";

export default function SimulationPanel() {
  const { nodes, edges, simulationResult, isSimulating, setSimulationResult, setIsSimulating } =
    useWorkflowStore();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setError(null);
    setIsSimulating(true);
    setOpen(true);
    try {
      const result = await simulateWorkflow(nodes, edges);
      setSimulationResult(result.steps);
    } catch {
      setError("Failed to connect to backend. Make sure the server is running.");
      setSimulationResult(null);
    } finally {
      setIsSimulating(false);
    }
  };

  const stepColors: Record<string, string> = {
    start:     "border-emerald-200 bg-emerald-50 text-emerald-800",
    task:      "border-blue-200    bg-blue-50    text-blue-800",
    approval:  "border-amber-200   bg-amber-50   text-amber-800",
    automated: "border-violet-200  bg-violet-50  text-violet-800",
    end:       "border-rose-200    bg-rose-50    text-rose-800",
    summary:   "border-gray-200    bg-gray-50    text-gray-500",
  };

  const exportWorkflow = () => {
    const json = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[600px] max-w-[calc(100vw-520px)]">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulate}
            disabled={isSimulating || nodes.length === 0}
            className="gap-2"
          >
            {isSimulating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            {isSimulating ? "Running..." : "Run Workflow"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportWorkflow}
            disabled={nodes.length === 0}
            className="gap-2 bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300 hover:text-gray-700"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            Export JSON
          </Button>

          {simulationResult && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSimulationResult(null); setError(null); }}
              className="gap-1.5 text-muted-foreground hover:text-foreground ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </Button>
          )}

          {(simulationResult || error) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-auto text-muted-foreground hover:text-foreground"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          )}

          {/* Status badge */}
          {simulationResult && !isSimulating && (
            <Badge variant="success" className="ml-auto shrink-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {simulationResult.length} steps
            </Badge>
          )}
          {error && (
            <Badge variant="destructive" className="ml-auto shrink-0">
              <XCircle className="w-3 h-3 mr-1" />
              Error
            </Badge>
          )}
        </div>

        {/* Log output */}
        {open && (simulationResult || error) && (
          <ScrollArea className="max-h-64">
            <div className="px-4 py-3 space-y-2">
              {error && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-sm text-rose-300">
                  ⚠️ {error}
                </div>
              )}
              {simulationResult?.map((step) => (
                <div
                  key={step.step}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-3 py-2 text-sm",
                    stepColors[step.type ?? "summary"] ?? stepColors["summary"]
                  )}
                >
                  <span className="shrink-0 font-mono text-[10px] font-bold mt-0.5 bg-gray-200 text-gray-700 rounded px-1 py-0.5">
                    {String(step.step).padStart(2, "0")}
                  </span>
                  <span className="leading-snug text-gray-900">{step.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
