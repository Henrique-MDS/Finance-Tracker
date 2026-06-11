import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";

function App() {
  
  return (
    <div className="flex">
      <Navbar />
      <div className="p-7 flex-1">
        <Outlet />
      </div>
    </div> 
  );
}

export default App;