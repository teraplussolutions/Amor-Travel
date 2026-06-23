export type ClientType = "Regular" | "New" | "VIP" | "Corporate" | "Blacklist";
export type Gender = "Male" | "Female" | "Other";
export type Language = "mk" | "en";

export interface Client {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  phone2?: string;
  passport_number?: string;
  passport_expiry?: string;
  date_of_birth?: string;
  gender?: Gender;
  nationality?: string;
  city?: string;
  country?: string;
  address?: string;
  language_pref: Language;
  client_type: ClientType;
  notes?: string;
  opt_in_marketing: boolean;
  created_at: string;
  updated_at: string;
}

export type QuoteStatus = "Draft" | "Sent" | "Confirmed" | "Cancelled" | "Expired";
export type PipelineStage = "Lead" | "Proposal" | "Negotiation" | "Confirmed" | "Won" | "Lost";

export interface QuoteItem {
  description: string;
  qty: number;
  unit_price_eur: number;
  total_eur: number;
}

export interface Quote {
  id: string;
  code: string;
  client_id?: string;
  destination: string;
  departure_date?: string;
  return_date?: string;
  travelers: number;
  language: Language;
  status: QuoteStatus;
  pipeline_stage: PipelineStage;
  total_eur: number;
  total_mkd: number;
  items: QuoteItem[];
  notes?: string;
  terms?: string;
  expiry_date?: string;
  magic_token?: string;
  created_at: string;
  updated_at: string;
  clients?: Pick<Client, "first_name" | "last_name" | "email" | "phone">;
}

export type SaleStatus = "Pending" | "Completed" | "Cancelled" | "Refunded";
export type PaymentType = "Cash" | "Bank Transfer" | "Card" | "Custom";

export interface SaleItem {
  description: string;
  qty: number;
  unit_price_eur: number;
  cost_eur: number;
  total_eur: number;
}

export interface Sale {
  id: string;
  code: string;
  client_id?: string;
  quote_id?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  travelers: number;
  payment_type: PaymentType;
  payment_note?: string;
  status: SaleStatus;
  items: SaleItem[];
  revenue_eur: number;
  supplier_cost_eur: number;
  profit_eur: number;
  revenue_mkd: number;
  profit_mkd: number;
  discount_eur: number;
  language: Language;
  pnr?: string;
  booking_ref?: string;
  airline?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  clients?: Pick<Client, "first_name" | "last_name" | "email" | "phone">;
}

export interface Expense {
  id: string;
  code: string;
  description: string;
  category: string;
  subcategory?: string;
  amount_eur: number;
  amount_mkd: number;
  expense_date: string;
  payment_type: string;
  reference_id?: string;
  sale_id?: string;
  notes?: string;
  is_recurring: boolean;
  recurrence_period?: string;
  created_at: string;
}

export type VoucherType = "percent" | "fixed" | "free";
export type VoucherStatus = "Active" | "Used" | "Expired";

export interface Voucher {
  id: string;
  code: string;
  type: VoucherType;
  value: number;
  description?: string;
  client_id?: string;
  expiry_date?: string;
  uses_limit: number;
  uses_remaining: number;
  status: VoucherStatus;
  created_at: string;
  clients?: Pick<Client, "first_name" | "last_name">;
}

export const MKD_RATE = 61.5;
export function eurToMkd(eur: number) { return Math.round(eur * MKD_RATE); }
export function fmtEur(n: number) { return "€" + n.toFixed(2); }
export function fmtMkd(n: number) { return Math.round(n).toLocaleString() + " МКД"; }

export const EXPENSE_CATEGORIES = [
  "Office", "Marketing", "Travel", "Supplier",
  "Software", "Salary", "Tax", "Other"
] as const;
