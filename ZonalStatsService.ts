import { IndexType, ZonalResult, ClassStats, LandClass, SceneMetadata } from '../types';

/**
 * Simula el proceso de 'reduceRegions' de Google Earth Engine.
 * Calcula estadísticas de un índice espectral para cada polígono/clase de una clasificación.
 */
export const calculateZonalStats = async (
  salar: string,
  index: IndexType,
  year: number,
  season: string
): Promise<ZonalResult> => {
  // Simulación de latencia de procesamiento en GEE (2 segundos)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const classes: LandClass[] = ['Agua', 'Vegas', 'Costra', 'Tierra'];
  
  const stats: ClassStats[] = classes.map((cl) => {
    let baseVal = 0;
    let variation = 0.04;

    // Lógica Zonal: Los valores del índice dependen de la clase donde se miden (Intersección Real)
    if (index === 'NDWI') {
      if (cl === 'Agua') { baseVal = 0.815; variation = 0.08; } 
      else if (cl === 'Vegas') { baseVal = 0.210; variation = 0.05; }
      else { baseVal = -0.480; variation = 0.12; }
    } else if (index === 'NDVI') {
      if (cl === 'Vegas') { baseVal = 0.710; variation = 0.10; } 
      else if (cl === 'Agua') { baseVal = -0.250; variation = 0.04; }
      else { baseVal = 0.080; variation = 0.03; }
    } else if (index === 'NDSI') {
      if (cl === 'Costra') { baseVal = 0.840; variation = 0.06; }
      else { baseVal = 0.015; variation = 0.02; }
    } else if (index === 'BSI') {
      if (cl === 'Tierra') { baseVal = 0.620; variation = 0.05; }
      else if (cl === 'Costra') { baseVal = 0.410; variation = 0.08; }
      else { baseVal = -0.150; variation = 0.03; }
    } else {
      baseVal = (Math.random() * 0.4) - 0.2;
    }

    const count = Math.floor(Math.random() * 15000) + 2000;
    const area = Math.floor(count * 0.09); // ha (basado en pixel Landsat 30m)
    const stdDev = 0.02 + Math.random() * 0.04;
    const median = baseVal + (Math.random() * variation - variation/2);
    
    return {
      className: cl,
      mean: median + (Math.random() * 0.003),
      median: median,
      q1: median - 0.015,
      q3: median + 0.015,
      min: median - (variation * 1.1),
      max: median + (variation * 1.1),
      stdDev: stdDev,
      variance: Math.pow(stdDev, 2),
      areaHa: area,
      count: count
    };
  });

  const totalArea = stats.reduce((acc, s) => acc + s.areaHa, 0);

  const metadata: SceneMetadata = {
    title: `Análisis Zonal Segmentado: ${index} sobre Clasificación RF`,
    abstract: `Este reporte presenta la distribución estadística del índice ${index} calculada exclusivamente sobre las geometrías resultantes de la clasificación Random Forest para el Salar de ${salar}.`,
    status: 'Finalizado',
    topicCategory: 'Sensores Remotos',
    sensor: 'OLI-2',
    platform: 'Landsat 9',
    sceneId: `L9_${salar.toUpperCase()}_${year}_ZONAL_STATS`,
    dateStamp: new Date().toISOString().split('T')[0],
    cloudCover: 0.02,
    resolution: '30m',
    processingLevel: 'L2',
    crs: 'WGS 84 / UTM 19S',
    datum: 'WGS 84',
    spatialRepresentationType: 'Raster/Vector',
    lineage: '1. Generación de clasificación. 2. Cálculo de índice. 3. Intersección espacial. 4. Reducción estadística.',
    sunElevation: 45.2,
    sunAzimuth: 110.1,
    identifier: `ROI-${salar.substring(0,3)}-${index}`,
    distributionFormat: 'GEOTIFF/JSON'
  };

  return { 
    salarName: salar, 
    indexUsed: index, 
    timestamp: new Date().toISOString(), 
    stats, 
    totalArea, 
    geeCode: `// Earth Engine Zonal Statistics Snippet\nvar indexImg = calculate${index}(scene);\nvar zones = classification.select('label');\nvar zonalStats = indexImg.reduceRegions({\n  collection: zones.toIndices(),\n  reducer: ee.Reducer.median().combine(ee.Reducer.stdDev(), null, true),\n  scale: 30\n});`, 
    metadata 
  };
};