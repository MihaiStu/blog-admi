/**
 * DemoBanner – Banner superior solo para usuarios Free/Demo.
 * Colores: amber para Free, azul para Demo.
 * Ruta del botón: ajustar (ej. /planes o /tms/planes).
 */
import { AlertCircle, Crown } from 'lucide-react';
import { Link } from 'react-router-dom'; // o tu router
import { Button } from '@/components/ui/button';

const FREE_LIMIT = 5;

type PlanType = 'free' | 'demo';

interface DemoBannerProps {
  plan: PlanType;
  currentCount: number;
  /** Ruta a la página de planes (ej. /planes o /tms/planes) */
  plansPath?: string;
}

export function DemoBanner({
  plan,
  currentCount,
  plansPath = '/planes',
}: DemoBannerProps) {
  const isDemo = plan === 'demo';
  const limit = FREE_LIMIT;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm ${
        isDemo
          ? 'bg-blue-500/20 text-blue-100 border-b border-blue-500/30'
          : 'bg-amber-500/20 text-amber-100 border-b border-amber-500/30'
      }`}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>
          Plan Free: Puedes crear hasta {limit} registros. Actualiza a Premium
          para acceso ilimitado.
        </span>
        <span className="font-medium">
          Registros: {currentCount}/{limit}
        </span>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link to={plansPath}>
          <Crown className="mr-1 h-3.5 w-3.5" />
          Upgrade
        </Link>
      </Button>
    </div>
  );
}
