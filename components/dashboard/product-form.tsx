"use client";

import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { createProduct, updateProduct } from "@/app/dashboard/stock/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductRecord } from "@/lib/types";

interface ProductFormProps {
  product?: ProductRecord;
}

function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(product?.name ?? "");
  const [aliases, setAliases] = useState(product?.aliases.join(", ") ?? "");
  const [unitPrice, setUnitPrice] = useState(
    product ? String(product.unit_price) : "0"
  );
  const [stock, setStock] = useState(product ? String(product.stock) : "0");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Le nom du produit est obligatoire.");
      return;
    }

    const payload = {
      name: name.trim(),
      aliases: aliases
        .split(",")
        .map((alias) => alias.trim())
        .filter(Boolean),
      unit_price: Number(unitPrice) || 0,
      stock: Number(stock) || 0,
    };

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, payload)
        : await createProduct(payload);

      if (result.success) {
        toast.success(product ? "Produit mis à jour" : "Produit créé");
        router.push(
          result.id ? `/dashboard/stock/${result.id}` : "/dashboard/stock"
        );
      } else {
        toast.error(result.message ?? "Une erreur est survenue");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Nom du produit
        </label>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex. Bidon d'huile 5L"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Autres appellations
        </label>
        <Input
          value={aliases}
          onChange={(event) => setAliases(event.target.value)}
          placeholder="huile, bidon d'huile, huile végétale (séparées par des virgules)"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Prix unitaire (F CFA)
          </label>
          <Input
            type="number"
            min={0}
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Stock
          </label>
          <Input
            type="number"
            min={0}
            value={stock}
            onChange={(event) => setStock(event.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {product ? "Enregistrer les modifications" : "Créer le produit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

export { ProductForm };
