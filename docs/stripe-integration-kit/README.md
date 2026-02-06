# Kit de integración Stripe Checkout

Código listo para copiar en la **app TMS** (Vite + Supabase). Este repositorio es el blog; la app donde integrar Stripe está en otro repo.

## Contenido

| Archivo | Uso |
|---------|-----|
| `DemoBanner.tsx` | Banner superior para usuarios Free/Demo. Ajustar `plansPath` (ej. `/tms/planes`). |
| `PlansPage.tsx` | Página `/planes`: 2 tarjetas, tabla Free vs Premium, footer. Ajustar precios y `FEATURES`. |
| `SubscriptionCard.tsx` | Sección en Mi Cuenta: Badge plan + botón Gestionar / Upgrade. |
| `useStripeCheckout.ts` | Hook que llama a `create-checkout-session` y redirige. Ajustar `VITE_SUPABASE_URL`. |
| `supabase/functions/create-checkout-session/index.ts` | Edge Function: crea sesión Checkout. |
| `supabase/functions/stripe-webhook/index.ts` | Edge Function: webhook Stripe, actualiza `organizations`. Ajustar tabla/columnas si no usas `organizations`. |
| `supabase/functions/create-portal-session/index.ts` | Edge Function: Portal de facturación. |
| `migration-stripe-organizations.sql` | SQL para añadir columnas stripe a la tabla de organizaciones. |

## Pasos en la app TMS

1. Copiar Edge Functions a `supabase/functions/` del proyecto TMS.
2. Añadir secrets en Supabase: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `APP_URL`.
3. Ejecutar `migration-stripe-organizations.sql` (ajustar nombre de tabla si hace falta).
4. Copiar hook y componentes; instalar `lucide-react` y componentes shadcn (Card, Button, Badge).
5. Configurar `.env.local`: `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_STRIPE_PRICE_MONTHLY`, `VITE_STRIPE_PRICE_ANNUAL`, `VITE_SUPABASE_URL`.
6. En Stripe: crear producto + precios, webhook apuntando a `https://<project>.supabase.co/functions/v1/stripe-webhook`.
7. Desplegar: `supabase functions deploy create-checkout-session stripe-webhook create-portal-session`.

Ver **STRIPE_CHECKOUT_INTEGRATION.md** en `docs/` para arquitectura y checklist completa.
