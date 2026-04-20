import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET /automations
app.get("/automations", (_req, res) => {
  res.json([
    {
      id: "send_email",
      label: "Send Email",
      params: ["to", "subject", "body"],
    },
    {
      id: "generate_doc",
      label: "Generate Document",
      params: ["template", "recipient"],
    },
    {
      id: "notify_slack",
      label: "Notify Slack Channel",
      params: ["channel", "message"],
    },
    {
      id: "create_ticket",
      label: "Create JIRA Ticket",
      params: ["project", "summary", "assignee"],
    },
    {
      id: "update_hris",
      label: "Update HRIS Record",
      params: ["employee_id", "field", "value"],
    },
  ]);
});

// POST /simulate
app.post("/simulate", (req, res) => {
  const { nodes = [], edges = [] } = req.body;

  const steps = [];
  let stepNum = 1;

  // Build adjacency map
  const adjacency = {};
  for (const edge of edges) {
    if (!adjacency[edge.source]) adjacency[edge.source] = [];
    adjacency[edge.source].push(edge.target);
  }

  // Find start node
  const startNode = nodes.find((n) => n.type === "start");
  if (!startNode) {
    return res.json({
      steps: [{ step: 1, message: " No Start node found. Please add a Start node." }],
    });
  }

  // BFS traversal
  const visited = new Set();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    const label = node.data?.label || node.data?.title || node.type;

    switch (node.type) {
      case "start":
        steps.push({
          step: stepNum++,
          message: `Workflow started — "${label}"`,
          nodeId: node.id,
          type: "start",
        });
        break;
      case "task": {
        const assignee = node.data?.assignee ? ` → Assigned to: ${node.data.assignee}` : "";
        const due = node.data?.dueDate ? ` (Due: ${node.data.dueDate})` : "";
        steps.push({
          step: stepNum++,
          message: ` Task executed — "${label}"${assignee}${due}`,
          nodeId: node.id,
          type: "task",
        });
        break;
      }
      case "approval": {
        const role = node.data?.approverRole ? ` — Approver: ${node.data.approverRole}` : "";
        const threshold = node.data?.autoApproveThreshold
          ? ` (Auto-approve after ${node.data.autoApproveThreshold}h)`
          : "";
        steps.push({
          step: stepNum++,
          message: ` Approval requested — "${label}"${role}${threshold}`,
          nodeId: node.id,
          type: "approval",
        });
        break;
      }
      case "automated": {
        const action = node.data?.action
          ? ` — Action: ${node.data.action}`
          : "";
        steps.push({
          step: stepNum++,
          message: ` Automated step executed — "${label}"${action}`,
          nodeId: node.id,
          type: "automated",
        });
        break;
      }
      case "end":
        steps.push({
          step: stepNum++,
          message: `🏁 Workflow ended — "${node.data?.endMessage || label}"`,
          nodeId: node.id,
          type: "end",
        });
        break;
      default:
        steps.push({
          step: stepNum++,
          message: `Node "${label}" executed`,
          nodeId: node.id,
          type: node.type,
        });
    }

    // Queue connected next nodes
    const nextIds = adjacency[currentId] || [];
    for (const nextId of nextIds) {
      if (!visited.has(nextId)) queue.push(nextId);
    }
  }

  if (steps.length === 0) {
    steps.push({ step: 1, message: "No nodes to simulate." });
  } else {
    steps.push({
      step: stepNum,
      message: `Simulation complete — ${steps.length} step(s) executed.`,
      type: "summary",
    });
  }

  res.json({ steps });
});

app.listen(PORT, () => {
  console.log(` HR Workflow backend running at http://localhost:${PORT}`);
});
