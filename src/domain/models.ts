export const LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const TABLE_STATUSES = ['available', 'occupied', 'reserved', 'clearing_soon'] as const;
export type TableStatus = (typeof TABLE_STATUSES)[number];
export type TableShape = 'round' | 'square' | 'rectangle' | 'bar_counter' | 'tatami';

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
export type WaitlistStatus = 'waiting' | 'notified' | 'seated' | 'cancelled' | 'no_show';
export type AssignmentStrategy = 'single_table' | 'merge_tables' | 'wait_for_table' | 'alternative_zone';
export type MenuItemKind = 'food' | 'drink';
export type ServiceShift = 'lunch' | 'dinner';

export const ALLERGENS = [
  'fish',
  'shellfish',
  'soy',
  'gluten',
  'sesame',
  'egg',
  'dairy',
  'tree_nuts',
  'peanuts',
  'sulfites',
  'alcohol',
] as const;
export type Allergen = (typeof ALLERGENS)[number];

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'raw'
  | 'cooked'
  | 'spicy'
  | 'signature'
  | 'seasonal'
  | 'non_alcoholic';

export interface Zone {
  id: string;
  code: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  isPremium: boolean;
  displayOrder: number;
}

export interface ServiceHour {
  dayOfWeek: number;
  shift: ServiceShift;
  opensAt: string;
  lastSeatingAt: string;
  closesAt: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  timezone: string;
  currencyCode: string;
  defaultDiningMinutes: number;
  turnoverBufferMinutes: number;
  reservationSlotMinutes: number;
  maxPartySize: number;
  reservedHoldMinutes: number;
}

export interface RestaurantInfo {
  settings: RestaurantSettings;
  serviceHours: ServiceHour[];
  zones: Zone[];
  localNow: { date: string; time: string; dayOfWeek: number };
}

export interface MenuItem {
  id: string;
  categoryId: string;
  categorySlug: string;
  kind: MenuItemKind;
  slug: string;
  name: string;
  nameJa: string;
  descriptionEs: string;
  descriptionEn: string;
  price: number;
  allergens: Allergen[];
  dietaryTags: DietaryTag[];
  spiceLevel: number;
  pieces: number | null;
  alcoholPercentage: number | null;
  pairingNotesEs: string | null;
  pairingNotesEn: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export interface MenuCategory {
  id: string;
  slug: string;
  kind: MenuItemKind;
  nameEs: string;
  nameEn: string;
  nameJa: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface Menu {
  currencyCode: string;
  excludedAllergens: Allergen[];
  categories: MenuCategory[];
}

export interface DiningTable {
  id: string;
  code: string;
  capacity: number;
  minCapacity: number;
  shape: TableShape;
  status: TableStatus;
  effectiveStatus: TableStatus;
  position: { x: number; y: number };
  isCombinable: boolean;
  isActive: boolean;
  statusChangedAt: string;
  zone: { id: string; code: string; nameEs: string; nameEn: string };
  currentSeating: {
    seatingId: string;
    guestName: string;
    partySize: number;
    seatedAt: string;
    expectedEndAt: string;
    minutesSeated: number;
    minutesRemaining: number;
  } | null;
  nextReservation: {
    reservationId: string;
    reservationCode: string;
    guestName: string;
    partySize: number;
    reservedAt: string;
    minutesUntil: number;
  } | null;
}

export interface Reservation {
  id: string;
  reservationCode: string;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string;
  partySize: number;
  reservedAt: string;
  endsAt: string;
  durationMinutes: number;
  preferredZone: { id: string; code: string; nameEs: string; nameEn: string } | null;
  status: ReservationStatus;
  specialRequests: string | null;
  dietaryRestrictions: Allergen[];
  language: Language;
  tables: Array<{ id: string; code: string }>;
  seatedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface AvailabilityOption {
  tables: Array<{ id: string; code: string }>;
  zoneCode: string;
  capacity: number;
  isMerged: boolean;
}

export interface LocalSlot {
  date: string;
  time: string;
}

export interface Availability {
  date: string;
  time: string;
  partySize: number;
  isBookable: boolean;
  durationMinutes: number;
  options: AvailabilityOption[];
  alternativeTimes: LocalSlot[];
}

export interface SlotAvailability {
  time: string;
  shift: string;
  isBookable: boolean;
  options: number;
}

export interface ZoneFit {
  zoneId: string;
  zoneCode: string;
  minPartySize: number;
  maxPartySize: number;
  fitsParty: boolean;
}

export interface DayAvailability {
  date: string;
  partySize: number;
  zoneId: string | null;
  isOpen: boolean;
  slots: SlotAvailability[];
  zones: ZoneFit[];
}

export interface NewReservation {
  guestName: string;
  guestEmail: string | null;
  guestPhone: string;
  partySize: number;
  date: string;
  time: string;
  preferredZoneId: string | null;
  specialRequests: string | null;
  dietaryRestrictions: Allergen[];
}

export interface PredictedTable {
  id: string;
  code: string;
  zoneCode: string;
  capacity: number;
}

export interface WaitEstimate {
  predictionId: string | null;
  estimatedWaitMinutes: number;
  confidence: number;
  strategy: AssignmentStrategy;
  tables: PredictedTable[];
  reasoning: string;
  alternatives: Array<{
    strategy: AssignmentStrategy;
    tables: PredictedTable[];
    estimatedWaitMinutes: number;
    note: string;
  }>;
  model: string;
  isFallback: boolean;
  generatedAt: string;
}

export interface CreatedReservation {
  reservation: Reservation;
  assignment: WaitEstimate;
}

export interface WaitlistEntry {
  id: string;
  ticketCode: string;
  guestName: string;
  guestPhone: string;
  partySize: number;
