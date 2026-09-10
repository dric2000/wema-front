import Link from "next/link";
import { AlertTriangle, Box, PackageX, Plus, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts } from "@/lib/api";
import { formatAmount } from "@/lib/format";
import type { Product } from "@/lib/types";

function stockBadge(product: Product) {
  if (product.is_out_of_stock) {
    return <Badge variant="destructive">Rupture</Badge>;
  }
  if (product.is_low_stock) {
    return <Badge variant="warning">Stock faible</Badge>;
  }
  return <Badge variant="secondary">Disponible</Badge>;
}

export default async function StockPage() {
  const products = await getProducts();

  if (!products) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <TriangleAlert className="size-6 text-destructive" />
          <p className="font-medium text-foreground">
            Impossible de charger le catalogue produits
          </p>
          <p className="text-sm text-muted-foreground">
            Vérifiez que le backend est bien accessible, puis réessayez.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { summary, data } = products;

  const summaryCards = [
    {
      label: "Produits au catalogue",
      value: String(summary.total_products),
      icon: Box,
      accent: "bg-secondary text-primary",
    },
    {
      label: "Stock faible",
      value: String(summary.low_stock_count),
      icon: AlertTriangle,
      accent: "bg-warning/15 text-warning",
    },
    {
      label: "Rupture de stock",
      value: String(summary.out_of_stock_count),
      icon: PackageX,
      accent: "bg-destructive/15 text-destructive",
    },
    {
      label: "Seuil d'alerte",
      value: String(summary.low_stock_threshold),
      icon: Box,
      accent: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex flex-col gap-3">
              <span
                className={`flex size-10 items-center justify-center rounded-full ${card.accent}`}
              >
                <card.icon className="size-5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-muted-foreground">
                  {card.label}
                </span>
                <span className="text-xl font-semibold text-foreground">
                  {card.value}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Catalogue produits
            </h2>
            <Button size="sm" render={<Link href="/dashboard/stock/new" />}>
              <Plus className="size-4" />
              Ajouter un produit
            </Button>
          </div>
          {data.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucun produit enregistré pour le moment.
            </p>
          ) : (
            <ul className="flex flex-col">
              {data.map((product) => (
                <li key={product.id} className="border-b border-border last:border-0">
                  <Link
                    href={`/dashboard/stock/${product.id}`}
                    className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Box className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {product.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {product.aliases.join(", ")}
                      </span>
                    </div>
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                      {product.stock} en stock
                    </span>
                    <span className="w-24 shrink-0 text-right text-sm font-medium text-foreground">
                      {formatAmount(product.unit_price)}
                    </span>
                    <span className="shrink-0">{stockBadge(product)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
