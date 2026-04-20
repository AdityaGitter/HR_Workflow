const TaskNode = ({ data }: any) => {
  return (
    <div style={{ padding: 10, background: "#d4e4ff", borderRadius: 5 }}>
      <strong>Task</strong>
      <div>{data.label}</div>
    </div>
  );
};

export default TaskNode;