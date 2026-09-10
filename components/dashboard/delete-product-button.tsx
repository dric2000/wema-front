"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { deleteProduct } from "@/app/dashboard/stock/actions";
import { Button } from "@/components/ui/button";

function DeleteProductButton({
  id,
  productName,
}: {
  id: string;
  productName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !window.confirm(
        `Supprimer « ${productName} » ? Cette action est définitive.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("Produit supprimé");
        router.push("/dashboard/stock");
      } else {
        toast.error(result.message ?? "Échec de la suppression");
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="border-destructive/40 text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      Supprimer
    </Button>
  );
}

export { DeleteProductButton };
