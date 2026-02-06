/**
 * PlansPage – Página /planes con 2 tarjetas (Mensual/Anual), tabla Free vs Premium y footer Stripe.
 * Ajustar: precios (ej. 29€/mes, 290€/año), features de la tabla, rutas.
 */
import { Check, Crown, Truck } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

// Ajustar por app
const PRICE_MONTHLY = import.meta.env.VITE_STRIPE_PRICE_MONTHLY;
const PRICE_ANNUAL = import.meta.env.VITE_STRIPE_PRICE_ANNUAL;
const PRICE_MONTHLY_LABEL = '29 €/mes';
const PRICE_ANNUAL_LABEL = '290 €/año';
const FEATURES = [
  { name: 'Registros ilimitados', free: false, premium: true },
  { name: 'Viajes y planificación', free: false, premium: true },
  { name: 'Informes y KPIs', free: false, premium: true },
  { name: 'Soporte prioritario', free: false, premium: true },
];

export function PlansPage() {
  const { createCheckout, loading, error } = useStripeCheckout();

  return (
    <div className="container max-w-4xl space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Planes</h1>
        <p className="text-muted-foreground">Elige el plan que mejor se adapte a tu flota.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Mensual */}
        <Card>
          <CardHeader>
            <CardTitle>Mensual</CardTitle>
            <div className="text-4xl font-bold">{PRICE_MONTHLY_LABEL}</div>
            <p className="text-sm text-muted-foreground">Facturación mensual</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" /> Acceso completo
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" /> Cancelación cuando quieras
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => createCheckout(PRICE_MONTHLY)}
            >
              Suscribirse
            </Button>
          </CardFooter>
        </Card>

        {/* Card Anual – Ahorra 2 meses */}
        <Card className="relative border-primary shadow-lg">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Ahorra 2 meses</Badge>
          <CardHeader>
            <CardTitle>Anual</CardTitle>
            <div className="text-4xl font-bold">{PRICE_ANNUAL_LABEL}</div>
            <p className="text-sm text-muted-foreground">Facturación anual</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" /> Todo lo del plan mensual
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" /> 2 meses gratis
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={loading}
              onClick={() => createCheckout(PRICE_ANNUAL)}
            >
              <Crown className="mr-2 h-4 w-4" />
              Suscribirse
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabla comparativa */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativa Free vs Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Funcionalidad</th>
                <th className="py-2 text-center">Free</th>
                <th className="py-2 text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.name} className="border-b">
                  <td className="py-2">{f.name}</td>
                  <td className="text-center">
                    {f.free ? <Check className="mx-auto h-4 w-4 text-green-600" /> : <span className="text-muted-foreground">✗</span>}
                  </td>
                  <td className="text-center">
                    {f.premium ? <Check className="mx-auto h-4 w-4 text-green-600" /> : <span className="text-muted-foreground">✗</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {error && <p className="text-center text-destructive">{error}</p>}

      {/* Footer */}
      <footer className="flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Truck className="h-4 w-4" />
          Pago seguro procesado por Stripe
        </span>
        <span>Puedes cancelar tu suscripción en cualquier momento desde tu cuenta.</span>
      </footer>
    </div>
  );
}
