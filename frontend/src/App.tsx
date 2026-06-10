import { Outlet } from "react-router-dom";

function App() {
  
  return (
    <div>
      <div className="p-7">
        <Outlet />
      </div>
    </div> 
  );
}

export default App;