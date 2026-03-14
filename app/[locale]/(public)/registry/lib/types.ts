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
  description?: string | null;
  emoji?: string | null;
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
  description?: string | null;
  type?: string | null;
  color?: string | null;
  wallet?: string;
  endpoint?: string;
  status: EntityStatus;
  registered_date: string;
  citizen_count: number;
  verification: VerificationState;
  github_repository?: string | null;
  org_type?: string | null;
  universe?: string | null;
}

export interface RegistryListResponse<T> {
  items: T[];
  count: number;
  hasMore: boolean;
}

export interface CitizenDetail extends Citizen {
  org_details?: Org | null;
}

export interface OrgDetail extends Org {
  members: Citizen[];
}

export interface RegistryFilters {
  verification?: VerificationState | 'all';
  status?: EntityStatus | 'all';
  org?: string;
  q?: string;
}
