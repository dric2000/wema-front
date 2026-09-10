"use server";

import { revalidatePath } from "next/cache";

import { mutateApi } from "@/lib/api";
import type {
  ActionResult,
  TransactionInput,
  TransactionStatus,
} from "@/lib/types";

function revalidateTransactionPaths(id?: string) {
  if (id) revalidatePath(`/dashboard/transactions/${id}`);
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
}

async function toActionResult(
  result: Awaited<ReturnType<typeof mutateApi<{ transaction?: { id: string }; id?: string }>>>
): Promise<ActionResult> {
  if (!result.success) return { success: false, message: result.message };
  return { success: true, id: result.data?.transaction?.id ?? result.data?.id };
}

export async function confirmTransaction(id: string): Promise<ActionResult> {
  const result = await toActionResult(
    await mutateApi(`/api/transactions/${id}/confirm`, "POST")
  );
  if (result.success) revalidateTransactionPaths(id);
  return result;
}

export async function rejectTransaction(id: string): Promise<ActionResult> {
  const result = await toActionResult(
    await mutateApi(`/api/transactions/${id}/reject`, "POST")
  );
  if (result.success) revalidateTransactionPaths(id);
  return result;
}

export async function createTransaction(
  input: TransactionInput
): Promise<ActionResult> {
  const result = await toActionResult(
    await mutateApi("/api/transactions", "POST", input)
  );
  if (result.success) revalidateTransactionPaths(result.id);
  return result;
}

export async function updateTransaction(
  id: string,
  input: TransactionInput & { status: TransactionStatus }
): Promise<ActionResult> {
  const result = await toActionResult(
    await mutateApi(`/api/transactions/${id}`, "PUT", input)
  );
  if (result.success) revalidateTransactionPaths(id);
  return result;
}
