-- CAK AI Content & Marketing Strategist Platform
-- Supabase (PostgreSQL) DDL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  guidelines_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BRIEFS
CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  source_pdf_url TEXT,
  goals TEXT,
  deadline DATE,
  problem_statement TEXT,
  raw_extracted_json JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'draft', -- draft, confirmed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SWOT_ANALYSES
CREATE TABLE IF NOT EXISTS swot_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  strengths TEXT,
  weaknesses TEXT,
  opportunities TEXT,
  threats TEXT,
  competitors_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PERSONAS
CREATE TABLE IF NOT EXISTS personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  persona_type VARCHAR(100),
  reasoning TEXT,
  quantity_per_month INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACCOUNTS
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES personas(id) ON DELETE SET NULL,
  username VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- tiktok, instagram
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STYLE_REFERENCES
CREATE TABLE IF NOT EXISTS style_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  platform VARCHAR(50),
  mood TEXT,
  visual_style TEXT,
  tone TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTENT_PLANS
CREATE TABLE IF NOT EXISTS content_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
  month VARCHAR(50) NOT NULL,
  quantity_target INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft', -- draft, approved, exported
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONTENT_ITEMS
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_plan_id UUID REFERENCES content_plans(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES personas(id) ON DELETE SET NULL,
  hook TEXT,
  format VARCHAR(100), -- video, carousel, image
  scheduled_date DATE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, production, published
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. POSTS (Raw scrape data)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  posted_at TIMESTAMPTZ,
  template_name VARCHAR(255),
  template_mode VARCHAR(100),
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  saves INT DEFAULT 0,
  shares INT DEFAULT 0,
  engagement_rate NUMERIC(6,4),
  type VARCHAR(50), -- video, carousel
  description TEXT,
  hashtags TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FOLLOWER_SNAPSHOTS
CREATE TABLE IF NOT EXISTS follower_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  follower_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REPORTS
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report_type VARCHAR(50) DEFAULT 'weekly', -- weekly, batch, monthly
  narrative_overview TEXT,
  narrative_conclusion TEXT,
  excel_url TEXT,
  ppt_url TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, narrative_review, approved, sent
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. REPORT_METRICS
CREATE TABLE IF NOT EXISTS report_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  metric_name VARCHAR(255) NOT NULL,
  metric_value NUMERIC(14,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recommended Indexes
CREATE INDEX IF NOT EXISTS idx_posts_account_posted ON posts(account_id, posted_at);
CREATE INDEX IF NOT EXISTS idx_follower_account_week ON follower_snapshots(account_id, week_start);
CREATE INDEX IF NOT EXISTS idx_reports_brand_period ON reports(brand_id, period_start, period_end);
