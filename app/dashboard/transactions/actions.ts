"use server";

import { revalidatePath } from "next/cache";

import type {
  ActionResult,
  TransactionInput,
  TransactionStatus,
} from "@/lib/types";

const API_URL = process.env.WEMA_API_URL;

async function callApi(
  path: string,
  method: "POST" | "PUT",
  body?: unknown
): Promise<ActionResult> {
  if (!API_URL) {
    return { success: false, message: "Configuration API manquante." };
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      return {
        success: false,
        message: `Le serveur a répondu avec une erreur (${res.status}).`,
      };
    }

    const data = await res.json().catch(() => null);
    return { success: true, id: data?.transaction?.id ?? data?.id };
  } catch (error) {
    console.error(`callApi ${path} failed`, error);
    return { success: false, message: "Impossible de contacter le serveur." };
  }
}

function revalidateTransactionPaths(id?: string) {
  if (id) revalidatePath(`/dashboard/transactions/${id}`);
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
}

export async function confirmTransaction(id: string): Promise<ActionResult> {
  const result = await callApi(`/api/transactions/${id}/confirm`, "POST");
  if (result.success) revalidateTransactionPaths(id);
  return result;
}

export async function rejectTransaction(id: string): Promise<ActionResult> {
  const result = await callApi(`/api/transactions/${id}/reject`, "POST");
  if (result.success) revalidateTransactionPaths(id);
  return result;
}

export async function createTransaction(
  input: TransactionInput
): Promise<ActionResult> {
  const result = await callApi("/api/transactions", "POST", input);
  if (result.success) revalidateTransactionPaths(result.id);
  return result;
}

export async function updateTransaction(
  id: string,
  input: TransactionInput & { status: TransactionStatus }
): Promise<ActionResult> {
  const result = await callApi(`/api/transactions/${id}`, "PUT", input);
  if (result.success) revalidateTransactionPaths(id);
  return result;
}
