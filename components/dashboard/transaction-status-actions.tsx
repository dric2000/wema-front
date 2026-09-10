"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { confirmTransaction, rejectTransaction } from "@/app/dashboard/transactions/actions";
import { Button } from "@/components/ui/button";

function TransactionStatusActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await confirmTransaction(id);
      if (result.success) {
        toast.success("Transaction confirmée");
      } else {
        toast.error(result.message ?? "Échec de la confirmation");
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectTransaction(id);
      if (result.success) {
        toast.success("Transaction rejetée");
      } else {
        toast.error(result.message ?? "Échec du rejet");
      }
    });
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleConfirm} disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Confirmer
      </Button>
      <Button
        variant="outline"
        className="border-destructive/40 text-destructive hover:bg-destructive/10"
        onClick={handleReject}
        disabled={isPending}
      >
        Rejeter
      </Button>
    </div>
  );
}

export { TransactionStatusActions };
