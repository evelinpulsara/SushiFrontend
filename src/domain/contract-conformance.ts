import type { components } from './api-contract';
import type {
  AIAccuracy,
  Availability,
  StaffMember,
  StaffSession,
  DayAvailability,
  SlotAvailability,
  ZoneFit,
  ConciergeTurn,
  CreatedReservation,
  DashboardOverview,
  DiningTable,
  JoinedWaitlist,
  LiveKpis,
  Menu,
  MenuItem,
  NewReservation,
  NewWaitlistEntry,
  Reservation,
  RestaurantInfo,
  SeatSuggestion,
  WaitEstimate,
  WaitlistEntry,
  Zone,
} from './models';

type Schemas = components['schemas'];

type Equivalent<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Assert<T extends true> = T;

export type ContractConformance = [
  Assert<Equivalent<Zone, Schemas['Zone']>>,
  Assert<Equivalent<RestaurantInfo, Schemas['RestaurantInfo']>>,
  Assert<Equivalent<MenuItem, Schemas['MenuItem']>>,
  Assert<Equivalent<Menu, Schemas['Menu']>>,
  Assert<Equivalent<DiningTable, Schemas['DiningTable']>>,
  Assert<Equivalent<Reservation, Schemas['Reservation']>>,
  Assert<Equivalent<Availability, Schemas['Availability']>>,
  Assert<Equivalent<StaffMember, Schemas['StaffMember']>>,
  Assert<Equivalent<StaffSession, Schemas['StaffSession']>>,
  Assert<Equivalent<DayAvailability, Schemas['DayAvailability']>>,
  Assert<Equivalent<SlotAvailability, Schemas['SlotAvailability']>>,
  Assert<Equivalent<ZoneFit, Schemas['ZoneFit']>>,
  Assert<Equivalent<WaitEstimate, Schemas['WaitEstimate']>>,
  Assert<Equivalent<CreatedReservation, Schemas['CreatedReservation']>>,
  Assert<Equivalent<WaitlistEntry, Schemas['WaitlistEntry']>>,
  Assert<Equivalent<JoinedWaitlist, Schemas['JoinedWaitlist']>>,
  Assert<Equivalent<SeatSuggestion, Schemas['SeatSuggestion']>>,
  Assert<Equivalent<ConciergeTurn, Schemas['ConciergeTurn']>>,
  Assert<Equivalent<LiveKpis, Schemas['LiveKpis']>>,
  Assert<Equivalent<DashboardOverview, Schemas['DashboardOverview']>>,
  Assert<Equivalent<AIAccuracy, Schemas['AIAccuracy']>>,
  Assert<NewReservation extends Schemas['NewReservation'] ? true : false>,
  Assert<NewWaitlistEntry extends Schemas['NewWaitlistEntry'] ? true : false>,
];
