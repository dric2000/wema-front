"use client";

import { Headphones, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboardNavItems } from "@/lib/dashboard-nav";

function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 group-data-[collapsible=icon]:justify-center"
        >
          <Sparkles className="size-4 shrink-0 -translate-y-1.5 text-warning" />
          <span className="text-xl font-bold tracking-tight text-primary group-data-[collapsible=icon]:hidden">
            Wemá
          </span>
        </Link>
        <p className="mt-0.5 pl-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Le cahier qui écoute
        </p>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {dashboardNavItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      size="lg"
                      className="rounded-lg px-3 text-sm [&_svg]:size-5"
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
          <Headphones className="size-4 text-primary" />
          <p className="text-xs font-medium text-foreground">
            Besoin d&apos;aide ?
          </p>
          <p className="text-xs text-muted-foreground">
            Écrivez ou envoyez un vocal sur Wemá.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar };
