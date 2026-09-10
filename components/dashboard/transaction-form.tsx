"use client";

import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  createTransaction,
  updateTransaction,
} from "@/app/dashboard/transactions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatAmount,
  transactionStatusLabels,
  transactionTypeLabels,
} from "@/lib/format";
import type {
  Product,
  TransactionDetail,
  TransactionStatus,
  TransactionType,
} from "@/lib/types";

interface FormItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

interface TransactionFormProps {
  products: Product[];
  transaction?: TransactionDetail;
}

const typeOptions = Object.entries(transactionTypeLabels) as [
  TransactionType,
  string,
][];
const statusOptions = Object.entries(transactionStatusLabels) as [
  TransactionStatus,
  string,
][];

function TransactionForm({ products, transaction }: TransactionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "SALE"
  );
  const [status, setStatus] = useState<TransactionStatus>(
    transaction?.status ?? "PENDING"
  );
  const [paidAmount, setPaidAmount] = useState(
    transaction ? String(transaction.paid_amount) : "0"
  );
  const [items, setItems] = useState<FormItem[]>(
    transaction?.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    })) ?? [{ product_id: "", quantity: 1, unit_price: 0 }]
  );

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  function updateItem(index: number, patch: Partial<FormItem>) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function handleProductChange(index: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    updateItem(index, {
      product_id: productId,
      unit_price: product?.unit_price ?? 0,
    });
  }

  function addItem() {
    setItems((current) => [
      ...current,
      { product_id: "", quantity: 1, unit_price: 0 },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (items.some((item) => !item.product_id)) {
      toast.error("Sélectionnez un produit pour chaque article.");
      return;
    }

    const payload = {
      customer_id: transaction?.customer_id ?? null,
      type,
      total_amount: totalAmount,
      paid_amount: Number(paidAmount) || 0,
      items,
    };

    startTransition(async () => {
      const result = transaction
        ? await updateTransaction(transaction.id, { ...payload, status })
        : await createTransaction(payload);

      if (result.success) {
        toast.success(
          transaction ? "Transaction mise à jour" : "Transaction créée"
        );
        router.push(
          result.id
            ? `/dashboard/transactions/${result.id}`
            : "/dashboard/transactions"
        );
      } else {
        toast.error(result.message ?? "Une erreur est survenue");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Type</label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as TransactionType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value: TransactionType) => transactionTypeLabels[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {transaction && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Statut
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TransactionStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: TransactionStatus) => transactionStatusLabels[value]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Cliente
          </label>
          <Input
            disabled
            value={transaction?.customer?.name ?? ""}
            placeholder="Sélection des clientes bientôt disponible"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Montant payé (F CFA)
          </label>
          <Input
            type="number"
            min={0}
            value={paidAmount}
            onChange={(event) => setPaidAmount(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Articles
          </label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4" />
            Ajouter un article
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-end gap-3 rounded-xl border border-border p-3"
            >
              <div className="flex min-w-48 flex-1 flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">
                  Produit
                </label>
                <Select
                  value={item.product_id}
                  onValueChange={(value) => {
                    if (value) handleProductChange(index, value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un produit">
                      {(value: string | null) =>
                        value
                          ? (products.find((p) => p.id === value)?.name ??
                            value)
                          : "Choisir un produit"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-24 flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">
                  Quantité
                </label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateItem(index, {
                      quantity: Number(event.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="flex w-32 flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">
                  Prix unitaire
                </label>
                <Input
                  type="number"
                  min={0}
                  value={item.unit_price}
                  onChange={(event) =>
                    updateItem(index, {
                      unit_price: Number(event.target.value) || 0,
                    })
                  }
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 p-4">
        <span className="text-sm font-medium text-foreground">
          Montant total
        </span>
        <span className="text-lg font-semibold text-foreground">
          {formatAmount(totalAmount)}
        </span>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {transaction ? "Enregistrer les modifications" : "Créer la transaction"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

export { TransactionForm };
