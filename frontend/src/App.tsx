import FlowCanvas from "@/flow/FlowCanvas";
import Sidebar from "@/components/Sidebar";
import NodePanel from "@/components/NodePanel";

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080812] text-foreground font-inter">
      <Sidebar />
      <div className="flex-1 relative flex min-w-0">
        <FlowCanvas />
      </div>
      <NodePanel />
    </div>
  );
}

export default App;