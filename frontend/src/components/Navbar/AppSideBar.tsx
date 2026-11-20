import { useLanguage } from "@/i18n/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo from "@/assets/logo-tracker.png";
import {
  Home,
  Wallet,
  CreditCard,
  ChartColumn,
  Settings,
  LogOut,
  Goal,
  RotateCcw,
} from "lucide-react"
import PerfilCard from "./PerfilCard";
import { ThemeToggle } from "./ThemeToggle";
import { logout } from "@/Utils/logOutUser";

import type { TranslationKey } from "@/i18n/translations";

const items: { title: TranslationKey; url: string; icon: typeof Home }[] = [
  {
    title: "nav.dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "nav.transactions",
    url: "/transactions",
    icon: Wallet,
  },
  {
    title: "nav.categories",
    url: "/categories",
    icon: CreditCard,
  },
  {
    title: "nav.recurrent",
    url: "/Recurrent",
    icon: RotateCcw,
  },
  {
    title: "nav.reports",
    url: "/reports",
    icon: ChartColumn,
  },
  {
    title: "nav.goals",
    url: "/Goals",
    icon: Goal,
  },
  {
    title: "nav.settings",
    url: "/settings",
    icon: Settings,
  },
]



export function AppSidebar() {
  const { t } = useLanguage();
  return (
    <Sidebar>
      <SidebarContent className="bg-app-background text-foreground">
        <img src={logo} alt="finance-tracker-logo" className="h-[150px] w-auto self-center object-contain"/>
        <SidebarGroup className="flex-1 flex flex-col">
          <SidebarGroupContent className="flex flex-col flex-1">
            <SidebarMenu className="flex flex-col h-full">
              <div className="flex-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span className="text-[17px]">{t(item.title)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem className="cursor-pointer" onClick={() => logout()}>
                  <SidebarMenuButton asChild>
                    <a>
                      <LogOut />
                      <span className="text-[17px]">{t("nav.logout")}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
              <div>
                <SidebarMenuItem>
                  <ThemeToggle />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <PerfilCard />
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}