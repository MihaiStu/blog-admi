-- Migración: columnas Stripe en organizaciones (ajustar nombre de tabla si usas otra).
-- Ejecutar en Supabase SQL Editor.

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';

-- Índices opcionales para búsquedas por Stripe
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer
  ON organizations (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_organizations_plan
  ON organizations (plan);
