import React from "react";

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, type: string) => {
  event.dataTransfer.setData("nodeType", type);
  event.dataTransfer.effectAllowed = "move";
};

  return (
    <div
      style={{
        width: 200,
        padding: 10,
        borderRight: "1px solid #ccc",
        background: "#f9f9f9"
      }}
    >
      <h3>Nodes</h3>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, "start")}
        style={{
          padding: 10,
          marginBottom: 10,
          background: "#d4f8d4",
          cursor: "grab",
          borderRadius: 5
        }}
      >
        Start Node
      </div>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, "task")}
        style={{
          padding: 10,
          marginBottom: 10,
          background: "#d4e4ff",
          cursor: "grab",
          borderRadius: 5
        }}
      >
        Task Node
      </div>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, "approval")}
        style={{
          padding: 10,
          marginBottom: 10,
          background: "#fff4cc",
          cursor: "grab",
          borderRadius: 5
        }}
      >
        Approval Node
      </div>
    </div>
  );
};

export default Sidebar;