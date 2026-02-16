import type {
  Citizen,
  Org,
  RegistryListResponse,
  RegistryFilters,
} from './types';

const BASE_URL = '/api/registry';

export async function fetchCitizens(
  filters?: RegistryFilters,
): Promise<RegistryListResponse<Citizen>> {
  const params = new URLSearchParams();
  if (filters?.verification && filters.verification !== 'all') {
    params.set('verification', filters.verification);
  }
  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }
  if (filters?.org) {
    params.set('org', filters.org);
  }

  const res = await fetch(`${BASE_URL}/citizens?${params}`);
  if (!res.ok) throw new Error('Failed to fetch citizens');
  return res.json();
}

export async function fetchOrgs(
  filters?: RegistryFilters,
): Promise<RegistryListResponse<Org>> {
  const params = new URLSearchParams();
  if (filters?.verification && filters.verification !== 'all') {
    params.set('verification', filters.verification);
  }
  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }

  const res = await fetch(`${BASE_URL}/orgs?${params}`);
  if (!res.ok) throw new Error('Failed to fetch orgs');
  return res.json();
}
