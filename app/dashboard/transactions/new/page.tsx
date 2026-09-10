import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { TransactionForm } from "@/components/dashboard/transaction-form";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts } from "@/lib/api";

export default async function NewTransactionPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/transactions"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour aux transactions
      </Link>
      <Card>
        <CardContent>
          <h1 className="mb-6 text-lg font-semibold text-foreground">
            Nouvelle transaction
          </h1>
          <TransactionForm products={products?.data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
