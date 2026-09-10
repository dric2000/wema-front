"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Bell,
  Filter,
  Search,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAmount } from "@/lib/format";
import type { Customer, CustomersSummary } from "@/lib/types";

type StatusFilter = "" | "debt" | "clear";
type SortKey = "name_asc" | "balance_desc" | "balance_asc" | "date_desc";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTableDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

interface ClientesContentProps {
  summary: CustomersSummary;
  customers: Customer[];
}

function ClientesContent({ summary, customers }: ClientesContentProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [sortKey, setSortKey] = useState<SortKey>("balance_desc");
  const [selected, setSelected] = useState<string[]>([]);

  const averageDebt =
    summary.debtors_count > 0
      ? Math.round(summary.total_outstanding_debt / summary.debtors_count)
      : 0;

  const debtors = customers.filter((customer) => customer.balance > 0);
  const maxBalance = Math.max(...debtors.map((customer) => customer.balance), 1);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const rows = customers.filter((customer) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        customer.name.toLowerCase().includes(normalizedQuery) ||
        customer.aliases.some((alias) =>
          alias.toLowerCase().includes(normalizedQuery)
        );
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "debt" && customer.balance > 0) ||
        (statusFilter === "clear" && customer.balance === 0);

      return matchesQuery && matchesStatus;
    });

    return rows.sort((a, b) => {
      if (sortKey === "name_asc") return a.name.localeCompare(b.name, "fr");
      if (sortKey === "balance_asc") return a.balance - b.balance;
      if (sortKey === "date_desc") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return b.balance - a.balance;
    });
  }, [customers, query, statusFilter, sortKey]);

  function toggleRow(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleAll() {
    if (selected.length === filtered.length && filtered.length > 0) {
      setSelected([]);
      return;
    }
    setSelected(filtered.map((customer) => customer.id));
  }

  const hasFilters = Boolean(query || statusFilter);

  return (
    <div className="flex items-start gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Vos Clientes</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Clientes</span>
              <span className="text-2xl font-semibold text-foreground">
                {summary.total_customers}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Débitrices</span>
              <span className="text-2xl font-semibold text-foreground">
                {summary.debtors_count}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                Créance moyenne
              </span>
              <span className="text-2xl font-semibold text-warning">
                {formatAmount(averageDebt)}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Répartition des créances
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatAmount(summary.total_outstanding_debt)}
                </span>
              </div>
              {debtors.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Aucune créance en cours.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {debtors.map((customer) => (
                    <li key={customer.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate font-medium text-foreground">
                          {customer.name}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          {formatAmount(customer.balance)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(customer.balance / maxBalance) * 100}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-visible">
            <CardContent className="flex flex-col gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une cliente"
                  className="h-10 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) =>
                  setStatusFilter(
                    value === "all" || value == null
                      ? ""
                      : (value as StatusFilter)
                  )
                }
                items={{
                  all: "Tous",
                  debt: "Créance",
                  clear: "À jour",
                }}
                modal={false}
              >
                <SelectTrigger className="h-10 w-full min-w-0">
                  <Filter className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent align="start" side="bottom">
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="debt">Créance</SelectItem>
                  <SelectItem value="clear">À jour</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortKey}
                onValueChange={(value) => {
                  if (value) setSortKey(value as SortKey);
                }}
                items={{
                  balance_desc: "Solde (décroissant)",
                  balance_asc: "Solde (croissant)",
                  name_asc: "Cliente (A-Z)",
                  date_desc: "Date (plus récente)",
                }}
                modal={false}
              >
                <SelectTrigger className="h-10 w-full min-w-0">
                  <ArrowUpDown className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Trier" />
                </SelectTrigger>
                <SelectContent align="start" side="bottom">
                  <SelectItem value="balance_desc">
                    Solde (décroissant)
                  </SelectItem>
                  <SelectItem value="balance_asc">Solde (croissant)</SelectItem>
                  <SelectItem value="name_asc">Cliente (A-Z)</SelectItem>
                  <SelectItem value="date_desc">Date (plus récente)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {query && (
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                {query}
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex size-3.5 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40"
                  aria-label="Effacer la recherche"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                {statusFilter === "debt" ? "Créance" : "À jour"}
                <button
                  type="button"
                  onClick={() => setStatusFilter("")}
                  className="flex size-3.5 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40"
                  aria-label="Effacer le filtre statut"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatusFilter("");
              }}
              className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              <X className="size-3" />
              Tout effacer
            </button>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="w-8 px-3 py-3 text-left">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={
                          selected.length === filtered.length &&
                          filtered.length > 0
                        }
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="px-3 py-3 text-left">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        Date
                        <ArrowUpDown className="size-3 text-muted-foreground" />
                      </span>
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-foreground">
                      Cliente
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-foreground">
                      Alias
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-foreground">
                      Solde (F CFA)
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-foreground">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={selected.includes(customer.id)}
                          onChange={() => toggleRow(customer.id)}
                        />
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {formatTableDate(customer.created_at)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7 shrink-0">
                            <AvatarFallback className="bg-secondary text-xs text-primary">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {customer.aliases.length > 0
                          ? customer.aliases.join(", ")
                          : "—"}
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-foreground">
                        {formatAmount(customer.balance)}
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          variant={
                            customer.balance > 0 ? "warning" : "secondary"
                          }
                        >
                          {customer.balance > 0 ? "Créance" : "À jour"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        Aucune cliente trouvée pour ces critères.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="hidden w-72 shrink-0 flex-col gap-4 xl:flex">
        <div className="flex items-start gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
          <Users className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">En cours :</span>{" "}
            {summary.total_customers} clientes • {summary.debtors_count}{" "}
            débitrices • {formatAmount(summary.total_outstanding_debt)}
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-3 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="size-4 text-primary" />
              Alertes clientes
            </h2>
            {debtors.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Aucune créance à suivre.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {debtors.map((customer) => (
                  <li
                    key={customer.id}
                    className="flex items-start gap-2 rounded-lg border border-border p-2"
                  >
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-xs font-medium text-foreground">
                        Créance en cours
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {customer.name}
                      </span>
                    </div>
                    <Badge variant="warning" className="shrink-0">
                      {formatAmount(customer.balance)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

export { ClientesContent };
