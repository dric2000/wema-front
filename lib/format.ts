import {
  type LucideIcon,
  PackagePlus,
  Receipt,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import type { TransactionStatus, TransactionType } from "@/lib/types";

const amountFormatter = new Intl.NumberFormat("fr-FR");

export function formatAmount(amount: number): string {
  return `${amountFormatter.format(amount).replace(/\s/g, " ")} F CFA`;
}

export function formatTableDate(value: string): string {
  const date = new Date(value);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());
  return `${day}/${month}/${year}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatItemsSummary(
  items: { product: { name: string }; quantity: number }[]
): string {
  return items.map((item) => `${item.product.name} (x${item.quantity})`).join(", ");
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  SALE: "Vente",
  PAYMENT: "Paiement",
  RESTOCK: "Réapprovisionnement",
  EXPENSE: "Dépense",
};

export const transactionTypeIcons: Record<TransactionType, LucideIcon> = {
  SALE: ShoppingCart,
  PAYMENT: Wallet,
  RESTOCK: PackagePlus,
  EXPENSE: Receipt,
};

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  REJECTED: "Rejetée",
};

export const transactionStatusBadgeVariant: Record<
  TransactionStatus,
  "secondary" | "warning" | "outline"
> = {
  PENDING: "warning",
  CONFIRMED: "secondary",
  REJECTED: "outline",
};
