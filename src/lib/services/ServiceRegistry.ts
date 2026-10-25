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

  private constructor() {
    this.api = new ApiClient(
      process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
      () => languageManager.language,
      () => staffSession.token,
      () => staffSession.expire(),
    );
    this.restaurant = new RestaurantDirectory(this.api);
    this.menu = new MenuCatalog(this.api);
    this.reservations = new ReservationManager(this.api);
    this.waitlist = new WaitlistManager(this.api);
    this.host = new HostOperations(this.api);
    this.auth = new StaffAuth(this.api, staffSession);
  }

  public static get(): ServiceRegistry {
    ServiceRegistry.instance ??= new ServiceRegistry();
    return ServiceRegistry.instance;
  }
}

export const services = (): ServiceRegistry => ServiceRegistry.get();
