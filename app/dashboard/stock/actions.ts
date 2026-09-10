"use server";

import { revalidatePath } from "next/cache";

import { mutateApi } from "@/lib/api";
import type { ActionResult, ProductInput } from "@/lib/types";

function revalidateProductPaths(id?: string) {
  if (id) revalidatePath(`/dashboard/stock/${id}`);
  revalidatePath("/dashboard/stock");
  revalidatePath("/dashboard");
}

async function toActionResult(
  result: Awaited<ReturnType<typeof mutateApi<{ product?: { id: string }; id?: string }>>>
): Promise<ActionResult> {
  if (!result.success) return { success: false, message: result.message };
  return { success: true, id: result.data?.product?.id ?? result.data?.id };
}

export async function createProduct(
  input: ProductInput
): Promise<ActionResult> {
  const result = await toActionResult(
    await mutateApi("/api/products", "POST", input)
  );
  if (result.success) revalidateProductPaths(result.id);
  return result;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ActionResult> {
  const result = await toActionResult(
    await mutateApi(`/api/products/${id}`, "PUT", input)
  );
  if (result.success) revalidateProductPaths(id);
  return result;
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const result = await toActionResult(await mutateApi(`/api/products/${id}`, "DELETE"));
  if (result.success) revalidateProductPaths();
  return result;
}
