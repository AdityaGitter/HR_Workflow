import React, { useEffect } from "react";
import {
  Play, ClipboardList, ShieldCheck, Zap, Flag,
  Trash2, Plus, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useWorkflowStore, type WorkflowNodeData } from "@/store/workflowStore";
import { useAutomations } from "@/hooks/useAutomations";

const nodeTypeConfig: Record<string, {
  label: string; color: string; icon: React.ReactNode; badge: string;
  badgeVariant: "success" | "info" | "warning" | "purple" | "destructive";
}> = {
  start:    { label: "Start Node",     color: "text-emerald-400", icon: <Play className="w-3.5 h-3.5 fill-current" />,     badge: "start",     badgeVariant: "success" },
  task:     { label: "Task Node",      color: "text-blue-400",    icon: <ClipboardList className="w-3.5 h-3.5" />,         badge: "task",      badgeVariant: "info" },
  approval: { label: "Approval Node",  color: "text-amber-400",   icon: <ShieldCheck className="w-3.5 h-3.5" />,           badge: "approval",  badgeVariant: "warning" },
  automated:{ label: "Automated Step", color: "text-violet-400",  icon: <Zap className="w-3.5 h-3.5 fill-current" />,      badge: "automated", badgeVariant: "purple" },
  end:      { label: "End Node",       color: "text-rose-400",    icon: <Flag className="w-3.5 h-3.5 fill-current" />,     badge: "end",       badgeVariant: "destructive" },
};

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-white/5 my-1" />;
}

export default function NodePanel() {
  const { nodes, selectedNodeId, updateNodeData, deleteNode, setSelectedNodeId } = useWorkflowStore();
  const { automations } = useAutomations();

  const node = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const update = (partial: Partial<WorkflowNodeData>) => {
    if (!node) return;
    updateNodeData(node.id, partial);
  };

  // Keep local panel in sync when selection changes
  useEffect(() => {}, [selectedNodeId]);

  if (!node) {
    return (
      <aside className="w-72 flex flex-col h-full bg-white border-l border-gray-200">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-700">Properties</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">No node selected</p>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Click any node on the canvas to view and edit its properties
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const cfg = nodeTypeConfig[node.type ?? ""] ?? nodeTypeConfig["task"];

  return (
    <aside className="w-72 flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{cfg.icon}</span>
          <span className="text-sm font-semibold text-gray-700">{cfg.label}</span>
          <Badge variant={cfg.badgeVariant} className="text-[9px] bg-gray-100 text-gray-500 border border-gray-200">{cfg.badge}</Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-gray-700"
          onClick={() => setSelectedNodeId(null)}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-4 space-y-4">

          {/* ── START NODE ── */}
          {node.type === "start" && (
            <>
              <FieldGroup label="Title">
                <Input
                  value={typeof node.data.title === "string" && node.data.title.trim() === "Start Workflow" ? "" : (node.data.title ?? "")}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="e.g. Employee Onboarding"
                />
              </FieldGroup>

              <Divider />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Metadata</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] text-violet-400 hover:text-violet-300 px-2"
                    onClick={() =>
                      update({
                        metadata: [
                          ...(node.data.metadata ?? []),
                          { key: "", value: "" },
                        ],
                      })
                    }
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add field
                  </Button>
                </div>
                {(node.data.metadata ?? []).map((m, i) => (
                  <div key={i} className="flex gap-1.5 items-center">
                    <Input
                      value={m.key}
                      onChange={(e) => {
                        const arr = [...(node.data.metadata ?? [])];
                        arr[i] = { ...arr[i], key: e.target.value };
                        update({ metadata: arr });
                      }}
                      placeholder="Key"
                      className="flex-1 text-xs h-8"
                    />
                    <Input
                      value={m.value}
                      onChange={(e) => {
                        const arr = [...(node.data.metadata ?? [])];
                        arr[i] = { ...arr[i], value: e.target.value };
                        update({ metadata: arr });
                      }}
                      placeholder="Value"
                      className="flex-1 text-xs h-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-rose-400"
                      onClick={() => {
                        const arr = (node.data.metadata ?? []).filter(
                          (_, idx) => idx !== i
                        );
                        update({ metadata: arr });
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {(node.data.metadata ?? []).length === 0 && (
                  <p className="text-[10px] text-muted-foreground/40 pl-0.5">
                    No metadata fields yet
                  </p>
                )}
              </div>
            </>
          )}

          {/* ── TASK NODE ── */}
          {node.type === "task" && (
            <>
              <FieldGroup label="Title">
                <Input
                  value={typeof node.data.title === "string" && node.data.title.trim() === "New Task" ? "" : (node.data.title ?? "")}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="e.g. Complete Paperwork"
                />
              </FieldGroup>
              <FieldGroup label="Description">
                <textarea
                  value={node.data.description ?? ""}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Task description..."
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 resize-none"
                />
              </FieldGroup>
              <FieldGroup label="Assignee">
                <Input
                  value={node.data.assignee ?? ""}
                  onChange={(e) => update({ assignee: e.target.value })}
                  placeholder="e.g. HR Manager"
                />
              </FieldGroup>
              <FieldGroup label="Due Date">
                <Input
                  type="date"
                  value={node.data.dueDate ?? ""}
                  onChange={(e) => update({ dueDate: e.target.value })}
                  className="text-xs"
                />
              </FieldGroup>
            </>
          )}

          {/* ── APPROVAL NODE ── */}
          {node.type === "approval" && (
            <>
              <FieldGroup label="Title">
                <Input
                  value={typeof node.data.title === "string" && node.data.title.trim() === "Approval Step" ? "" : (node.data.title ?? "")}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="e.g. Manager Approval"
                />
              </FieldGroup>
              <FieldGroup label="Approver Role">
                <Input
                  value={node.data.approverRole ?? ""}
                  onChange={(e) => update({ approverRole: e.target.value })}
                  placeholder="e.g. Department Head"
                />
              </FieldGroup>
              <FieldGroup label="Auto-approve Threshold (hours)">
                <Input
                  type="number"
                  min={0}
                  value={node.data.autoApproveThreshold ?? ""}
                  onChange={(e) => update({ autoApproveThreshold: e.target.value })}
                  placeholder="e.g. 48"
                />
              </FieldGroup>
            </>
          )}

          {/* ── AUTOMATED STEP NODE ── */}
          {node.type === "automated" && (
            <>
              <FieldGroup label="Title">
                <Input
                  value={typeof node.data.title === "string" && node.data.title.trim() === "Automated Step" ? "" : (node.data.title ?? "")}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="e.g. Send Welcome Email"
                />
              </FieldGroup>
              <FieldGroup label="Action">
                <Select
                  value={node.data.action ?? ""}
                  onValueChange={(val) =>
                    update({ action: val, actionParams: {} })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action..." />
                  </SelectTrigger>
                  <SelectContent>
                    {automations.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              {/* Dynamic params based on selected action */}
              {node.data.action && (() => {
                const automation = automations.find((a) => a.id === node.data.action);
                if (!automation) return null;
                return (
                  <div className="space-y-3">
                    <Divider />
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      Parameters
                    </p>
                    {automation.params.map((param) => (
                      <FieldGroup key={param} label={param.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}>
                        <Input
                          value={node.data.actionParams?.[param] ?? ""}
                          onChange={(e) =>
                            update({
                              actionParams: {
                                ...(node.data.actionParams ?? {}),
                                [param]: e.target.value,
                              },
                            })
                          }
                          placeholder={`Enter ${param}...`}
                        />
                      </FieldGroup>
                    ))}
                  </div>
                );
              })()}
            </>
          )}

          {/* ── END NODE ── */}
          {node.type === "end" && (
            <>
              <FieldGroup label="End Message">
                <Input
                  value={node.data.endMessage ?? ""}
                  onChange={(e) => update({ endMessage: e.target.value })}
                  placeholder="e.g. Onboarding complete!"
                />
              </FieldGroup>
              <div className="flex items-center justify-between py-1">
                <div>
                  <Label className="text-xs text-muted-foreground block mb-0.5">
                    Show Summary
                  </Label>
                  <p className="text-[10px] text-muted-foreground/50">
                    Display execution summary at end
                  </p>
                </div>
                <Switch
                  checked={node.data.showSummary ?? false}
                  onCheckedChange={(val) => update({ showSummary: val })}
                />
              </div>
            </>
          )}

          <Divider />

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => deleteNode(node.id)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete Node
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
}