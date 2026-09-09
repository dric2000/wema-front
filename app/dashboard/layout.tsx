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
    </SidebarProvider>
  );
}
