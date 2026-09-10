import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";

import { TransactionForm } from "@/components/dashboard/transaction-form";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts, getTransaction } from "@/lib/api";

export default async function EditTransactionPage(
  props: PageProps<"/dashboard/transactions/[id]/edit">
) {
  const { id } = await props.params;
  const [transaction, products] = await Promise.all([
    getTransaction(id),
    getProducts(),
  ]);

  if (!transaction) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <TriangleAlert className="size-6 text-destructive" />
          <p className="font-medium text-foreground">
            Transaction introuvable
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/dashboard/transactions/${id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour au détail
      </Link>
      <Card>
        <CardContent>
          <h1 className="mb-6 text-lg font-semibold text-foreground">
            Modifier la transaction
          </h1>
          <TransactionForm products={products?.data ?? []} transaction={transaction} />
        </CardContent>
      </Card>
    </div>
  );
}
