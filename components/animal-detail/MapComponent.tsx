"use client"

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  animal: {
    commonName: string;
    locationDescription?: string;
  };
}

export default function MapComponent({ animal }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // ✅ MULTIPLES ZONES PER A CADA ANIMAL
  const getAnimalZones = (animalName: string): Array<{coords: [number, number], name: string, description: string}> => {
    const zones: { [key: string]: Array<{coords: [number, number], name: string, description: string}> } = {
      "Isard": [
        { coords: [42.65, 1.02], name: "Parc Nacional d'Aigüestortes", description: "Zones d'alta muntanya" },
        { coords: [42.40, 1.25], name: "Alt Pirineu", description: "Prades i boscos" },
        { coords: [42.25, 1.75], name: "Cadí-Moixeró", description: "Serralades rocoses" },
        { coords: [42.15, 2.10], name: "Garrotxa", description: "Zones volcàniques" }
      ],
      "Àliga": [
        { coords: [42.30, 1.80], name: "Serra del Cadí", description: "Cingles i penya-segats" },
        { coords: [41.85, 2.25], name: "Montseny", description: "Boscos densos" },
        { coords: [42.10, 0.95], name: "Pallars Sobirà", description: "Zones rocoses" },
        { coords: [41.45, 1.90], name: "Montserrat", description: "Cims emblemàtics" }
      ],
      "Tortuga mediterrània": [
        { coords: [41.45, 2.10], name: "Garraf", description: "Zones mediterrànies" },
        { coords: [41.60, 2.45], name: "Costa Maresme", description: "Pinedes costaneres" },
        { coords: [41.30, 1.85], name: "Penedès", description: "Zones agrícoles" },
        { coords: [41.15, 1.25], name: "Costa Daurada", description: "Dunes i platges" }
      ],
      "Gamarús": [
        { coords: [42.20, 2.80], name: "Albera", description: "Boscos humits" },
        { coords: [41.95, 2.35], name: "Guilleries", description: "Rouredes" },
        { coords: [42.00, 2.15], name: "Collsacabra", description: "Boscos de fajosa" },
        { coords: [41.75, 2.50], name: "Montnegre", description: "Zones ombrívoles" }
      ],
      "Barrallet": [
        { coords: [41.55, 0.65], name: "Riu Ebre", description: "Aigües tranquil·les" },
        { coords: [41.85, 0.85], name: "Riu Segre", description: "Corrents fluvials" },
        { coords: [42.35, 1.40], name: "Riu Noguera", description: "Zones d'aigua dolça" },
        { coords: [41.70, 2.85], name: "Riu Ter", description: "Desembocadures" }
      ]
    };
    
    return zones[animalName] || [
      { coords: [41.5912, 1.5209], name: "Catalunya Central", description: "Zones diverses" }
    ];
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // ✅ CORRECCIÓN: Configurar los iconos de forma segura
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = defaultIcon;

    const zones = getAnimalZones(animal.commonName);
    
    // ✅ Calcula el centre mitjà de totes les zones
    const avgLat = zones.reduce((sum, zone) => sum + zone.coords[0], 0) / zones.length;
    const avgLng = zones.reduce((sum, zone) => sum + zone.coords[1], 0) / zones.length;

    // Inicialitza el mapa al centre mitjà
    const map = L.map(mapContainer.current).setView([avgLat, avgLng], 8);
    mapRef.current = map;

    // Capa d'OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // ✅ Crea el featureGroup primero
    const featureGroup = L.featureGroup();

    // ✅ AFEGEIX MULTIPLES MARCADORS al mapa Y al featureGroup
    zones.forEach((zone, index) => {
      const marker = L.marker(zone.coords)
        .addTo(map)
        .bindPopup(`
          <div class="text-sm">
            <strong>${zone.name}</strong><br/>
            <em>${zone.description}</em><br/>
            <span class="text-xs text-gray-600">Zona ${index + 1} per a ${animal.commonName}</span>
          </div>
        `);
      
      featureGroup.addLayer(marker);
    });

    // ✅ Ajusta los bounds
    map.fitBounds(featureGroup.getBounds(), { padding: [20, 20] });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [animal.commonName]);

  return (
    <div 
      ref={mapContainer} 
      className="aspect-video rounded-md overflow-hidden shadow-md"
    />
  );
}