import type { Allergen, Menu, MenuItem } from '@/domain/models';
import type { ApiClient } from '@/lib/api/ApiClient';

export interface MenuFilter {
  excludeAllergens?: readonly Allergen[];
  category?: string | null;
  featuredOnly?: boolean;
}

export class MenuCatalog {
  public constructor(private readonly api: ApiClient) {}

  public getMenu(filter: MenuFilter = {}): Promise<Menu> {
    return this.api.get<Menu>('/menu', {
      excludeAllergens: filter.excludeAllergens ?? [],
      category: filter.category ?? null,
      featured: filter.featuredOnly ? 'true' : null,
    });
  }

  public async getFeatured(limit: number): Promise<{ items: MenuItem[]; currencyCode: string }> {
    const menu = await this.getMenu({ featuredOnly: true });
    return { items: menu.categories.flatMap((category) => category.items).slice(0, limit), currencyCode: menu.currencyCode };
  }
}
