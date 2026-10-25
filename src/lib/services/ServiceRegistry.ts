import { ApiClient } from '@/lib/api/ApiClient';
import { staffSession } from '@/lib/auth/StaffSessionStore';
import { languageManager } from '@/lib/i18n/LanguageManager';
import { HostOperations } from './HostOperations';
import { MenuCatalog } from './MenuCatalog';
import { ReservationManager } from './ReservationManager';
import { RestaurantDirectory } from './RestaurantDirectory';
import { StaffAuth } from './StaffAuth';
import { WaitlistManager } from './WaitlistManager';

const DEFAULT_API_URL = 'http://localhost:4000/api';

export class ServiceRegistry {
  private static instance: ServiceRegistry | null = null;

  public readonly api: ApiClient;
  public readonly restaurant: RestaurantDirectory;
  public readonly menu: MenuCatalog;
  public readonly reservations: ReservationManager;
  public readonly waitlist: WaitlistManager;
  public readonly host: HostOperations;
  public readonly auth: StaffAuth;
