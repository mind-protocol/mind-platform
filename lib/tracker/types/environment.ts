export type EnvironmentType = 'panorama' | 'mesh' | 'splat' | 'composite';

export interface EnvironmentGeo {
  lat: number;
  lng: number;
  location_name?: string;
}

export interface CompositeEnvironmentData {
  splat_url?: string;
  splat_filename?: string;
  mesh_url?: string;
  mesh_filename?: string;
  audio_url?: string;
  audio_filename?: string;
}

export interface EnvironmentCapture {
  id: string;
  ts: string;
  name: string;
  type: EnvironmentType;
  filename: string;
  url: string;
  size_bytes: number;
  active: boolean;
  source: string;
  notes: string;
  geo?: EnvironmentGeo;
  composite?: CompositeEnvironmentData;
}
