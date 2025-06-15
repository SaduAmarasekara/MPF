"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: any;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings = [0];

// Helper function to validate coordinate values
const isValidCoordinate = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

// Helper function to validate position data
const validatePosition = (pos: Position): boolean => {
  return (
    isValidCoordinate(pos.startLat) &&
    isValidCoordinate(pos.startLng) &&
    isValidCoordinate(pos.endLat) &&
    isValidCoordinate(pos.endLng) &&
    isValidCoordinate(pos.arcAlt) &&
    pos.startLat >= -90 && pos.startLat <= 90 &&
    pos.endLat >= -90 && pos.endLat <= 90 &&
    pos.startLng >= -180 && pos.startLng <= 180 &&
    pos.endLng >= -180 && pos.endLng <= 180
  );
};

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

  const globeRef = useRef<ThreeGlobe | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    try {
      const globeMaterial = globeRef.current.globeMaterial() as unknown as {
        color: Color;
        emissive: Color;
        emissiveIntensity: number;
        shininess: number;
      };
      globeMaterial.color = new Color(defaultProps.globeColor);
      globeMaterial.emissive = new Color(defaultProps.emissive);
      globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity || 0.1;
      globeMaterial.shininess = defaultProps.shininess || 0.9;
    } catch (error) {
      console.error("Error building material:", error);
    }
  };

  const _buildData = () => {
    console.log("Building data with input:", data);
    
    if (!data || data.length === 0) {
      console.log("No data provided, setting empty array");
      setGlobeData([]);
      return;
    }

    // Filter out invalid data first
    const validArcs = data.filter((arc) => {
      const isValid = validatePosition(arc);
      if (!isValid) {
        console.warn("Invalid position data:", arc);
      }
      return isValid;
    });

    console.log(`Valid arcs: ${validArcs.length} out of ${data.length}`);

    if (validArcs.length === 0) {
      console.warn("No valid arc data found, using empty data");
      setGlobeData([]);
      return;
    }

    let points = [];
    
    for (let i = 0; i < validArcs.length; i++) {
      const arc = validArcs[i];
      const rgb = hexToRgb(arc.color);
      
      if (!rgb) {
        console.warn(`Invalid color: ${arc.color}, skipping arc`);
        continue;
      }
      
      // Double-check coordinates before adding
      const startLat = Number(arc.startLat);
      const startLng = Number(arc.startLng);
      const endLat = Number(arc.endLat);
      const endLng = Number(arc.endLng);
      
      if (isValidCoordinate(startLat) && isValidCoordinate(startLng)) {
        points.push({
          size: Math.max(0.1, defaultProps.pointSize),
          order: Math.max(0, arc.order || 0),
          color: (t: number) => {
            const alpha = Math.max(0, Math.min(1, 1 - (t || 0)));
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          },
          lat: startLat,
          lng: startLng,
        });
      }
      
      if (isValidCoordinate(endLat) && isValidCoordinate(endLng)) {
        points.push({
          size: Math.max(0.1, defaultProps.pointSize),
          order: Math.max(0, arc.order || 0),
          color: (t: number) => {
            const alpha = Math.max(0, Math.min(1, 1 - (t || 0)));
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          },
          lat: endLat,
          lng: endLng,
        });
      }
    }

    // Remove duplicates and validate final points
    const filteredPoints = points.filter(
      (v, i, a) => {
        // Check for duplicates
        const isDuplicate = a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
          )
        ) !== i;
        
        // Double-check validity
        const isValid = isValidCoordinate(v.lat) && isValidCoordinate(v.lng);
        
        return !isDuplicate && isValid;
      }
    );

    console.log(`Built ${filteredPoints.length} valid points from ${data.length} input positions`);
    
    // Log first few points for debugging
    if (filteredPoints.length > 0) {
      console.log("Sample points:", filteredPoints.slice(0, 3));
    }
    
    setGlobeData(filteredPoints);
  };

  useEffect(() => {
    if (globeRef.current && !isInitialized) {
      console.log("Initializing globe...");
      try {
        _buildData();
        _buildMaterial();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error during globe initialization:", error);
      }
    }
  }, [globeRef.current, data, isInitialized]);

  useEffect(() => {
    if (globeRef.current && globeData && countries?.features && isInitialized) {
      console.log("Setting up globe with data:", globeData.length, "points");
      try {
        // First, clear any existing data
        globeRef.current
          .arcsData([])
          .pointsData([])
          .ringsData([]);

        // Set up the basic globe
        globeRef.current
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.7)
          .showAtmosphere(defaultProps.showAtmosphere)
          .atmosphereColor(defaultProps.atmosphereColor)
          .atmosphereAltitude(defaultProps.atmosphereAltitude)
          .hexPolygonColor(() => defaultProps.polygonColor);
        
        // Small delay before starting animation to ensure globe is ready
        setTimeout(() => {
          startAnimation();
        }, 100);
      } catch (error) {
        console.error("Error setting up globe:", error);
      }
    }
  }, [globeData, isInitialized]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData || !data || !isInitialized) {
      console.log("Cannot start animation - missing requirements");
      return;
    }

    // Filter valid data again for animations
    const validData = data.filter(validatePosition);
    
    if (validData.length === 0) {
      console.warn("No valid data for animation");
      return;
    }

    console.log("Starting animation with", validData.length, "valid data points");

    try {
      // Set up arcs with extra safety
      globeRef.current
        .arcsData(validData)
        .arcStartLat((d) => {
          const lat = Number((d as { startLat: number }).startLat);
          const safeLat = isValidCoordinate(lat) ? Math.max(-90, Math.min(90, lat)) : 0;
          return safeLat;
        })
        .arcStartLng((d) => {
          const lng = Number((d as { startLng: number }).startLng);
          const safeLng = isValidCoordinate(lng) ? Math.max(-180, Math.min(180, lng)) : 0;
          return safeLng;
        })
        .arcEndLat((d) => {
          const lat = Number((d as { endLat: number }).endLat);
          const safeLat = isValidCoordinate(lat) ? Math.max(-90, Math.min(90, lat)) : 0;
          return safeLat;
        })
        .arcEndLng((d) => {
          const lng = Number((d as { endLng: number }).endLng);
          const safeLng = isValidCoordinate(lng) ? Math.max(-180, Math.min(180, lng)) : 0;
          return safeLng;
        })
        .arcColor((e: any) => (e as { color: string }).color || "#ffffff")
        .arcAltitude((e) => {
          const alt = Number((e as { arcAlt: number }).arcAlt);
          return isValidCoordinate(alt) ? Math.max(0.01, Math.min(1, alt)) : 0.1;
        })
        .arcStroke(() => {
          const stroke = [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
          return isValidCoordinate(stroke) ? stroke : 0.3;
        })
        .arcDashLength(Math.max(0.1, Math.min(1, defaultProps.arcLength)))
        .arcDashInitialGap((e) => {
          const gap = Number((e as { order: number }).order);
          return isValidCoordinate(gap) ? Math.max(0, gap) : 0;
        })
        .arcDashGap(15)
        .arcDashAnimateTime(() => Math.max(100, defaultProps.arcTime));

      // Set up points with validation
      const validPointData = validData.filter(d => 
        isValidCoordinate(d.startLat) && isValidCoordinate(d.startLng) &&
        isValidCoordinate(d.endLat) && isValidCoordinate(d.endLng)
      );

      globeRef.current
        .pointsData(validPointData)
        .pointColor((e) => (e as { color: string }).color || "#ffffff")
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2);

      // Set up rings with minimal data initially
      globeRef.current
        .ringsData([])
        .ringColor((e: any) => (t: any) => {
          if (typeof e.color === 'function') {
            return e.color(t);
          }
          return e.color || "#ffffff";
        })
        .ringMaxRadius(Math.max(1, defaultProps.maxRings))
        .ringPropagationSpeed(Math.max(0.1, RING_PROPAGATION_SPEED))
        .ringRepeatPeriod(
          Math.max(100, (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings)
        );

      console.log("Animation setup complete");
    } catch (error) {
      console.error("Error starting animation:", error);
      // Fallback: try with minimal setup
      try {
        globeRef.current
          .arcsData([])
          .pointsData([])
          .ringsData([]);
      } catch (fallbackError) {
        console.error("Fallback setup also failed:", fallbackError);
      }
    }
  };

  useEffect(() => {
    if (!globeRef.current || !globeData || !data.length) return;

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return;
      
      try {
        const validDataLength = data.filter(validatePosition).length;
        if (validDataLength === 0) return;

        numbersOfRings = genRandomNumbers(
          0,
          validDataLength,
          Math.floor((validDataLength * 4) / 5)
        );

        const ringData = globeData.filter((d, i) => {
          // Validate each ring data point
          return numbersOfRings.includes(i) && 
                 isValidCoordinate(d.lat) && 
                 isValidCoordinate(d.lng);
        });

        globeRef.current.ringsData(ringData);
      } catch (error) {
        console.error("Error updating rings:", error);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeRef.current, globeData, data]);

  return <threeGlobe ref={globeRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    try {
      gl.setPixelRatio(window.devicePixelRatio);
      gl.setSize(size.width, size.height);
      gl.setClearColor(0x000000, 0);
    } catch (error) {
      console.error("Error configuring WebGL renderer:", error);
    }
  }, [gl, size]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  
  // Create scene with error handling
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  
  return (
    <Canvas 
      scene={scene} 
      camera={new PerspectiveCamera(50, aspect, 180, 1800)}
      onError={(error) => console.error("Canvas error:", error)}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight || "#ffffff"} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight || "#ffffff"}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight || "#ffffff"}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight || "#ffffff"}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed || 1}
        autoRotate={globeConfig.autoRotate !== false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  if (!hex || typeof hex !== 'string') return null;
  
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  // Add validation for parameters
  if (!isValidCoordinate(min) || !isValidCoordinate(max) || !isValidCoordinate(count)) {
    return [];
  }
  
  if (min >= max || count <= 0) {
    return [];
  }
  
  const arr = [];
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops
  
  while (arr.length < count && attempts < maxAttempts) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) {
      arr.push(r);
    }
    attempts++;
  }
  return arr;
}