"use client";

import { Calendar, ChevronDown, CircleDot } from "lucide-react";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { dashboardNavItems } from "@/lib/dashboard-nav";

const today = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date("2026-09-06"));

interface DashboardTopbarProps {
  merchantName?: string;
}

function DashboardTopbar({ merchantName }: DashboardTopbarProps) {
  const pathname = usePathname();
  const activeItem =
    dashboardNavItems.find((item) =>
      item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href)
    ) ?? dashboardNavItems[0];
  const firstName = merchantName?.split(" (")[0];

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 sm:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
          {activeItem.title === "Tableau de bord"
            ? firstName
              ? `Bonjour, ${firstName} 👋`
              : "Bonjour 👋"
            : activeItem.title}
        </h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {activeItem.subtitle}
        </p>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground md:flex">
        <Calendar className="size-3.5" />
        <span className="capitalize">{today}</span>
      </div>

      <div className="hidden items-center gap-1.5 text-xs text-primary sm:flex">
        <CircleDot className="size-3.5 fill-primary text-primary" />
        Synchronisé
      </div>

      <button className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 hover:bg-muted">
        <Avatar className="size-7">
          <AvatarFallback className="bg-secondary text-xs text-primary">
            W
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>
    </header>
  );
}

export { DashboardTopbar };
