import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";

import { ProductForm } from "@/components/dashboard/product-form";
import { Card, CardContent } from "@/components/ui/card";
import { getProduct } from "@/lib/api";

export default async function EditProductPage(
  props: PageProps<"/dashboard/stock/[id]/edit">
) {
  const { id } = await props.params;
  const detail = await getProduct(id);

  if (!detail) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <TriangleAlert className="size-6 text-destructive" />
          <p className="font-medium text-foreground">Produit introuvable</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/dashboard/stock/${id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour au détail
      </Link>
      <Card>
        <CardContent>
          <h1 className="mb-6 text-lg font-semibold text-foreground">
            Modifier le produit
          </h1>
          <ProductForm product={detail.product} />
        </CardContent>
      </Card>
    </div>
  );
}
