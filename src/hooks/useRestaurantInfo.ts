'use client';

import type { RestaurantInfo, Zone } from '@/domain/models';
import { services } from '@/lib/services/ServiceRegistry';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { useResource, type Resource } from './useResource';

export function useRestaurantInfo(): Resource<RestaurantInfo> & { zoneName: (code: string | null | undefined) => string } {
  const { pick } = useI18n();
  const resource = useResource('restaurant-info', () => services().restaurant.getInfo());
  const zones: Zone[] = resource.data?.zones ?? [];

  return {
    ...resource,
    zoneName: (code) => {
      const zone = zones.find((candidate) => candidate.code === code);
      return zone ? pick(zone, 'name') : (code ?? '');
    },
  };
}
