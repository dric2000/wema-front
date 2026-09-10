import { Toaster } from "react-hot-toast";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardOverview } from "@/lib/api";

export default async function DashboardLayout(props: LayoutProps<"/dashboard">) {
  const overview = await getDashboardOverview();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardTopbar merchantName={overview?.merchant.name} />
        <main className="flex flex-1 flex-col bg-muted/40 p-4 sm:p-6">
          {props.children}
        </main>
      </SidebarInset>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: {
              primary: "var(--primary)",
              secondary: "var(--primary-foreground)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--destructive)",
              secondary: "var(--destructive-foreground)",
            },
          },
        }}
      />
    </SidebarProvider>
  );
}
