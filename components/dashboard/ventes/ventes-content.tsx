"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowUpDown,
  BarChart2,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Filter,
  Mic,
  Play,
  Search,
  TrendingUp,
  TriangleAlert,
  User,
  X,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatAmount } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Chart data per period                                                 */
/* ------------------------------------------------------------------ */

const chartDataByPeriod: Record<string, { day: string; ventes: number }[]> = {
  "7j": [
    { day: "Lun", ventes: 75000 },
    { day: "Mar", ventes: 100000 },
    { day: "Mer", ventes: 75000 },
    { day: "Jeu", ventes: 75000 },
    { day: "Ven", ventes: 80000 },
    { day: "Sam", ventes: 120000 },
    { day: "Dim", ventes: 250000 },
  ],
  "14j": [
    { day: "J1",  ventes: 80000  },
    { day: "J2",  ventes: 95000  },
    { day: "J3",  ventes: 70000  },
    { day: "J4",  ventes: 110000 },
    { day: "J5",  ventes: 85000  },
    { day: "J6",  ventes: 130000 },
    { day: "J7",  ventes: 200000 },
    { day: "J8",  ventes: 75000  },
    { day: "J9",  ventes: 100000 },
    { day: "J10", ventes: 75000  },
    { day: "J11", ventes: 75000  },
    { day: "J12", ventes: 80000  },
    { day: "J13", ventes: 120000 },
    { day: "J14", ventes: 250000 },
  ],
  "30j": [
    { day: "S1", ventes: 520000 },
    { day: "S2", ventes: 680000 },
    { day: "S3", ventes: 450000 },
    { day: "S4", ventes: 800000 },
  ],
  "3m": [
    { day: "Juil", ventes: 1800000 },
    { day: "Aou",  ventes: 2400000 },
    { day: "Sep",  ventes: 1950000 },
  ],
  "6m": [
    { day: "Avr",  ventes: 1500000 },
    { day: "Mai",  ventes: 1800000 },
    { day: "Juin", ventes: 2100000 },
    { day: "Juil", ventes: 1800000 },
    { day: "Aou",  ventes: 2400000 },
    { day: "Sep",  ventes: 1950000 },
  ],
};

const periodOptions = [
  { value: "7j",  label: "7 jours"  },
  { value: "14j", label: "14 jours" },
  { value: "30j", label: "30 jours" },
  { value: "3m",  label: "3 mois"   },
  { value: "6m",  label: "6 mois"   },
];

const chartConfig = {
  ventes: { label: "Ventes", color: "var(--color-primary)" },
} satisfies ChartConfig;

/* ------------------------------------------------------------------ */
/* Sales data                                                            */
/* ------------------------------------------------------------------ */

type SaleStatus = "CONFIRMED" | "PENDING";

interface Sale {
  id: string;
  date: string;
  heure: string;
  cliente: string;
  articles: string;
  montant: number;
  statut: SaleStatus;
  dateObj: Date;
}

const salesData: Sale[] = [
  {
    id: "1",
    date: "09/03/2026",
    heure: "10:42",
    cliente: "Maman Chantal",
    articles: "Huile (3 Bidons), Riz (1 Sac)",
    montant: 6000,
    statut: "CONFIRMED",
    dateObj: new Date("2026-03-09"),
  },
  {
    id: "2",
    date: "07/03/2026",
    heure: "12:37",
    cliente: "Afi",
    articles: "Huile (3 Bidons), Riz (1 Sac)",
    montant: 12500,
    statut: "PENDING",
    dateObj: new Date("2026-03-07"),
  },
  {
    id: "3",
    date: "07/03/2026",
    heure: "08:21",
    cliente: "Reambours",
    articles: "Huile (3 Bidons), Riz (1 Sac)",
    montant: 12500,
    statut: "CONFIRMED",
    dateObj: new Date("2026-03-07"),
  },
  {
    id: "4",
    date: "07/03/2026",
    heure: "16:42",
    cliente: "Maman Chantal",
    articles: "Huile (2 Bidons), Riz (1 Sac)",
    montant: 75500,
    statut: "PENDING",
    dateObj: new Date("2026-03-07"),
  },
  {
    id: "5",
    date: "07/03/2026",
    heure: "16:45",
    cliente: "Vente de huile",
    articles: "Huile (3 Bidons), Riz (1 Sac)",
    montant: 5000,
    statut: "CONFIRMED",
    dateObj: new Date("2026-03-07"),
  },
  {
    id: "6",
    date: "07/03/2026",
    heure: "11:43",
    cliente: "Maman Chantal",
    articles: "Huile (1 Bidon), Riz (1 Sac)",
    montant: 4500,
    statut: "CONFIRMED",
    dateObj: new Date("2026-03-07"),
  },
];

const salesAlerts = [
  { id: "1", label: "Paiement en retard",  sub: "(Afi)",                         statut: "PENDING"   as SaleStatus, severity: "danger"  as const },
  { id: "2", label: "Stock faible d'huile", sub: "(pour commande Maman Chantal)", statut: "PENDING"   as SaleStatus, severity: "warning" as const },
  { id: "3", label: "Stock faible d'huile", sub: "Cartons",                       statut: "PENDING"   as SaleStatus, severity: "danger"  as const },
  { id: "4", label: "Stock faible d'huile", sub: "(pour commande Maman Chantal)", statut: "CONFIRMED" as SaleStatus, severity: "warning" as const },
];

/* ------------------------------------------------------------------ */
/* Filter / sort option lists                                            */
/* ------------------------------------------------------------------ */

const dateOptions = [
  { value: "today",  label: "Aujourd'hui"         },
  { value: "week",   label: "Cette semaine"        },
  { value: "month",  label: "Ce mois"              },
  { value: "3month", label: "Les 3 derniers mois"  },
  { value: "year",   label: "Cette annee"          },
];

const clienteOptions = [...new Set(salesData.map((s) => s.cliente))].map(
  (c) => ({ value: c, label: c })
);

const statutOptions = [
  { value: "CONFIRMED", label: "Confirmee"  },
  { value: "PENDING",   label: "En attente" },
];

const sortOptions = [
  { value: "date_desc",   label: "Date (plus recente)"   },
  { value: "date_asc",    label: "Date (plus ancienne)"  },
  { value: "amount_desc", label: "Montant (decroissant)" },
  { value: "amount_asc",  label: "Montant (croissant)"   },
  { value: "cliente_asc", label: "Cliente (A-Z)"         },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                               */
/* ------------------------------------------------------------------ */

const amountFmt = new Intl.NumberFormat("fr-FR");
function formatTableAmount(n: number) {
  return amountFmt.format(n) + " F";
}
function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ------------------------------------------------------------------ */
/* DropdownFilter — reusable dropdown with click-outside               */
/* ------------------------------------------------------------------ */

interface DropOption { value: string; label: string; }

function DropdownFilter({
  icon: Icon,
  label,
  options,
  value,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  options: DropOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:bg-muted"
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span
          className={
            "flex-1 text-left " +
            (selected ? "text-foreground font-medium" : "text-muted-foreground")
          }
        >
          {selected ? selected.label : label}
        </span>
        <ChevronDown
          className={
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200 " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {/* "Tous" clears the filter */}
          <button
            className={
              "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted " +
              (!value ? "text-primary font-semibold" : "text-muted-foreground")
            }
            onClick={() => { onChange(""); setOpen(false); }}
          >
            Tous
            {!value && <Check className="size-3.5 text-primary" />}
          </button>
          <div className="mx-2 h-px bg-border" />
          {options.map((opt) => (
            <button
              key={opt.value}
              className={
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted " +
                (value === opt.value
                  ? "bg-secondary/40 text-primary font-semibold"
                  : "text-foreground")
              }
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
              {value === opt.value && <Check className="size-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PeriodSelector — dropdown for chart period                           */
/* ------------------------------------------------------------------ */

function PeriodSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const selected = periodOptions.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
      >
        {selected?.label ?? "7 jours"}
        <ChevronDown
          className={
            "size-3 transition-transform duration-200 " + (open ? "rotate-180" : "")
          }
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {periodOptions.map((opt) => (
            <button
              key={opt.value}
              className={
                "flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-muted " +
                (value === opt.value
                  ? "bg-secondary/40 text-primary font-semibold"
                  : "text-foreground")
              }
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
              {value === opt.value && <Check className="size-3 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Waveform                                                              */
/* ------------------------------------------------------------------ */

function Waveform() {
  const bars = [2, 4, 8, 5, 10, 7, 12, 8, 6, 10, 14, 9, 6, 8, 5, 7, 4, 3];
  return (
    <div className="flex flex-1 items-center gap-px">
      {bars.map((h, i) => (
        <span
          key={i}
          className="inline-block w-1 rounded-full bg-primary/60"
          style={{ height: h * 2 + "px" }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                        */
/* ------------------------------------------------------------------ */

export function VentesContent() {
  // Filters
  const [search,        setSearch]        = useState("");
  const [dateFilter,    setDateFilter]    = useState("");
  const [clienteFilter, setClienteFilter] = useState("");
  const [statutFilter,  setStatutFilter]  = useState("");
  const [sortFilter,    setSortFilter]    = useState("date_desc");

  // Chart period
  const [period, setPeriod] = useState("7j");

  // Row selection
  const [selected, setSelected] = useState<string[]>([]);

  // Reference date (today in mock data)
  const TODAY = new Date("2026-03-09");

  // ── Filtering + sorting ────────────────────────────────────────────
  const filtered = salesData
    .filter((s) => {
      const q = search.toLowerCase();
      if (
        q &&
        !s.cliente.toLowerCase().includes(q) &&
        !s.articles.toLowerCase().includes(q)
      )
        return false;

      if (dateFilter === "today") {
        if (s.dateObj.toDateString() !== TODAY.toDateString()) return false;
      } else if (dateFilter === "week") {
        const diff = (TODAY.getTime() - s.dateObj.getTime()) / 86400000;
        if (diff > 7) return false;
      } else if (dateFilter === "month") {
        if (s.dateObj.getMonth() !== TODAY.getMonth()) return false;
      } else if (dateFilter === "3month") {
        const diff = (TODAY.getTime() - s.dateObj.getTime()) / 86400000;
        if (diff > 90) return false;
      }

      if (clienteFilter && s.cliente !== clienteFilter) return false;
      if (statutFilter  && s.statut  !== statutFilter)  return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortFilter) {
        case "date_asc":    return a.dateObj.getTime() - b.dateObj.getTime();
        case "date_desc":   return b.dateObj.getTime() - a.dateObj.getTime();
        case "amount_asc":  return a.montant - b.montant;
        case "amount_desc": return b.montant - a.montant;
        case "cliente_asc": return a.cliente.localeCompare(b.cliente);
        default:            return 0;
      }
    });

  function toggleRow(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function toggleAll() {
    setSelected((prev) =>
      prev.length === filtered.length ? [] : filtered.map((s) => s.id)
    );
  }

  const chartData = chartDataByPeriod[period] ?? chartDataByPeriod["7j"];
  const hasActiveFilters = !!(dateFilter || clienteFilter || statutFilter);

  return (
    <div className="flex min-h-0 flex-1 gap-5">
      {/* ── Main content ───────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <h1 className="text-xl font-bold text-foreground">
          Votre Page de Ventes
        </h1>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col gap-1 py-4">
              <span className="text-sm font-medium text-muted-foreground">
                Ventes du mois
              </span>
              <span className="text-2xl font-bold text-foreground">
                {formatAmount(3450000)}
              </span>
              <span className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="size-3.5" />
                +22% par rapport au mois dernier
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 py-4">
              <span className="text-sm font-medium text-muted-foreground">
                Nombre de commandes
              </span>
              <span className="text-2xl font-bold text-foreground">45</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 py-4">
              <span className="text-sm font-medium text-muted-foreground">
                Panier moyen
              </span>
              <span className="text-2xl font-bold text-warning">
                {formatAmount(76667)}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Chart + Filters row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Chart */}
          <Card>
            <CardContent className="py-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BarChart2 className="size-4 text-primary" />
                  Evolution des ventes
                </h2>
                <PeriodSelector value={period} onChange={setPeriod} />
              </div>

              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <AreaChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="ventesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v: number) => {
                      if (v === 0) return "0";
                      if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
                      return Math.round(v / 1000) + "k";
                    }}
                    width={40}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          typeof value === "number"
                            ? formatAmount(value)
                            : String(value)
                        }
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="ventes"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#ventesGradient)"
                    dot={{ r: 3, fill: "var(--color-primary)" }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-col gap-2.5">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une vente"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <DropdownFilter
              icon={Calendar}
              label="Filtrer par date"
              options={dateOptions}
              value={dateFilter}
              onChange={setDateFilter}
            />
            <DropdownFilter
              icon={User}
              label="Filtrer par cliente"
              options={clienteOptions}
              value={clienteFilter}
              onChange={setClienteFilter}
            />
            <DropdownFilter
              icon={Filter}
              label="Filtrer par statut"
              options={statutOptions}
              value={statutFilter}
              onChange={setStatutFilter}
            />
            <DropdownFilter
              icon={ArrowUpDown}
              label="Trier par"
              options={sortOptions}
              value={sortFilter}
              onChange={setSortFilter}
            />
          </div>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {dateFilter && (
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                {dateOptions.find((o) => o.value === dateFilter)?.label}
                <button
                  onClick={() => setDateFilter("")}
                  className="flex size-3.5 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40"
                  aria-label="Supprimer filtre date"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {clienteFilter && (
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                {clienteFilter}
                <button
                  onClick={() => setClienteFilter("")}
                  className="flex size-3.5 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40"
                  aria-label="Supprimer filtre cliente"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {statutFilter && (
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                {statutOptions.find((o) => o.value === statutFilter)?.label}
                <button
                  onClick={() => setStatutFilter("")}
                  className="flex size-3.5 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40"
                  aria-label="Supprimer filtre statut"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            <button
              onClick={() => { setDateFilter(""); setClienteFilter(""); setStatutFilter(""); }}
              className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              <X className="size-3" />
              Tout effacer
            </button>
          </div>
        )}

        {/* Sales table */}
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
                      <button className="flex items-center gap-1 font-semibold text-foreground">
                        Date
                        <ArrowUpDown className="size-3 text-muted-foreground" />
                      </button>
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-foreground">
                      Heure
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-foreground">
                      Cliente
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-foreground">
                      Articles
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-foreground">
                      Montant Total (F CFA)
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-foreground">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sale) => (
                    <tr
                      key={sale.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={selected.includes(sale.id)}
                          onChange={() => toggleRow(sale.id)}
                        />
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {sale.date}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {sale.heure}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7 shrink-0">
                            <AvatarFallback className="bg-secondary text-xs text-primary">
                              {getInitials(sale.cliente)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {sale.cliente}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {sale.articles}
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-foreground">
                        {formatTableAmount(sale.montant)}
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          variant={
                            sale.statut === "CONFIRMED" ? "secondary" : "warning"
                          }
                        >
                          {sale.statut === "CONFIRMED"
                            ? "Confirmee"
                            : "En attente"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        Aucune vente trouvee pour ces criteres.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Right panel ─────────────────────────────────────────── */}
      <aside className="hidden w-72 shrink-0 flex-col gap-4 xl:flex">
        {/* Voice card */}
        <Card>
          <CardContent className="flex flex-col gap-3 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Mic className="size-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Saisie Vocale de Vente
                </span>
              </div>
              <span className="text-xs text-muted-foreground">1 10:42</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2">
              <button className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-opacity hover:opacity-90">
                <Play className="size-4 fill-current" />
              </button>
              <Waveform />
              <span className="shrink-0 text-xs text-muted-foreground">
                0:18
              </span>
            </div>

            <p className="text-xs italic text-muted-foreground">
              J&apos;ai vendu cinq bidons d&apos;huile a Maman Chantal. Elle a
              paye en especes, six mille Francs.
            </p>

            <button className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-secondary">
              <span className="flex items-center gap-2">
                <Mic className="size-3.5" />
                Enregistrer la vente vocale
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Today stats */}
        <div className="flex items-start gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
          <BarChart2 className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              Aujourd&apos;hui&nbsp;:
            </span>
            &nbsp;24 ventes&nbsp;&bull;&nbsp;3 remboursements&nbsp;&bull;&nbsp;2
            reapprovisionnements
          </p>
        </div>

        {/* Alerts */}
        <Card>
          <CardContent className="flex flex-col gap-3 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="size-4 text-primary" />
              Alertes de Ventes
            </h2>
            <ul className="flex flex-col gap-2">
              {salesAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start gap-2 rounded-lg border border-border p-2"
                >
                  {alert.severity === "danger" ? (
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  ) : (
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-xs font-medium text-foreground">
                      {alert.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {alert.sub}
                    </span>
                  </div>
                  <Badge
                    variant={
                      alert.statut === "CONFIRMED" ? "secondary" : "warning"
                    }
                    className="shrink-0"
                  >
                    {alert.statut === "CONFIRMED" ? "Confirmee" : "En attente"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
