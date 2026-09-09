export interface Merchant {
  id: string;
  name: string;
  channel_user_id: string;
}

export interface DashboardKpis {
  daily_sales: number;
  daily_collected: number;
  total_debts: number;
  pending_validations: number;
}

export type AlertSeverity = "warning" | "danger";

export interface DashboardAlert {
  type: string;
  severity: AlertSeverity;
  count: number;
  message: string;
  action_url: string;
}

export type TransactionType = "SALE" | "PAYMENT" | "RESTOCK" | "EXPENSE";
export type TransactionStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export interface ActivityCustomer {
  id: string;
  name: string;
}

export interface ActivityMessage {
  id: string;
  transcript: string;
  audio_url: string;
}

export interface RecentActivityItem {
  id: string;
  created_at: string;
  formatted_time: string;
  type: TransactionType;
  status: TransactionStatus;
  customer: ActivityCustomer | null;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  items_summary: string;
  message: ActivityMessage | null;
}

export interface DashboardOverview {
  merchant: Merchant;
  kpis: DashboardKpis;
  alerts: DashboardAlert[];
  recent_activity: RecentActivityItem[];
}

export interface Product {
  id: string;
  name: string;
  aliases: string[];
  unit_price: number;
  stock: number;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
  created_at: string;
}

export interface ProductsSummary {
  total_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  low_stock_threshold: number;
}

export interface ProductsResponse {
  summary: ProductsSummary;
  data: Product[];
}
