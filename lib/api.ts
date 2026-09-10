import { cache } from "react";

import type {
  CustomersResponse,
  DashboardOverview,
  ProductDetail,
  ProductsResponse,
  TransactionDetail,
  TransactionsResponse,
} from "@/lib/types";

const API_URL = process.env.WEMA_API_URL?.trim().replace(/\/$/, "");

async function fetchApi<T>(path: string): Promise<T | null> {
  if (!API_URL) {
    console.error("WEMA_API_URL is not set");
    return null;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });

    if (!res.ok) {
      console.error(`fetchApi ${path}: ${res.status} ${res.statusText}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`fetchApi ${path} failed`, error);
    return null;
  }
}

export type MutateResult<T> =
  | { success: true; data: T | null }
  | { success: false; message: string };

export async function mutateApi<T = unknown>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<MutateResult<T>> {
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
    return { success: true, data: data as T | null };
  } catch (error) {
    console.error(`mutateApi ${path} failed`, error);
    return { success: false, message: "Impossible de contacter le serveur." };
  }
}

export const getDashboardOverview = cache(
  (): Promise<DashboardOverview | null> =>
    fetchApi<DashboardOverview>("/api/dashboard/overview")
);

export const getProducts = cache(
  (): Promise<ProductsResponse | null> =>
    fetchApi<ProductsResponse>("/api/products")
);

export const getProduct = cache(
  (id: string): Promise<ProductDetail | null> =>
    fetchApi<ProductDetail>(`/api/products/${id}`)
);

export const getTransactions = cache(
  (page = 1): Promise<TransactionsResponse | null> =>
    fetchApi<TransactionsResponse>(
      page > 1 ? `/api/transactions?page=${page}` : "/api/transactions"
    )
);

export const getTransaction = cache(
  (id: string): Promise<TransactionDetail | null> =>
    fetchApi<TransactionDetail>(`/api/transactions/${id}`)
);

export const getCustomers = cache(
  (): Promise<CustomersResponse | null> =>
    fetchApi<CustomersResponse>("/api/customers")
);
