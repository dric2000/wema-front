import Link from "next/link";
import { ArrowLeft, Box, TriangleAlert } from "lucide-react";

import { DeleteProductButton } from "@/components/dashboard/delete-product-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProduct } from "@/lib/api";
import { formatAmount, formatDateTime, transactionTypeIcons } from "@/lib/format";

export default async function ProductDetailPage(
  props: PageProps<"/dashboard/stock/[id]">
) {
  const { id } = await props.params;
  const detail = await getProduct(id);

  if (!detail) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <TriangleAlert className="size-6 text-destructive" />
          <p className="font-medium text-foreground">
            Impossible de charger ce produit
          </p>
          <p className="text-sm text-muted-foreground">
            Il n&apos;existe peut-être plus, ou le backend est inaccessible.
          </p>
          <Button variant="outline" render={<Link href="/dashboard/stock" />}>
            Retour au stock
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { product, summary, movements } = detail;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/stock"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour au stock
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold text-foreground">
                {product.name}
              </h1>
              {product.aliases.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {product.aliases.join(", ")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                render={<Link href={`/dashboard/stock/${product.id}/edit`} />}
              >
                Modifier
              </Button>
              <DeleteProductButton id={product.id} productName={product.name} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Stock actuel
              </span>
              <span className="text-base font-semibold text-foreground">
                {summary.current_stock}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Prix unitaire
              </span>
              <span className="text-base font-semibold text-foreground">
                {formatAmount(summary.unit_price)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Total vendu
              </span>
              <span className="text-base font-semibold text-foreground">
                {summary.total_sold_quantity}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Total réapprovisionné
              </span>
              <span className="text-base font-semibold text-foreground">
                {summary.total_restocked_quantity}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              Historique des mouvements
            </h2>
            {movements.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Aucun mouvement enregistré pour ce produit.
              </p>
            ) : (
              <ul className="flex flex-col">
                {movements.map((movement) => {
                  const TypeIcon = transactionTypeIcons[movement.type] ?? Box;
                  return (
                    <li
                      key={movement.id}
                      className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <TypeIcon className="size-4" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium text-foreground">
                          {movement.direction === "IN" ? "Entrée" : "Sortie"}
                          {movement.customer ? ` — ${movement.customer}` : ""}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {formatDateTime(movement.date)}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-sm font-medium ${
                          movement.direction === "IN"
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {movement.direction === "IN" ? "+" : "-"}
                        {movement.quantity}
                      </span>
                      <span className="w-24 shrink-0 text-right text-sm text-muted-foreground">
                        {formatAmount(movement.total_price)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
