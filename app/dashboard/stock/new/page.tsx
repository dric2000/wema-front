import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/dashboard/product-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewProductPage() {
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
        <CardContent>
          <h1 className="mb-6 text-lg font-semibold text-foreground">
            Nouveau produit
          </h1>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
