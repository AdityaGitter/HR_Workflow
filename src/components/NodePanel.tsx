import type { Node } from "reactflow";

const NodePanel = ({ node, updateNode }: any) => {
  if (!node) {
    return (
      <div style={{ padding: 10, width: 250 }}>
        Select a node
      </div>
    );
  }

  return (
    <div style={{ padding: 10, width: 250, borderLeft: "1px solid #ccc" }}>
      <h3>Edit Node</h3>

      <input
        value={node.data.label || ""}
        onChange={(e) =>
          updateNode(node.id, {
            ...node.data,
            label: e.target.value
          })
        }
        placeholder="Node Label"
      />
    </div>
  );
};

export default NodePanel;