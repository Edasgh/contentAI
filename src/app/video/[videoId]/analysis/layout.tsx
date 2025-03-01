"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider suppressHydrationWarning>
      <AppSidebar />
      <main className="flex-1 bg-white dark:bg-gray-800 flex flex-col min-w-0">
        <SidebarTrigger suppressHydrationWarning />
        <main className="flex-1 px-5 overflow-y-auto">{children}</main>
      </main>
    </SidebarProvider>
  );
}
