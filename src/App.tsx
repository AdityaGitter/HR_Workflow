import FlowCanvas from './flow/FlowCanvas';
import Sidebar from "./components/Sidebar";

function App() {
  return(
    <>
      <div style = {{display : "flex"}}>
        <Sidebar/>
        <FlowCanvas/>
      </div>
    </>
  )
}

export default App;