import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import { Toaster } from "react-hot-toast";

function App() {
  
  return (
    <div className="flex">
      <Toaster />
      <Navbar />
      <div className="p-7 flex-1">
        <Outlet />
      </div>
    </div> 
  );
}

export default App;