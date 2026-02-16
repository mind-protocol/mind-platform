export type VerificationState =
  | 'unverified'
  | 'pending'
  | 'provisional'
  | 'verified'
  | 'rejected';

export type EntityStatus = 'active' | 'pending' | 'suspended';

export interface Citizen {
  id: string;
  name: string;
  wallet?: string;
  org_membership?: string;
  org_name?: string;
  status: EntityStatus;
  registered_date: string;
  capabilities: string[];
  verification: VerificationState;
}

export interface Org {
  id: string;
  name: string;
  wallet?: string;
  endpoint?: string;
  status: EntityStatus;
  registered_date: string;
  citizen_count: number;
  verification: VerificationState;
}

export interface RegistryListResponse<T> {
  items: T[];
  count: number;
  hasMore: boolean;
}

export interface RegistryFilters {
  verification?: VerificationState | 'all';
  status?: EntityStatus | 'all';
  org?: string;
  q?: string;
}
