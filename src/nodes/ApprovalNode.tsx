const ApprovalNode = ({ data }: any) => {
  return (
    <div style={{ padding: 10, background: "#fff4cc", borderRadius: 5 }}>
      <strong>Approval</strong>
      <div>{data.label}</div>
    </div>
  );
};

export default ApprovalNode;