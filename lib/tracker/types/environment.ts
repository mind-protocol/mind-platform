export type EnvironmentType = 'panorama' | 'mesh' | 'splat';

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
}
