/**
 * useStripeCheckout – Crea sesión de Stripe Checkout y redirige.
 * Mismo código para todas las apps; price IDs vienen de env.
 */
import { useCallback, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react'; // o tu cliente

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export function useStripeCheckout() {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckout = useCallback(
    async (priceId: string, successPath = '/dashboard', cancelPath = '/planes') => {
      setLoading(true);
      setError(null);
      const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setError('Debes iniciar sesión');
          return;
        }
        const res = await fetch(`${FUNCTIONS_URL}/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            priceId,
            successUrl: `${appUrl}${successPath}`,
            cancelUrl: `${appUrl}${cancelPath}`,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al crear la sesión');
        if (json.url) window.location.href = json.url;
        else throw new Error('No se recibió URL de checkout');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al iniciar el pago');
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  return { createCheckout, loading, error };
}
