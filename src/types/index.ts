export type ReportCategory =
  | "bos_ofis_isigi"
  | "reklam_panosu"
  | "sokak_lambasi"
  | "otopark"
  | "diger";

export interface Report {
  id: string;
  lat: number;
  lng: number;
  category: ReportCategory;
  description: string;
  image_url: string | null;
  created_at: string;
}

export interface Anomaly {
  id: string;
  lat: number;
  lng: number;
  score: number; // 0-100, yüksek = daha fazla israf
  light_intensity: number;
  expected_intensity: number;
  zone_id: string;
  poi_type: string;
  created_at: string;
}

export interface Zone {
  id: string;
  name: string;
  geojson: GeoJSON.Feature;
  anomaly_count: number;
  potential_saving_kwh: number;
  current_kwh: number;
}

export type ScenarioKey = "current" | "recommended" | "aggressive";

export interface Scenario {
  key: ScenarioKey;
  label: string;
  kwh_per_year: number;
  saving_percent: number;
  cost_saving_tl: number;
}

export type LayerConfig = {
  heatmap: boolean;
  reports: boolean;
  anomalies: boolean;
};

export type UserRole = "citizen" | "municipality";
