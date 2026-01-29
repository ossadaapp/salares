
export type SalarAmbiente = 'Costero' | 'PreAndino' | 'Andino';
export type IndexType = 'NDVI' | 'NDWI' | 'NDSI' | 'Albedo' | 'BSI' | 'Clasificación';
export type LandClass = 'Costra' | 'Tierra' | 'Agua' | 'Vegas';
export type Estacion = 'Verano' | 'Otoño' | 'Invierno' | 'Primavera';

export interface SceneConfig {
  indice: IndexType;
  anio: string;
  estacion: Estacion;
}

export interface SceneMetadata {
  title: string;
  abstract: string;
  status: string;
  topicCategory: string;
  crs: string;
  datum: string;
  spatialRepresentationType: string;
  resolution: string;
  sensor: string;
  platform: string;
  processingLevel: string;
  lineage: string;
  cloudCover: number;
  sceneId: string;
  dateStamp: string;
  sunElevation: number;
  sunAzimuth: number;
  identifier: string;
  distributionFormat: string;
}

export interface ClassStats {
  className: LandClass;
  mean: number;
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
  stdDev: number;
  variance: number;
  areaHa: number;
  count: number;
}

export interface ZonalResult {
  salarName: string;
  indexUsed: IndexType;
  timestamp: string;
  stats: ClassStats[];
  totalArea: number;
  geeCode: string;
  metadata: SceneMetadata;
}

export interface SalarData {
  nombre: string;
  ambiente: SalarAmbiente;
  lat: number;
  lng: number;
}

