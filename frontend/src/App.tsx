import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Navbar/AppSideBar";
import { AuthProvider } from "./Utils/AuthContext";

function App() {
  
  return (
    <AuthProvider>
      <div className="flex">
        <SidebarProvider>
          <Toaster />
          <AppSidebar />
          <SidebarInset className="bg-[#060F18]">
            <header className="flex h-16 items-center border-b px-6">
              <SidebarTrigger />
            </header>
            <main className="p-7">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div> 
    </AuthProvider>
  );
}

export default App;