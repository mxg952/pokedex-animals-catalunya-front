"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, ExternalLink } from "lucide-react"
import type { Animal } from "@/lib/types"
import { useEffect, useState } from "react"

interface MapCardProps {
  animal: Animal
  isLocked: boolean
}

export default function MapCard({ animal, isLocked }: MapCardProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Función para convertir URL de embed a URL normal de Google Maps
  const getNormalGoogleMapsUrl = (embedUrl: string): string => {
    try {
      // Si ya es un URL normal (no embed), devolverlo tal cual
      if (embedUrl.includes('/maps/') && !embedUrl.includes('/embed')) {
        return embedUrl
      }
      
      // Si es un URL de embed, intentar extraer las coordenadas para crear un URL normal
      const url = new URL(embedUrl)
      
      // Buscar coordenadas en el parámetro pb (el encoded map data)
      const pbParam = url.searchParams.get('pb')
      if (pbParam) {
        // El parámetro pb contiene datos codificados, pero es complejo de decodificar
        // En su lugar, podemos usar un enfoque más simple
      }
      
      // Para URLs de embed, simplemente usamos el mismo URL ya que son iframes válidos
      return embedUrl
      
    } catch (error) {
      console.error('Error procesando URL:', error)
      return embedUrl
    }
  }

  // Evitar renderizado en servidor
  if (!isClient) {
    return (
      <Card className="rounded-xl border-2 border-blue-200/20 bg-gradient-to-br from-blue-50/50 to-blue-100/30">
        <CardContent className="p-6">
          <div className="aspect-video rounded-lg bg-blue-100/50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-blue-700">Carregant mapa...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border-2 border-blue-200/20 bg-gradient-to-br from-blue-50/50 to-blue-100/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <MapPin className="h-5 w-5" />
          Ubicació i Mapa
          <ExternalLink className="h-4 w-4 ml-auto text-blue-600" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
  {animal.mapUrl ? (
    <>
      {/* Mapa interactivo - SIEMPRE VISIBLE */}
      <div className="aspect-video rounded-lg overflow-hidden border border-blue-200 shadow-sm relative">
        {/* Mapa embebido - USAR DIRECTAMENTE el URL de la BD - SIEMPRE VISIBLE */}
        <iframe
          src={animal.mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${animal.commonName}`}
        />
        
        {/* Overlay para abrir en Google Maps - SIEMPRE VISIBLE */}
        <a 
          href={animal.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-blue-700 opacity-0 hover:opacity-100 transition-opacity flex items-center gap-1 shadow-sm"
        >
          <ExternalLink className="h-3 w-3" />
          Obrir
        </a>
      </div>

      {/* Información de ubicación - SIEMPRE VISIBLE */}
      {animal.locationDescription && (
        <div className="bg-white/50 rounded-lg p-3 border border-blue-100">
          <p className="text-sm text-blue-800 leading-relaxed">
            {animal.locationDescription}
          </p>
        </div>
      )}
    </>
  ) : (
    /* Sin mapa definido */
    <div className="aspect-video rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 flex items-center justify-center">
      <div className="text-center p-6">
        <div className="mb-3 text-4xl">🗺️</div>
        <h4 className="font-semibold text-blue-900 mb-2">Sense mapa definit</h4>
        <p className="text-sm text-blue-700">
          No s'ha definit cap ubicació per a aquest animal
        </p>
      </div>
    </div>
  )}
</CardContent>
    </Card>
  )
}