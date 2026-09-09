import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  HandCoins,
  ShoppingCart,
  TriangleAlert,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardOverview } from "@/lib/api";
import {
  formatAmount,
  transactionStatusBadgeVariant,
  transactionStatusLabels,
  transactionTypeIcons,
  transactionTypeLabels,
} from "@/lib/format";
import type { DashboardAlert } from "@/lib/types";

const alertRouteByType: Record<string, string> = {
  PENDING_TRANSACTIONS: "/dashboard/transactions",
  STOCK_ALERT: "/dashboard/stock",
};

function alertHref(alert: DashboardAlert) {
  return alertRouteByType[alert.type] ?? "/dashboard";
}

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  if (!overview) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <TriangleAlert className="size-6 text-destructive" />
          <p className="font-medium text-foreground">
            Impossible de charger les données du tableau de bord
          </p>
          <p className="text-sm text-muted-foreground">
            Vérifiez que le backend est bien accessible, puis réessayez.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { kpis, alerts, recent_activity } = overview;

  const kpiCards = [
    {
      label: "Chiffre d'affaires du jour",
      value: formatAmount(kpis.daily_sales),
      icon: ShoppingCart,
      accent: "bg-secondary text-primary",
    },
    {
      label: "Montant encaissé",
      value: formatAmount(kpis.daily_collected),
      icon: Wallet,
      accent: "bg-secondary text-primary",
    },
    {
      label: "Créances en cours",
      value: formatAmount(kpis.total_debts),
      icon: HandCoins,
      accent: "bg-warning/15 text-warning",
    },
    {
      label: "En attente de validation",
      value: String(kpis.pending_validations),
      icon: Clock,
      accent: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex flex-col gap-3">
              <span
                className={`flex size-10 items-center justify-center rounded-full ${kpi.accent}`}
              >
                <kpi.icon className="size-5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-muted-foreground">
                  {kpi.label}
                </span>
                <span className="text-xl font-semibold text-foreground">
                  {kpi.value}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <Link
              key={alert.type}
              href={alertHref(alert)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                alert.severity === "danger"
                  ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15"
                  : "border-warning/30 bg-warning/10 text-warning hover:bg-warning/15"
              }`}
            >
              <AlertTriangle className="size-5 shrink-0" />
              <span className="flex-1 text-foreground">{alert.message}</span>
              <span className="shrink-0 text-xs font-medium underline underline-offset-2">
                Voir
              </span>
            </Link>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col gap-1">
          <h2 className="mb-2 text-base font-semibold text-foreground">
            Flux d&apos;activité récente
          </h2>
          {recent_activity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune activité pour le moment.
            </p>
          ) : (
            <ul className="flex flex-col">
              {recent_activity.map((activity) => {
                const TypeIcon = transactionTypeIcons[activity.type];
                return (
                  <li
                    key={activity.id}
                    className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <TypeIcon className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {transactionTypeLabels[activity.type]}
                        {activity.customer ? ` - ${activity.customer.name}` : ""}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {activity.items_summary}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {activity.formatted_time}
                    </span>
                    <span className="w-24 shrink-0 text-right text-sm font-medium text-foreground">
                      {formatAmount(activity.total_amount)}
                    </span>
                    <Badge
                      variant={transactionStatusBadgeVariant[activity.status]}
                      className="shrink-0"
                    >
                      {transactionStatusLabels[activity.status]}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
