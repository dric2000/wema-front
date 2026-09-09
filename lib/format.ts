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
  return `${amountFormatter.format(amount)} F CFA`;
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
