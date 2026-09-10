import { TriangleAlert } from "lucide-react";

import { ClientesContent } from "@/components/dashboard/clientes/clientes-content";
import { Card, CardContent } from "@/components/ui/card";
import { getCustomers } from "@/lib/api";

export default async function ClientesPage() {
  const customers = await getCustomers();

  if (!customers) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <TriangleAlert className="size-6 text-destructive" />
          <p className="font-medium text-foreground">
            Impossible de charger les clientes
          </p>
          <p className="text-sm text-muted-foreground">
            Vérifiez que le backend est bien accessible, puis réessayez.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ClientesContent summary={customers.summary} customers={customers.data} />
  );
}
