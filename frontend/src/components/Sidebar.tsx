import React from "react";
import { Play, ClipboardList, ShieldCheck, Zap, Flag, Workflow } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NodeTypeConfig {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  badgeVariant: "success" | "info" | "warning" | "purple" | "destructive";
}

const nodeTypes: NodeTypeConfig[] = [
  {
    type: "start",
    label: "Start Node",
    description: "Entry point of the workflow",
    icon: <Play className="w-4 h-4 fill-current" />,
    color: "text-emerald-400",
    borderColor: "border-emerald-600/40 hover:border-emerald-400/60 hover:bg-emerald-500/5",
    badgeVariant: "success",
  },
  {
    type: "task",
    label: "Task Node",
    description: "Assignable task with due date",
    icon: <ClipboardList className="w-4 h-4" />,
    color: "text-blue-400",
    borderColor: "border-blue-600/40 hover:border-blue-400/60 hover:bg-blue-500/5",
    badgeVariant: "info",
  },
  {
    type: "approval",
    label: "Approval Node",
    description: "Requires role-based sign-off",
    icon: <ShieldCheck className="w-4 h-4" />,
    color: "text-amber-400",
    borderColor: "border-amber-600/40 hover:border-amber-400/60 hover:bg-amber-500/5",
    badgeVariant: "warning",
  },
  {
    type: "automated",
    label: "Automated Step",
    description: "Triggers a background action",
    icon: <Zap className="w-4 h-4 fill-current" />,
    color: "text-violet-400",
    borderColor: "border-violet-600/40 hover:border-violet-400/60 hover:bg-violet-500/5",
    badgeVariant: "purple",
  },
  {
    type: "end",
    label: "End Node",
    description: "Terminal point of the workflow",
    icon: <Flag className="w-4 h-4 fill-current" />,
    color: "text-rose-400",
    borderColor: "border-rose-600/40 hover:border-rose-400/60 hover:bg-rose-500/5",
    badgeVariant: "destructive",
  },
];

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData("nodeType", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-60 flex flex-col h-full bg-white border-r border-gray-200">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 border border-gray-200">
          <Workflow className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-700 leading-tight">HR Workflow</h1>
          <p className="text-[10px] text-gray-400 leading-tight">Designer</p>
        </div>
      </div>

      {/* Nodes Section */}
      <div className="px-3 py-3 flex-1 min-h-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
          Drag to Canvas
        </p>
        <ScrollArea className="h-full">
          <div className="space-y-2 pr-1 pb-4">
            {nodeTypes.map((nt) => (
              <Card
                key={nt.type}
                draggable
                onDragStart={(e) => onDragStart(e, nt.type)}
                className={`cursor-grab active:cursor-grabbing transition-all duration-200 border bg-white ${nt.borderColor.replace(/border-[^ ]+/g, 'border-gray-200')} rounded-lg shadow-sm select-none`}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 text-gray-400`}>
                      {nt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {nt.label}
                        </span>
                        <Badge variant={nt.badgeVariant} className="text-[9px] px-1.5 py-0 shrink-0 bg-gray-100 text-gray-500 border border-gray-200">
                          {nt.type}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        {nt.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 text-center leading-tight">
          Click a node on canvas to configure it
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;