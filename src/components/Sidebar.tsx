const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData("nodeType", type);
  };

  return (
    <div style={{ padding: 10, borderRight: "1px solid #ccc" }}>
      <div draggable onDragStart={(e) => onDragStart(e, "task")}>
        Task Node
      </div>

      <div draggable onDragStart={(e) => onDragStart(e, "start")}>
        Start Node
      </div>
    </div>
  );
};

export default Sidebar;