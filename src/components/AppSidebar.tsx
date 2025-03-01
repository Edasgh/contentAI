import {
  ChevronDown,
  ChevronUpIcon,
  CreditCard,
  HomeIcon,
  Terminal,
  TerminalSquareIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Manage Plan",
    url: "/manage_plan",
    icon: CreditCard,
  },
];

const historyItems = [
  {
    title: "2-Year Gap to Securing a Dubai-Based Remote Job",
    url: "/",
  },
  {
    title: "Manage Plan",
    url: "/manage_plan",
  },
];

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <Sidebar className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      className="text-gray-700 dark:text-gray-50"
                      href={item.url}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarGroupLabel>Recent Searches</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setOpen(!open)}
                    className="text-gray-700 dark:text-gray-50 cursor-pointer flex justify-between"
                    suppressHydrationWarning
                  >
                    <span className="w-full flex gap-2">
                      {" "}
                      <TerminalSquareIcon suppressHydrationWarning />
                      Recent Searches
                    </span>

                    {open ? (
                      <ChevronDown suppressHydrationWarning />
                    ) : (
                      <ChevronUpIcon suppressHydrationWarning />
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {open && (
                <>
                  {historyItems.map((item) => (
                    <SidebarMenuItem
                      className="ml-3.5 border-r p-0.5 dark:bg-gray-900 dark:border-blue-300 dark:hover:bg-gray-700"
                      key={item.title}
                    >
                      <SidebarMenuButton
                        className="hover:bg-inherit break-words h-fit"
                        asChild
                      >
                        <a
                          className="text-gray-700 dark:text-gray-50 break-words"
                          href={item.url}
                          style={{
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          <span className="block whitespace-normal">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
