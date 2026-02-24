export interface MedicalIdentity {
  full_name: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  blood_type: string;
  organ_donor: boolean;
  laterality: string;
}

export interface CurrentStatus {
  age: number;
  computed_age?: number;
  height_cm: number;
  weight_kg: number;
  bmi: number;
}

export interface Pathology {
  condition: string;
  details?: string;
  status: 'active' | 'monitoring' | 'resolved';
}

export interface Medication {
  name: string;
  dose_mg: number;
  schedule: string;
  type: string;
  frequency: 'daily' | 'prn';
}

export interface BirthData {
  date: string;
  time: string;
  day: string;
  location: string;
  term_weeks: number;
  delivery: string;
  birth_weight_g: number;
  birth_height_cm: number;
  head_circumference_cm: number;
  chest_circumference_cm: number;
  apgar_1min: number;
  apgar_5min: number;
  resuscitation: boolean;
  autonomous_breathing: string;
  feeding: string;
  discharge_date: string;
  discharge_weight_g: number;
  attending_doctor: string;
}

export interface GrowthPoint {
  date: string;
  age_years: number;
  age_label: string;
  weight_kg: number | null;
  height_cm: number | null;
  head_circ_cm: number | null;
  notes: string;
}

export interface VaccinationDose {
  date: string;
  dose?: string;
  vaccine?: string;
  doctor?: string;
  lot?: string;
  notes?: string;
}

export interface VaccinationGroup {
  [key: string]: VaccinationDose[] | { done?: boolean; date?: string; method?: string; doctor?: string; result?: string; [key: string]: unknown };
}

export interface SchoolExam {
  date: string;
  age: string;
  exam: string;
  weight_kg?: number;
  height_cm?: number;
  blood_pressure?: string;
  hearing?: string;
  vision?: string;
  vision_OD?: string;
  vision_OG?: string;
  conclusion: string;
  doctor: string;
}

export interface ChildhoodEvent {
  date: string;
  event: string;
}

export interface DoctorRecord {
  name: string;
  role: string;
  location?: string;
  phone?: string;
  n_ordre?: number | string;
  period: string;
}

export interface MedicalProfile {
  identity: MedicalIdentity;
  current_status: CurrentStatus;
  allergies: string[];
  current_pathologies: Pathology[];
  current_medications: Medication[];
  birth: BirthData;
  neonatal_screening: Record<string, unknown>;
  growth_curve: GrowthPoint[];
  vaccinations: VaccinationGroup;
  childhood_medical_history: ChildhoodEvent[];
  childhood_supplements: Array<{ name: string; dose?: string; period: string }>;
  childhood_feeding: Record<string, string>;
  school_medical_exams: SchoolExam[];
  doctors_history: DoctorRecord[];
  growth_charts?: Record<string, string>;
  last_updated: string;
}
