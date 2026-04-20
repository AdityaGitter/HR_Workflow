const StartNode = ({ data }: any) => {
  return (
    <div style={{ padding: 10, background: "#d4f8d4", borderRadius: 5 }}>
      <strong>Start</strong>
      <div>{data.label}</div>
    </div>
  );
};

export default StartNode;