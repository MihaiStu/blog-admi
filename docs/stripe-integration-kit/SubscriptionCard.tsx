/**
 * SubscriptionCard – Sección Suscripción en Mi Cuenta / Perfil.
 * Badge con plan actual; botón "Gestionar suscripción" (Portal) o "Upgrade a Premium" (/planes).
 */
import { useState } from 'react';
import { CreditCard, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

type Plan = 'free' | 'premium';

interface SubscriptionCardProps {
  plan: Plan;
  /** Ruta a planes (ej. /planes) */
  plansPath?: string;
}

export function SubscriptionCard({ plan, plansPath = '/planes' }: SubscriptionCardProps) {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ returnUrl: window.location.href }),
        }
      );
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Suscripción
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={plan === 'premium' ? 'default' : 'secondary'}>
            {plan === 'premium' && <Crown className="mr-1 h-3 w-3" />}
            {plan === 'premium' ? 'Premium' : 'Free'}
          </Badge>
        </div>
        {plan === 'premium' ? (
          <Button onClick={handleManageSubscription} disabled={loading}>
            Gestionar suscripción
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate(plansPath)}>
            <Crown className="mr-2 h-4 w-4" />
            Upgrade a Premium
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
