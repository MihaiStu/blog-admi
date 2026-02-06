# Integración Stripe Checkout – Instrucciones para Cursor

Guía para implementar el flujo **Banner Upgrade → /planes → Stripe Checkout → Webhook → DB** en la app TMS (Vite + Supabase). El código de Edge Functions, hook y componentes es reutilizable; solo cambian precios, textos y features por app.

---

## Arquitectura (igual para todas las apps)

```
Banner "Upgrade" → Página /planes → Stripe Checkout (redirect) → Webhook → DB actualizada
```

- **Frontend:** DemoBanner (solo Free/Demo), página `/planes` (2 tarjetas Mensual/Anual), sección Suscripción en Mi Cuenta.
- **Backend:** 3 Edge Functions: `create-checkout-session`, `stripe-webhook`, `create-portal-session`.
- **DB:** Columnas `stripe_customer_id`, `stripe_subscription_id`, `plan` (o equivalente) en `organizations` o tabla de suscripciones.

---

## Qué cambia por app

| Elemento | ¿Cambia? |
|----------|-----------|
| Precios en UI | Sí (ej. 29€/mes, 290€/año) |
| `VITE_STRIPE_PRICE_MONTHLY` | Sí (price_id por producto) |
| `VITE_STRIPE_PRICE_ANNUAL` | Sí |
| `VITE_STRIPE_PUBLISHABLE_KEY` | No (misma cuenta Stripe) |
| `STRIPE_SECRET_KEY` (Supabase secret) | No |
| `STRIPE_WEBHOOK_SECRET` (Supabase secret) | Sí (un webhook por proyecto Supabase) |
| Nombre producto en Stripe Dashboard | Sí |
| Features en tabla comparativa | Sí |
| Edge Functions (código) | No (mismo código) |
| URL del webhook en Stripe | Sí (por proyecto Supabase) |

---

## Checklist por app nueva

1. **Stripe Dashboard:** Crear producto + 2 precios (mensual / anual) → copiar `price_xxx`.
2. **Stripe Dashboard:** Crear webhook → `https://{SUPABASE_PROJECT}.supabase.co/functions/v1/stripe-webhook` → copiar `whsec_...`.
3. **Supabase Dashboard:** Secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `APP_URL`.
4. **Supabase SQL:** Ejecutar migración (columnas stripe en organizaciones).
5. **`.env.local`:** `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_STRIPE_PRICE_MONTHLY`, `VITE_STRIPE_PRICE_ANNUAL`.
6. **Desplegar:** `supabase functions deploy` las 3 funciones.
7. **UI:** Ajustar precios y features en la página de Planes.

---

## 1. DemoBanner (banner superior)

- **Visible:** Solo usuarios Free o Demo.
- **Estilo:** Amber/naranja para Free, azul para Demo. Icono `AlertCircle` (lucide-react).
- **Texto:** "Plan Free: Puedes crear hasta X registros. Actualiza a Premium para acceso ilimitado."
- **Contador:** "Registros: 3/5" (usar límite 5 para Free).
- **Botón:** "Upgrade", icono `Crown`, variant outline, size small → navega a `/tms/planes` (o ruta equivalente).
- **Ruta:** Ajustar a la app (ej. `/planes` si la app está en raíz).

Ver código en `docs/stripe-integration-kit/DemoBanner.tsx`.

---

## 2. Página de Planes (`/planes`)

- **Layout:** 2 tarjetas (shadcn `Card`) lado a lado en desktop, apiladas en móvil.
- **Card Mensual:** borde normal, botón variant outline.
- **Card Anual:** `border-primary`, `shadow-lg`, Badge "Ahorra 2 meses" posicionado `absolute -top-3`.
- **Contenido por card:** nombre plan, precio grande (`text-4xl font-bold`), precio/periodo, botón "Suscribirse". Iconos: `Check` (verde) para beneficios, `Crown` en botón anual.
- **Debajo:** Tabla comparativa Free vs Premium (Check verde / X gris por feature).
- **Footer:** Icono `Truck` + "Pago seguro procesado por Stripe" + texto cancelación.

Ver código en `docs/stripe-integration-kit/PlansPage.tsx`.

---

## 3. Sección Suscripción (Mi Cuenta / Perfil)

- **Card** con icono `CreditCard` en el título.
- **Badge** plan actual: "Premium" (primary) o "Free" (secondary); icono Crown si premium.
- **Botón:** Si premium → "Gestionar suscripción" (Stripe Customer Portal). Si free → "Upgrade a Premium" → `/planes`.

Ver código en `docs/stripe-integration-kit/SubscriptionCard.tsx`.

---

## 4. Hook `useStripeCheckout`

- Llama a la Edge Function `create-checkout-session` con `priceId` y `successUrl`/`cancelUrl`.
- Redirige a `session.url` (Stripe Checkout).
- Mismo código para todas las apps; los `priceId` vienen de env.

Ver código en `docs/stripe-integration-kit/useStripeCheckout.ts`.

---

## 5. Edge Functions (Supabase)

- **create-checkout-session:** Crea `stripe.checkout.sessions.create` con `customer_email` o `customer` si existe, `line_items`, `mode: 'subscription'`, `success_url`, `cancel_url`, `metadata.organization_id` (o user_id). Devuelve `{ url }`.
- **stripe-webhook:** Verifica firma con `STRIPE_WEBHOOK_SECRET`, maneja `checkout.session.completed` y `customer.subscription.updated/deleted`, actualiza DB (plan, stripe_customer_id, stripe_subscription_id).
- **create-portal-session:** Crea `stripe.billingPortal.sessions.create` con `customer`, `return_url`. Devuelve `{ url }`.

Ver código en `docs/stripe-integration-kit/supabase/functions/`.

---

## 6. Migración SQL (Supabase)

Añadir a la tabla de organizaciones (o usuarios) algo como:

```sql
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
```

Ajustar nombres de tabla/columnas al esquema real.

---

## 7. Variables de entorno

**Frontend (.env.local):**

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PRICE_MONTHLY=price_xxx
VITE_STRIPE_PRICE_ANNUAL=price_yyy
```

**Supabase secrets:**

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `APP_URL` (ej. https://tms.admilogistic.es)

---

## Ubicación del kit de código

El código listo para copiar/pegar está en:

- `docs/stripe-integration-kit/DemoBanner.tsx`
- `docs/stripe-integration-kit/PlansPage.tsx`
- `docs/stripe-integration-kit/SubscriptionCard.tsx`
- `docs/stripe-integration-kit/useStripeCheckout.ts`
- `docs/stripe-integration-kit/supabase/functions/create-checkout-session/index.ts`
- `docs/stripe-integration-kit/supabase/functions/stripe-webhook/index.ts`
- `docs/stripe-integration-kit/supabase/functions/create-portal-session/index.ts`
- `docs/stripe-integration-kit/migration-stripe-organizations.sql`

Abre el **repositorio de la app TMS** en Cursor y, siguiendo esta guía, copia los archivos del kit y adapta rutas, precios y features.
