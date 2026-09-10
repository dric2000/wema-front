import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";

import { TransactionStatusActions } from "@/components/dashboard/transaction-status-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTransaction } from "@/lib/api";
import {
  formatAmount,
  formatDateTime,
  transactionStatusBadgeVariant,
  transactionStatusLabels,
  transactionTypeLabels,
} from "@/lib/format";

export default async function TransactionDetailPage(
  props: PageProps<"/dashboard/transactions/[id]">
) {
  const { id } = await props.params;
  const transaction = await getTransaction(id);

  if (!transaction) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <TriangleAlert className="size-6 text-destructive" />
          <p className="font-medium text-foreground">
            Impossible de charger cette transaction
          </p>
          <p className="text-sm text-muted-foreground">
            Elle n&apos;existe peut-être plus, ou le backend est inaccessible.
          </p>
          <Button variant="outline" render={<Link href="/dashboard/transactions" />}>
            Retour aux transactions
          </Button>
        </CardContent>
      </Card>
    );
  }

  const dueAmount = transaction.total_amount - transaction.paid_amount;

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
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {transactionTypeLabels[transaction.type]}
                  {transaction.customer ? ` - ${transaction.customer.name}` : ""}
                </h1>
                <Badge variant={transactionStatusBadgeVariant[transaction.status]}>
                  {transactionStatusLabels[transaction.status]}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(transaction.created_at)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {transaction.status === "PENDING" && (
                <TransactionStatusActions id={transaction.id} />
              )}
              <Button
                variant="outline"
                render={<Link href={`/dashboard/transactions/${transaction.id}/edit`} />}
              >
                Modifier
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Montant total
              </span>
              <span className="text-base font-semibold text-foreground">
                {formatAmount(transaction.total_amount)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Montant payé
              </span>
              <span className="text-base font-semibold text-foreground">
                {formatAmount(transaction.paid_amount)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Reste à payer
              </span>
              <span
                className={`text-base font-semibold ${
                  dueAmount > 0 ? "text-warning" : "text-foreground"
                }`}
              >
                {formatAmount(dueAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              Articles
            </h2>
            <ul className="flex flex-col">
              {transaction.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
                >
                  <span className="text-foreground">
                    {item.product.name}{" "}
                    <span className="text-muted-foreground">
                      x{item.quantity}
                    </span>
                  </span>
                  <span className="text-foreground">
                    {formatAmount(item.unit_price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {transaction.message && (
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/50 p-4">
              <h2 className="text-sm font-semibold text-foreground">
                Message vocal source
              </h2>
              <p className="text-sm text-muted-foreground italic">
                « {transaction.message.transcript} »
              </p>
              <audio
                controls
                src={transaction.message.audio_url}
                className="h-9 w-full max-w-sm"
              />
              <span className="text-xs text-muted-foreground">
                Fiabilité de la transcription :{" "}
                {Math.round(transaction.message.confidence * 100)}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
