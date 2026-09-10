import { cache } from "react";

import type {
  DashboardOverview,
  ProductsResponse,
  TransactionDetail,
  TransactionsResponse,
} from "@/lib/types";

const API_URL = process.env.WEMA_API_URL;

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

export const getDashboardOverview = cache(
  (): Promise<DashboardOverview | null> =>
    fetchApi<DashboardOverview>("/api/dashboard/overview")
);

export const getProducts = cache(
  (): Promise<ProductsResponse | null> =>
    fetchApi<ProductsResponse>("/api/products")
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
