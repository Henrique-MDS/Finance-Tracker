import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Home,
  Wallet,
  CreditCard,
  ChartColumn,
  Settings,
  LogOut,
} from "lucide-react"
import { useLogout } from "../Login_Register/LogOut";
import PerfilCard from "./PerfilCard";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Transações",
    url: "/transactions",
    icon: Wallet,
  },
  {
    title: "Categorias",
    url: "/categories",
    icon: CreditCard,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: ChartColumn,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
]



export function AppSidebar() {
  const logout = useLogout();
  return (
    <Sidebar>
      <SidebarContent className="bg-[#060F18] text-white">
        <img src="src/assets/logo-tracker.png" alt="finance-tracker-logo" className="h-[150px]"/>
        <SidebarGroup className="flex-1 flex flex-col">
          <SidebarGroupContent className="flex flex-col flex-1">
            <SidebarMenu className="flex flex-col h-full">
              <div className="flex-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span className="text-[17px]">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem className="cursor-pointer" onClick={logout}>
                  <SidebarMenuButton asChild>
                    <a>
                      <LogOut />
                      <span className="text-[17px]">Sair</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
              <div>
                <SidebarMenuItem className="cursor-pointer">
                  <SidebarMenuButton asChild>
                    <a>
                      <PerfilCard />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}