-- =============================================
-- AMOR TRAVEL — FULL CRM SCHEMA
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ekdeizmxgucpvcrmoftz/sql/new
-- =============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SEQUENCE IF NOT EXISTS clients_seq START 1;
CREATE SEQUENCE IF NOT EXISTS quotes_seq START 1;
CREATE SEQUENCE IF NOT EXISTS sales_seq START 1;
CREATE SEQUENCE IF NOT EXISTS invoices_seq START 1;
CREATE SEQUENCE IF NOT EXISTS vouchers_seq START 1;
CREATE SEQUENCE IF NOT EXISTS expenses_seq START 1;

-- ── CLIENTS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text UNIQUE NOT NULL DEFAULT 'AMR-' || LPAD(nextval('clients_seq')::text, 4, '0'),
  first_name      text NOT NULL,
  last_name       text NOT NULL,
  email           text,
  phone           text,
  phone2          text,
  passport_number text,
  passport_expiry date,
  date_of_birth   date,
  gender          text CHECK (gender IN ('Male','Female','Other')),
  nationality     text,
  city            text,
  country         text,
  address         text,
  language_pref   text DEFAULT 'mk' CHECK (language_pref IN ('mk','en')),
  client_type     text DEFAULT 'Regular' CHECK (client_type IN ('Regular','New','VIP','Corporate','Blacklist')),
  notes           text,
  opt_in_marketing boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ── QUOTES ───────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text UNIQUE NOT NULL DEFAULT 'QT-' || TO_CHAR(now(), 'YY') || '-' || LPAD(nextval('quotes_seq')::text, 4, '0'),
  client_id       uuid REFERENCES clients(id) ON DELETE SET NULL,
  destination     text NOT NULL,
  departure_date  date,
  return_date     date,
  travelers       integer DEFAULT 1,
  language        text DEFAULT 'mk' CHECK (language IN ('mk','en')),
  status          text DEFAULT 'Draft' CHECK (status IN ('Draft','Sent','Confirmed','Cancelled','Expired')),
  pipeline_stage  text DEFAULT 'Lead' CHECK (pipeline_stage IN ('Lead','Proposal','Negotiation','Confirmed','Won','Lost')),
  total_eur       numeric(12,2) DEFAULT 0,
  total_mkd       numeric(12,2) DEFAULT 0,
  items           jsonb DEFAULT '[]',
  notes           text,
  terms           text,
  expiry_date     date,
  magic_token     text UNIQUE DEFAULT encode(gen_random_bytes(16),'hex'),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ── SALES ────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text UNIQUE NOT NULL DEFAULT 'SL-' || TO_CHAR(now(), 'YY') || '-' || LPAD(nextval('sales_seq')::text, 4, '0'),
  client_id        uuid REFERENCES clients(id) ON DELETE SET NULL,
  quote_id         uuid REFERENCES quotes(id) ON DELETE SET NULL,
  destination      text,
  departure_date   date,
  return_date      date,
  travelers        integer DEFAULT 1,
  payment_type     text DEFAULT 'Cash' CHECK (payment_type IN ('Cash','Bank Transfer','Card','Custom')),
  payment_note     text,
  status           text DEFAULT 'Completed' CHECK (status IN ('Pending','Completed','Cancelled','Refunded')),
  items            jsonb DEFAULT '[]',
  revenue_eur      numeric(12,2) DEFAULT 0,
  supplier_cost_eur numeric(12,2) DEFAULT 0,
  profit_eur       numeric(12,2) DEFAULT 0,
  revenue_mkd      numeric(12,2) DEFAULT 0,
  profit_mkd       numeric(12,2) DEFAULT 0,
  voucher_code     text,
  discount_eur     numeric(12,2) DEFAULT 0,
  language         text DEFAULT 'mk' CHECK (language IN ('mk','en')),
  pnr              text,
  booking_ref      text,
  airline          text,
  notes            text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ── INVOICES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code         text UNIQUE NOT NULL DEFAULT 'INV-' || TO_CHAR(now(), 'YY') || '-' || LPAD(nextval('invoices_seq')::text, 4, '0'),
  client_id    uuid REFERENCES clients(id) ON DELETE SET NULL,
  sale_id      uuid REFERENCES sales(id) ON DELETE SET NULL,
  quote_id     uuid REFERENCES quotes(id) ON DELETE SET NULL,
  description  text NOT NULL,
  amount_eur   numeric(12,2) DEFAULT 0,
  amount_mkd   numeric(12,2) DEFAULT 0,
  issue_date   date DEFAULT CURRENT_DATE,
  due_date     date,
  status       text DEFAULT 'Sent' CHECK (status IN ('Draft','Sent','Paid','Overdue','Cancelled')),
  language     text DEFAULT 'mk' CHECK (language IN ('mk','en')),
  notes        text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ── VOUCHERS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS vouchers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text UNIQUE NOT NULL DEFAULT 'AMOR-' || UPPER(SUBSTRING(encode(gen_random_bytes(4),'hex'), 1, 6)),
  type          text NOT NULL CHECK (type IN ('percent','fixed','free')),
  value         numeric(10,2) DEFAULT 0,
  description   text,
  client_id     uuid REFERENCES clients(id) ON DELETE SET NULL,
  expiry_date   date,
  uses_limit    integer DEFAULT 1,
  uses_remaining integer DEFAULT 1,
  status        text DEFAULT 'Active' CHECK (status IN ('Active','Used','Expired')),
  created_at    timestamptz DEFAULT now()
);

-- ── EXPENSES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text UNIQUE NOT NULL DEFAULT 'EX-' || TO_CHAR(now(), 'YY') || '-' || LPAD(nextval('expenses_seq')::text, 4, '0'),
  description      text NOT NULL,
  category         text NOT NULL,
  subcategory      text,
  amount_eur       numeric(12,2) DEFAULT 0,
  amount_mkd       numeric(12,2) DEFAULT 0,
  expense_date     date DEFAULT CURRENT_DATE,
  payment_type     text DEFAULT 'Cash',
  reference_id     text,
  sale_id          uuid REFERENCES sales(id) ON DELETE SET NULL,
  notes            text,
  is_recurring     boolean DEFAULT false,
  recurrence_period text,
  created_at       timestamptz DEFAULT now()
);

-- ── WATCHLISTS ───────────────────────────────
CREATE TABLE IF NOT EXISTS watchlists (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       uuid REFERENCES clients(id) ON DELETE CASCADE,
  from_city       text NOT NULL,
  to_city         text NOT NULL,
  target_price_eur numeric(10,2),
  travel_date_from date,
  travel_date_to  date,
  notes           text,
  status          text DEFAULT 'Active' CHECK (status IN ('Active','Triggered','Expired')),
  last_checked_at timestamptz,
  created_at      timestamptz DEFAULT now()
);

-- ── ACTIVITY LOG ─────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id   text,
  action      text NOT NULL,
  details     jsonb,
  user_email  text,
  created_at  timestamptz DEFAULT now()
);

-- ── INDEXES ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_clients_email    ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone    ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_passport ON clients(passport_number);
CREATE INDEX IF NOT EXISTS idx_quotes_client    ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status    ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_sales_client     ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_date       ON sales(departure_date);
CREATE INDEX IF NOT EXISTS idx_invoices_client  ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date    ON expenses(expense_date);

-- ── ROW LEVEL SECURITY ───────────────────────
ALTER TABLE clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales        ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices     ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_clients"      ON clients      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_quotes"       ON quotes       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_sales"        ON sales        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_invoices"     ON invoices     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_vouchers"     ON vouchers     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_expenses"     ON expenses     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_watchlists"   ON watchlists   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_activity_log" ON activity_log FOR ALL USING (true) WITH CHECK (true);
