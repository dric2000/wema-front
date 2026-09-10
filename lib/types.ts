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

export interface ProductInput {
  name: string;
  aliases: string[];
  unit_price: number;
  stock: number;
}

export interface ProductRecord {
  id: string;
  merchant_id: string;
  name: string;
  aliases: string[];
  unit_price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductMovement {
  id: string;
  date: string;
  type: TransactionType;
  direction: "IN" | "OUT";
  quantity: number;
  unit_price: number;
  total_price: number;
  customer: string | null;
  transaction_id: string;
}

export interface ProductDetailSummary {
  current_stock: number;
  unit_price: number;
  total_sold_quantity: number;
  total_restocked_quantity: number;
}

export interface ProductDetail {
  product: ProductRecord;
  summary: ProductDetailSummary;
  movements: ProductMovement[];
}

export interface TransactionItemProduct {
  id: string;
  name: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product: TransactionItemProduct;
}

export interface TransactionMessage {
  id: string;
  audio_url: string;
  transcript: string;
  confidence: number;
}

export interface Transaction {
  id: string;
  merchant_id: string;
  customer_id: string | null;
  message_id: string | null;
  type: TransactionType;
  total_amount: number;
  paid_amount: number;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
  customer: ActivityCustomer | null;
  items: TransactionItem[];
  message: TransactionMessage | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export type TransactionsResponse = PaginatedResponse<Transaction>;

export interface TransactionDetailItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface TransactionMessageDetail {
  id: string;
  merchant_id: string;
  external_id: string;
  audio_url: string;
  transcript: string;
  confidence: number;
  status: string;
  received_at: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionDetail {
  id: string;
  merchant_id: string;
  customer_id: string | null;
  message_id: string | null;
  type: TransactionType;
  total_amount: number;
  paid_amount: number;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
  customer: ActivityCustomer | null;
  items: TransactionDetailItem[];
  message: TransactionMessageDetail | null;
}

export interface TransactionItemInput {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface TransactionInput {
  customer_id: string | null;
  type: TransactionType;
  total_amount: number;
  paid_amount: number;
  items: TransactionItemInput[];
}

export interface ActionResult {
  success: boolean;
  id?: string;
  message?: string;
}
