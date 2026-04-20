import FlowCanvas from './flow/FlowCanvas';
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <FlowCanvas />
    </div>
  );
}

export default App;