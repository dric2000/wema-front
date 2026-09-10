import { Plus, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTransactions } from "@/lib/api";
import {
  formatAmount,
  formatDateTime,
  formatItemsSummary,
  transactionStatusBadgeVariant,
  transactionStatusLabels,
  transactionTypeIcons,
  transactionTypeLabels,
} from "@/lib/format";

export default async function TransactionsPage(
  props: PageProps<"/dashboard/transactions">,
) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page ?? 1) || 1;
  const transactions = await getTransactions(page);

  if (!transactions) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <TriangleAlert className="size-6 text-destructive" />
          <p className="font-medium text-foreground">
            Impossible de charger les transactions
          </p>
          <p className="text-sm text-muted-foreground">
            Vérifiez que le backend est bien accessible, puis réessayez.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { data, current_page, last_page, total } = transactions;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-1">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-foreground">
                Journal des transactions
              </h2>
              <span className="text-xs text-muted-foreground">
                {total} transaction{total > 1 ? "s" : ""}
              </span>
            </div>
            <Button
              size="sm"
              render={<Link href="/dashboard/transactions/new" />}
            >
              <Plus className="size-4" />
              Nouvelle transaction
            </Button>
          </div>

          {data.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune transaction pour le moment.
            </p>
          ) : (
            <ul className="flex flex-col">
              {data.map((transaction) => {
                const TypeIcon = transactionTypeIcons[transaction.type];
                const isPartiallyPaid =
                  transaction.paid_amount !== transaction.total_amount;

                return (
                  <li
                    key={transaction.id}
                    className="border-b border-border last:border-0"
                  >
                    <Link
                      href={`/dashboard/transactions/${transaction.id}`}
                      className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <TypeIcon className="size-4" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium text-foreground">
                          {transactionTypeLabels[transaction.type]}
                          {transaction.customer
                            ? ` - ${transaction.customer.name}`
                            : ""}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {formatItemsSummary(transaction.items)}
                        </span>
                      </div>
                      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                        {formatDateTime(transaction.created_at)}
                      </span>
                      <div className="flex w-28 shrink-0 flex-col text-right">
                        <span className="text-sm font-medium text-foreground">
                          {formatAmount(transaction.total_amount)}
                        </span>
                        {isPartiallyPaid && (
                          <span className="text-xs text-muted-foreground">
                            Payé : {formatAmount(transaction.paid_amount)}
                          </span>
                        )}
                      </div>
                      <Badge
                        variant={
                          transactionStatusBadgeVariant[transaction.status]
                        }
                        className="shrink-0"
                      >
                        {transactionStatusLabels[transaction.status]}
                      </Badge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {last_page > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <Link
                href={`/dashboard/transactions?page=${current_page - 1}`}
                aria-disabled={current_page <= 1}
                className={
                  current_page <= 1
                    ? "pointer-events-none text-muted-foreground/50"
                    : "text-foreground hover:underline"
                }
              >
                Précédent
              </Link>
              <span className="text-muted-foreground">
                Page {current_page} / {last_page}
              </span>
              <Link
                href={`/dashboard/transactions?page=${current_page + 1}`}
                aria-disabled={current_page >= last_page}
                className={
                  current_page >= last_page
                    ? "pointer-events-none text-muted-foreground/50"
                    : "text-foreground hover:underline"
                }
              >
                Suivant
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
